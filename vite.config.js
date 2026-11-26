/* Build com Vite (substitui react-scripts 2) e testes com Vitest; publicado no GitHub Pages em /huntweb-swapi/ */
/// <reference types="vitest/config" />
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const REPO_BASE = "/huntweb-swapi/";

/* Ids dos 82 personagens da SWAPI (1 a 83; o 17 não existe, conferido em 26/11/2026: count 82, /people/17/ e /people/84/ dão 404) */
export const PEOPLE_IDS = Array.from({ length: 83 }, (_, i) => i + 1).filter((id) => id !== 17);

/* Gera build/404.html igual ao index.html: o GitHub Pages entrega esse arquivo nos caminhos sem arquivo e o roteador assume.
   Gera também build/people/<id>.html para cada personagem: o Pages serve /people/1 a partir de people/1.html com status 200,
   e a prévia de link (LinkedIn, buscadores) deixa de ver um 404 (#55). Um id que não existe segue no 404.html, com status 404 */
function spaFallback() {
  return {
    name: "spa-fallback-404",
    apply: "build",
    closeBundle() {
      copyFileSync(resolve("build/index.html"), resolve("build/404.html"));
      mkdirSync(resolve("build/people"), { recursive: true });
      for (const id of PEOPLE_IDS) copyFileSync(resolve("build/index.html"), resolve(`build/people/${id}.html`));
    },
  };
}

/* Base do repositório no build e no preview; raiz no servidor de desenvolvimento e nos testes */
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? REPO_BASE : "/",
  plugins: [react(), spaFallback()],
  build: { outDir: "build" },
  test: { environment: "jsdom" },
}));
/* Fim de vite.config.js */
