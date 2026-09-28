/* Build com Vite (substitui react-scripts 2) e testes com Vitest; publicado no GitHub Pages em /huntweb-swapi/ */
/// <reference types="vitest/config" />
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const REPO_BASE = "/huntweb-swapi/";

/* Gera build/404.html igual ao index.html: o GitHub Pages entrega esse arquivo em deep links (/huntweb-swapi/people/1) e o roteador assume */
function spaFallback() {
  return {
    name: "spa-fallback-404",
    apply: "build",
    closeBundle() {
      copyFileSync(resolve("build/index.html"), resolve("build/404.html"));
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
