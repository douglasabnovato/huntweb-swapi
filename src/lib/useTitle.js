/* Título da aba por página: numa SPA o título não muda sozinho com a rota (WCAG 2.4.2, Page Titled) */
import { useEffect } from "react";

export const APP_NAME = "Huntweb SWAPI";

export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
/* Fim de useTitle.js */
