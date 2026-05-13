import { z } from "zod";

import {
  searchFormSchema,
  searchResultSchema,
  fetchInfoSchema,
  fetchInfoResultSchema,
  apiErrorSchema,
  sendVoteSchema,
  ratedMoviesResultSchema,
} from "~/schemas/movies";

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT;

export async function fetchMovies(
  data: z.infer<typeof searchFormSchema>,
): Promise<z.infer<typeof searchResultSchema> | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/movies?query=${data.Query}&page=${data.Page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.ok) {
      const parsed = searchResultSchema.safeParse(await response.json());
      if (parsed.success) {
        return parsed.data;
      } else {
        console.error(parsed.error);
      }
    } else {
      try {
        const parsed = apiErrorSchema.safeParse(await response.json());
        if (parsed.success) {
          console.error("Erro:", parsed.data.error);
        }
      } catch {
        console.error("Erro:", "Erro desconhecido");
      }
    }
  } catch (error) {
    console.error("Erro:", error);
  }

  return null;
}

export async function fetchMovieInfo(
  data: z.infer<typeof fetchInfoSchema>,
): Promise<z.infer<typeof fetchInfoResultSchema> | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${data.MovieId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const parsed = fetchInfoResultSchema.safeParse(await response.json());
      if (parsed.success) {
        return parsed.data;
      } else {
        console.error(parsed.error);
      }
    } else {
      try {
        const parsed = apiErrorSchema.safeParse(await response.json());
        if (parsed.success) {
          console.error("Erro:", parsed.data.error);
        }
      } catch {
        console.error("Erro:", "Erro desconhecido");
      }
    }
  } catch (error) {
    console.error("Erro:", error);
  }

  return null;
}

export async function fetchRatedMovies(): Promise<
  z.infer<typeof ratedMoviesResultSchema> | null
> {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/rated`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const parsed = ratedMoviesResultSchema.safeParse(await response.json());
      if (parsed.success) {
        return parsed.data;
      } else {
        console.error(parsed.error);
      }
    } else {
      try {
        const parsed = apiErrorSchema.safeParse(await response.json());
        if (parsed.success) {
          console.error("Erro:", parsed.data.error);
        }
      } catch {
        console.error("Erro:", "Erro desconhecido");
      }
    }
  } catch (error) {
    console.error("Erro:", error);
  }

  return null;
}

export async function sendVote(data: z.infer<typeof sendVoteSchema>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movie_id: data.MovieId,
        user_rating: data.Rating,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      try {
        const parsed = apiErrorSchema.safeParse(await response.json());
        if (parsed.success) {
          console.error("Erro:", parsed.data.error);
        }
      } catch {
        console.error("Erro:", "Erro desconhecido");
      }
    }
  } catch (error) {
    console.error("Erro:", error);
  }

  return false;
}
