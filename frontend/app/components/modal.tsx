import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { Input } from "./ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { sendVoteSchema } from "~/schemas/movies";

import { ImageOff, CircleX, CircleCheck } from "lucide-react";

import { sendVote } from "~/lib/movies";

interface MovieModalProps {
  movieId: number;
  onClose: () => void;
}

import { z } from "zod";

import { fetchInfoResultSchema } from "~/schemas/movies";

import { fetchMovieInfo } from "~/lib/movies";
import { Button } from "./ui/button";

export function MovieModal({ movieId, onClose }: MovieModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] =
    useState<z.infer<typeof fetchInfoResultSchema>>(Object);
  const [voteSuccess, setVoteSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await fetchMovieInfo({ MovieId: movieId });
        if (results) {
          setData(results);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [movieId]);

  const form = useForm({
    resolver: zodResolver(sendVoteSchema),
    defaultValues: {
      MovieId: movieId,
      Rating: 0.0,
    },
  });

  async function handleVote(formData: z.infer<typeof sendVoteSchema>) {
    const success = await sendVote(formData);
    if (success) {
      setVoteSuccess(true);
      setData((prev) => ({ ...prev, user_vote: formData.Rating }));
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh]  overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center m-8">
            <Spinner className="size-8" />
          </div>
        ) : (
          <>
            <CardHeader className="flex top-0 border-b justify-between">
              <CardTitle className="text-2xl">{data.title}</CardTitle>
              <Button onClick={onClose}>
                <CircleX />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {data.poster_url === "" ? (
                  <div className="relative z-20 aspect-video w-sm object-cover brightness-40">
                    <ImageOff className="size-full"></ImageOff>
                  </div>
                ) : (
                  <img
                    src={data.poster_url}
                    alt="Cartaz do filme"
                    className="relative z-20 aspect-video w-sm object-cover brightness-60  dark:brightness-40"
                  />
                )}
                <div className="grid grid-cols-2 content-start gap-1">
                  <strong>Sua avaliação</strong>
                  <div>
                    {data.user_vote !== -1.0 ? data.user_vote : "Não avaliado"}
                  </div>
                  <strong>Nova avaliação</strong>
                  <form
                    onSubmit={form.handleSubmit(handleVote)}
                    className="flex gap-2 mb-8 "
                  >
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      {...form.register("Rating")}
                      required
                    />
                    <Button type="submit">Enviar</Button>
                    {voteSuccess && (
                      <CircleCheck className="size-8 text-green-500 self-center" />
                    )}
                  </form>
                  <strong>Gêneros:</strong>
                  <div>
                    {data.genres.length !== 0
                      ? data.genres.map((genre) => `${genre}, `)
                      : "N/A"}
                  </div>
                  <strong>Data de lançamento:</strong>
                  <div>
                    {data.release_date !== "" ? data.release_date : "N/A"}
                  </div>
                  <strong>Tempo de duração:</strong>
                  <div>
                    {data.runtime !== 0 ? `${data.runtime} minutos` : "N/A"}
                  </div>
                  <strong>Avaliação geral:</strong>
                  <div>
                    {data.vote_average !== 0.0
                      ? `${data.vote_average}/10`
                      : "Sem avaliações"}
                  </div>
                  <strong className="col-span-2 mt-4">Sinopse:</strong>
                  <span className="col-span-2">
                    {data.overview !== ""
                      ? data.overview
                      : "Não há sinpose disponível no momento"}
                  </span>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
