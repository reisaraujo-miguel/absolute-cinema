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

const formSchema = z.object({
  Query: z.string().min(1, "O termo de pesquisa é obrigatório"),
});

const resultSchema = z.object({
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

const apiErrorSchema = z.object({
  error: z.string(),
});

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT;

export function SearchPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Query: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movies?query=${data.Query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const parsed = resultSchema.safeParse(await response.json());
        if (parsed.success) {
          console.log(parsed.data.results);
        } else {
          console.log(parsed.error);
        }
      } else {
        let message = "Erro desconhecido";
        try {
          const parsed = apiErrorSchema.safeParse(await response.json());
          if (parsed.success) {
            message = parsed.data.error;
          }
        } catch {
          // Non-JSON response, use default message
        }
        console.error("Erro:", message);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center m-8">
        <img src={AbsoluteCinemaImg} />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
    </>
  );
}
