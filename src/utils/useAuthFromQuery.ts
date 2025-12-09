// src/utils/useAuthFromQuery.ts
import { useEffect, useState } from "react";
import { restoreSessionFromTokens } from "./supabaseClient";

export function useAuthFromQuery() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const environment = import.meta.env.VITE_DEVELOPMENT_ENVIRONMENT;

  useEffect(() => {
    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const accessToken = url.searchParams.get("at");
        const refreshToken = url.searchParams.get("rt");
        const localization = url.searchParams.get("l");

        if (localization) {
          localStorage.setItem("localization", localization);
        }

        if (accessToken && refreshToken) {
          await restoreSessionFromTokens(accessToken, refreshToken);

          if (environment !== "dev") {
            url.searchParams.delete("at");
            url.searchParams.delete("rt");
            url.searchParams.delete("l");
            window.history.replaceState({}, document.title, url.toString());
          }
        }
      } catch (err) {
        console.error("useAuthFromQuery init error:", err);
      } finally {
        setIsAuthReady(true);
      }
    };

    init();
  }, []);

  return { isAuthReady };
}
