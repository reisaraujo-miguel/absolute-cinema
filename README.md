# absolute-cinema

A full-stack web application to search movies on TMDB, rate them, and view your rated movies.

## Tech Stack

- **Frontend**: React 19 + React Router 7 + Tailwind CSS + shadcn/ui
- **Backend**: Python 3.14+ Flask API
- **Database**: PostgreSQL 18
- **Cache**: Redis 8

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- A [TMDB API key](https://www.themoviedb.org/settings/api)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/reisaraujo-miguel/absolute-cinema.git
cd absolute-cinema
```

### 2. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set the required variables:

```env
TMDB_API_KEY="your_tmdb_api_key_here"
DB_PASSWORD="YourSuperDuper-$3curePa$$"
```

### 3. Build and start the application

```bash
docker compose up --build
```

This will build and start all four services:

| Service       | Port           | URL                         |
| ------------- | -------------- | --------------------------- |
| Frontend      | 8080           | http://localhost:8080       |
| Backend       | 5000           | http://localhost:5000       |
| Database      | 5432           | localhost:5432 (restricted) |
| Redis         | ------- SEARCH |
| Internal only |

### 4. Access the application

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Usage

1. **Search movies** – Use the search bar on the home page to find movies by title.
2. **Rate a movie** – Click on a movie poster to open the detail modal, then enter a rating (0–10).
3. **View rated movies** – Click "Meus Filmes" in the navigation bar to see all movies you've rated.

## Development

### Running without Docker

#### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your TMDB_API_KEY and DB_PASSWORD

# Using uv (recommended)
uv sync
uv run python app.py

# Or using pip
pip install -r requirements.txt  # if requirements.txt exists
python app.py
```

#### Frontend

```bash
cd frontend
cp .env.example .env
# Edit VITE_API_ENDPOINT if needed (default: http://127.0.0.1:5000)

bun install
bun run dev
```

## Project Structure

```
absolute-cinema/
├── backend/          # Flask API server
│   ├── app.py        # Main application
│   └── pyproject.toml
├── database/         # PostgreSQL setup
│   ├── Dockerfile
│   └── schema/       # Database initialization scripts
├── frontend/         # React Router web application
│   ├── app/          # Application source code
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Utility functions and API client
│   │   ├── schemas/     # Zod validation schemas
│   │   ├── search/      # Search page
│   │   └── meus-filmes/ # Rated movies page
│   └── Dockerfile
├── docker-compose.yml # Docker Compose configuration
└── .env.example       # Environment variables template
```
