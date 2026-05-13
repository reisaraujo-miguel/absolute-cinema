import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

import { Search } from "lucide-react";
import AbsoluteCinemaImg from "./absolute-cinema.jpg";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

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
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [movies, setMovies] = useState<
    z.infer<typeof searchResultSchema>["results"]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  async function handleSearch(data: z.infer<typeof searchFormSchema>) {
    setIsLoading(true);
    setCurrentPage(1);
    setQuery(data.Query);
    try {
      const results = await fetchMovies(data);
      if (results) {
        setMovies(results.results);
        setTotalPages(results.total_pages);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMore() {
    if (isFetchingMore || currentPage >= totalPages) return;
    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const results = await fetchMovies({ Query: query, Page: nextPage });
      if (results) {
        setMovies((prev) => [...prev, ...results.results]);
        setCurrentPage(nextPage);
        setTotalPages(results.total_pages);
      }
    } finally {
      setIsFetchingMore(false);
    }
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentPage, totalPages, isFetchingMore, query]);

  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      Query: "",
      Page: 1,
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
        <>
          <div className="grid grid-cols-3 gap-4 m-8">
            {movies.map((movie) => (
              <Poster
                key={movie.id}
                posterUrl={movie.poster_url}
                title={movie.title}
                releaseDate={movie.release_date}
              ></Poster>
            ))}
          </div>
          <div ref={sentinelRef} className="h-8" />
          {isFetchingMore && (
            <div className="flex justify-center m-4 mb-8">
              <Spinner className="size-6" />
            </div>
          )}
        </>
      )}
    </>
  );
}
