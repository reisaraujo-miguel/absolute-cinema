import os

import psycopg2
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from psycopg2.extras import RealDictCursor

load_dotenv()

app = Flask(__name__)
CORS(app)


TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
)

DEFAULT_LANG = "pt-BR"


def tmdb_get(path: str, params: dict) -> dict:
    """Helper to call TMDB and raise on HTTP errors."""
    if not TMDB_API_KEY:
        raise RuntimeError("TMDB_API_KEY environment variable is not set.")
    params["api_key"] = TMDB_API_KEY
    response = requests.get(f"{TMDB_BASE_URL}{path}", params=params, timeout=10)
    response.raise_for_status()
    return response.json()


@app.route("/search/movies", methods=["GET"])
def search_movies():
    """
    Search for movies by title.

    Query params:
        query     (required) – movie title to search for
        page      (optional) – results page number (default: 1)
        language  (optional) – ISO 639-1 language code (default: DEFAULT_LANG)

    Example:
        GET /search/movies?query=Inception&page=1
    """
    query = request.args.get("query", "").strip()
    if not query:
        return jsonify({"error": "Missing required query parameter: 'query'"}), 400

    page = request.args.get("page", 1)
    language = request.args.get("language", DEFAULT_LANG)

    try:
        data = tmdb_get(
            "/search/movie",
            {"query": query, "page": page, "language": language},
        )
    except RuntimeError as err:
        return jsonify({"error": str(err)}), 500
    except requests.HTTPError as err:
        status_code = err.response.status_code if err.response is not None else 500

        return (
            jsonify({"error": f"TMDB error: {status_code}"}),
            status_code,
        )
    except requests.RequestException as err:
        return jsonify({"error": f"Request failed: {str(err)}"}), 503

    movies = [
        {
            "id": m["id"],
            "title": m.get("title", ""),
            "release_date": m.get("release_date", ""),
            "overview": m.get("overview", ""),
            "vote_average": m.get("vote_average", 0.0),
            "poster_url": (
                f"https://image.tmdb.org/t/p/w500{m['poster_path']}"
                if m.get("poster_path")
                else ""
            ),
        }
        for m in data.get("results", [])
    ]

    return jsonify(
        {
            "page": data.get("page"),
            "total_results": data.get("total_results"),
            "total_pages": data.get("total_pages"),
            "results": movies,
        }
    )


@app.route("/movies/<int:movie_id>", methods=["GET"])
def get_movie(movie_id: int):
    """
    Fetch full details for a single movie by its TMDB ID.

    Example:
        GET /movies/27205
    """
    language = request.args.get("language", DEFAULT_LANG)

    try:
        data = tmdb_get(f"/movie/{movie_id}", {"language": language})
    except RuntimeError as err:
        return jsonify({"error": str(err)}), 500
    except requests.HTTPError as err:
        status_code = err.response.status_code if err.response is not None else 500
        return (
            jsonify({"error": f"TMDB error: {status_code}"}),
            status_code,
        )
    except requests.RequestException as err:
        return jsonify({"error": f"Request failed: {str(err)}"}), 503

    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT rating from user_ratings WHERE id = %s",
                (movie_id,),
            )
            user_rating = cur.fetchone()
    except Exception as err:
        return jsonify({"error": str(err)}), 500

    return jsonify(
        {
            "id": data["id"],
            "title": data.get("title", ""),
            "tagline": data.get("tagline", ""),
            "overview": data.get("overview", ""),
            "release_date": data.get("release_date", ""),
            "runtime": data.get("runtime", 0),
            "vote_average": data.get("vote_average", 0.0),
            "user_vote": user_rating[0] if user_rating[0] is not None else -1.0,
            "genres": [g["name"] for g in data.get("genres", [])],
            "poster_url": (
                f"https://image.tmdb.org/t/p/w500{data['poster_path']}"
                if data.get("poster_path")
                else ""
            ),
        }
    )


@app.route("/vote", methods=["POST"])
def vote():
    # validating input
    try:
        data = request.get_json()
    except Exception as err:
        return jsonify({"error": str(err)}), 500

    movie_id = int(data.get("movie_id"))
    user_rating = float(data.get("user_rating"))

    if movie_id is None or user_rating is None:
        return jsonify({"error": "Must provide movie_id and user_rating"}), 400

    if user_rating > 10 or user_rating < 0:
        return jsonify({"error": "rating must be between 0 and 10"}), 400

    # database insertion
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO user_ratings (id, rating) VALUES (%s, %s)
                ON CONFLICT (id) DO UPDATE SET rating = EXCLUDED.rating""",
                (movie_id, user_rating),
            )
        conn.commit()
    except Exception as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500

    return jsonify("success")


@app.route("/movies/rated", methods=["GET"])
def get_rated_movies():
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, rating from user_ratings")
            rows = cur.fetchall()
    except Exception as err:
        return jsonify({"error": str(err)}), 500

    return jsonify({"results": rows})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
