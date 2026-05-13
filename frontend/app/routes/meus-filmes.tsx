import type { Route } from "./+types/meus-filmes";
import { MeusFilmesPage } from "../meus-filmes/meus-filmes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meus Filmes - Absolute Cinema" },
    {
      name: "description",
      content: "Veja todos os filmes que você avaliou!",
    },
  ];
}

export default function MeusFilmes() {
  return <MeusFilmesPage />;
}

