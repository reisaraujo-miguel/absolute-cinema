import type { Route } from "./+types/search";
import { SearchPage } from "../search/search";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Absolute Cinema" },
    { name: "description", content: "Isso é absolute cinema!" },
  ];
}

export default function Search() {
  return <SearchPage />;
}
