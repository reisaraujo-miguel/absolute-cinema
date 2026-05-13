import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { ImageOff } from "lucide-react";

export function Poster({ posterUrl, title, releaseDate }: any) {
  return (
    <Card>
      <CardHeader>
        {posterUrl === null ? (
          <div className="relative z-20 aspect-video w-full object-cover brightness-40">
            <ImageOff className="size-full"></ImageOff>
          </div>
        ) : (
          <img
            src={posterUrl}
            alt="Cartaz do filme"
            className="relative z-20 aspect-video w-full object-cover brightness-60  dark:brightness-40"
          />
        )}

        <CardTitle>{title}</CardTitle>
        <CardDescription>{releaseDate}</CardDescription>
      </CardHeader>
    </Card>
  );
}
