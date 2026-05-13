import { z } from "zod";

export const searchFormSchema = z.object({
  Query: z.string().min(1, "O termo de pesquisa é obrigatório"),
  Page: z.int(),
});

export const searchResultSchema = z.object({
  page: z.int(),
  results: z.array(
    z.object({
      id: z.int(),
      overview: z.any(),
      poster_url: z.any(),
      release_date: z.any(),
      title: z.any(),
      vote_average: z.any(),
    }),
  ),
  total_pages: z.int(),
  total_results: z.int(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
});
