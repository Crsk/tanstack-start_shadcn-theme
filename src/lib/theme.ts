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
