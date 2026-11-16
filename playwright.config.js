/* Playwright: fluxo principal no Chromium sobre o build (npm run preview, base /huntweb-swapi/). Só modo claro: o CSS não tem prefers-color-scheme, o app não tem tema escuro próprio */
import { defineConfig, devices } from "@playwright/test";

/* Porta própria para não colidir com outros projetos na mesma máquina */
const PORT = Number(process.env.E2E_PORT || 4317);

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.js",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}/huntweb-swapi/`,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], colorScheme: "light" } }],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/huntweb-swapi/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
/* Fim de playwright.config.js */
