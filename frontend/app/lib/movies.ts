import { z } from "zod";

import {
  searchFormSchema,
  searchResultSchema,
  apiErrorSchema,
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
