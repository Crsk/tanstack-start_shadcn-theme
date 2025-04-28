# TanStack Start + Shadcn UI Dark Theme

## 1. Theme Server Functions

Create a file `src/lib/theme.ts` to handle server-side theme operations:

```ts
import { type Theme } from "~/providers/theme-provider";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export const THEME_COOKIE_KEY = "ui-theme";
export const THEME_VALUES = ["light", "dark", "system"] as const;

export const getThemeServerFn = createServerFn().handler(async () => {
  return (getCookie(THEME_COOKIE_KEY) || "light") as Theme;
});

export const setThemeServerFn = createServerFn({ method: "POST" })
  .validator((data: Theme) => {
    if (!THEME_VALUES.includes(data)) throw new Error("Invalid theme provided");

    return data;
  })
  .handler(async ({ data }) => {
    setCookie(THEME_COOKIE_KEY, data);
  });
```

## 2. Theme Provider

Create a theme provider in `src/providers/theme-provider.tsx`:

```tsx
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
```

## 3. Root Route Setup

Update your root route (`src/routes/__root.tsx`):

```tsx
import { ThemeProvider } from "~/providers/theme-provider";
import { getThemeServerFn } from "~/lib/theme";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  // ... other configuration
  component: RootComponent,
  loader: () => getThemeServerFn(),
});

function RootComponent() {
  const initialTheme = Route.useLoaderData();

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  return (
    <html className={currentTheme}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

## 4. Theme Toggle Component

```tsx
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTheme } from "~/providers/theme-provider";

export function ThemeToggle() {
  const { currentTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {currentTheme === "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
```
