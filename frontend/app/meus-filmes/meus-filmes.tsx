import { useEffect, useState } from "react";
import { z } from "zod";

import { Poster } from "~/components/poster";
import { MovieModal } from "~/components/modal";
import { Spinner } from "~/components/ui/spinner";

import { fetchRatedMovies, fetchMovieInfo } from "~/lib/movies";
import type { fetchInfoResultSchema } from "~/schemas/movies";

interface RatedMovieInfo {
  id: number;
  rating: number;
  details: z.infer<typeof fetchInfoResultSchema> | null;
}

export function MeusFilmesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<RatedMovieInfo[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    async function loadRatedMovies() {
      setIsLoading(true);
      try {
        const ratedResult = await fetchRatedMovies();
        if (ratedResult) {
          const ratedMovies: RatedMovieInfo[] = await Promise.all(
            ratedResult.results.map(async (rated) => {
              const details = await fetchMovieInfo({ MovieId: rated.id });
              return {
                id: rated.id,
                rating: rated.rating,
                details,
              };
            }),
          );
          setMovies(ratedMovies);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadRatedMovies();
  }, []);

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Meus Filmes</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center m-8">
          <Spinner className="size-8" />
        </div>
      ) : movies.length === 0 ? (
        <div className="flex justify-center m-8">
          <p className="text-muted-foreground">
            Nenhum filme avaliado ainda. Volte para a pesquisa e avalie alguns filmes!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 m-8">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => setSelectedMovieId(movie.id)}
            >
              <Poster
                posterUrl={movie.details?.poster_url ?? ""}
                title={movie.details?.title ?? `Filme #${movie.id}`}
                releaseDate={movie.details?.release_date ?? ""}
              />
            </button>
          ))}
        </div>
      )}

      {selectedMovieId !== null && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </>
  );
}

