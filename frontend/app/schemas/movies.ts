import { z } from "zod";

export const searchFormSchema = z.object({
  Query: z.string().min(1, "O termo de pesquisa é obrigatório"),
  Page: z.int(),
});

export const sendVoteSchema = z.object({
  MovieId: z.int(),
  Rating: z.coerce.number().min(0).max(10),
});

export const searchResultSchema = z.object({
  page: z.int(),
  results: z.array(
    z.object({
      id: z.int(),
      overview: z.string(),
      poster_url: z.string(),
      release_date: z.string(),
      title: z.string(),
      vote_average: z.float64(),
    }),
  ),
  total_pages: z.int(),
  total_results: z.int(),
});

export const fetchInfoSchema = z.object({
  MovieId: z.int(),
});

export const fetchInfoResultSchema = z.object({
  id: z.int(),
  title: z.string(),
  tagline: z.string(),
  overview: z.string(),
  release_date: z.string(),
  runtime: z.int(),
  vote_average: z.float64(),
  user_vote: z.float64(),
  genres: z.array(z.string()),
  poster_url: z.string(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
});

export const ratedMovieSchema = z.object({
  id: z.int(),
  rating: z.float64(),
});

export const ratedMoviesResultSchema = z.object({
  results: z.array(ratedMovieSchema),
});
