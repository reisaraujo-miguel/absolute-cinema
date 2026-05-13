import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";

import { ImageOff } from "lucide-react";

import { CircleX } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[80vh]  overflow-y-auto">
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
                  <strong>Avaliação:</strong>
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
