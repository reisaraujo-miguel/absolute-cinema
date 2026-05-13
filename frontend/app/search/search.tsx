import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Search } from "lucide-react";
import AbsoluteCinemaImg from "./absolute-cinema.jpg";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";

import { Spinner } from "~/components/ui/spinner";

import {
  searchFormSchema,
  searchResultSchema,
  apiErrorSchema,
} from "~/schemas/movies";

import { fetchMovies } from "~/lib/movies";
import { Poster } from "~/components/poster";

export function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<
    z.infer<typeof searchResultSchema>["results"]
  >([]);

  async function handleSearch(data: z.infer<typeof searchFormSchema>) {
    setIsLoading(true);
    try {
      const results = await fetchMovies(data);
      if (results) {
        setMovies(results);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      Query: "",
    },
  });

  return (
    <>
      <div className="flex justify-center m-8">
        <img src={AbsoluteCinemaImg} alt="Logo" />
      </div>
      <form onSubmit={form.handleSubmit(handleSearch)}>
        <div className="flex justify-center m-8">
          <InputGroup className="max-w-md">
            <InputGroupInput
              id="Query"
              placeholder="Pesquisar..."
              {...form.register("Query")}
              required
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end"></InputGroupAddon>
          </InputGroup>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center m-8">
          <Spinner className="size-8" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 m-8">
          {movies.map((movie) => (
            <Poster
              posterUrl={movie.poster_url}
              title={movie.title}
              releaseDate={movie.release_date}
            ></Poster>
          ))}
        </div>
      )}
    </>
  );
}
