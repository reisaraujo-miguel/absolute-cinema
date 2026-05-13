import { NavLink } from "react-router";
import { Search, Star } from "lucide-react";
import { cn } from "~/lib/utils";

const navItems = [
  { to: "/", label: "Pesquisar", icon: Search },
  { to: "/meus-filmes", label: "Meus Filmes", icon: Star },
];

export function NavBar() {
  return (
    <nav className="flex justify-center gap-4 p-4 border-b border-border">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )
          }
        >
          <item.icon className="size-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

