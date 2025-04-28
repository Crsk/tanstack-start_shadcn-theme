import { useRouter } from "@tanstack/react-router";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { setThemeServerFn } from "~/lib/theme";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  currentTheme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({
  children,
  initialTheme,
}: PropsWithChildren<{ initialTheme: Theme }>) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme);
  const router = useRouter();

  const setTheme = async (theme: Theme) => {
    await setThemeServerFn({ data: theme });
    setCurrentTheme(theme);
    router.invalidate();
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
