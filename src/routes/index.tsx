import { createFileRoute } from "@tanstack/react-router";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTheme } from "~/providers/theme-provider";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { currentTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="p-2 flex gap-4">
      <Button>Welcome Home!!!</Button>

      <Button variant="ghost" onClick={toggleTheme}>
        {currentTheme === "light" ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  );
}
