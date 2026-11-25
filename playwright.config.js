/* Playwright: fluxo principal no Chromium sobre o build (npm run preview, base /huntweb-swapi/), na mesa e num celular de 320 px (#50). Só modo claro: o CSS não tem prefers-color-scheme, o app não tem tema escuro próprio */
import { defineConfig, devices } from "@playwright/test";

/* Porta própria para não colidir com outros projetos na mesma máquina */
const PORT = Number(process.env.E2E_PORT || 4317);

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.js",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  /* Sem nova tentativa: um teste instável precisa falhar, não ficar verde como "flaky" */
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}/huntweb-swapi/`,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], colorScheme: "light" } },
    /* 320 x 640 px: o menor celular comum e a régua de reflow da WCAG 1.4.10; o Pixel 7 dá o toque e o isMobile */
    { name: "celular-320", use: { ...devices["Pixel 7"], viewport: { width: 320, height: 640 }, colorScheme: "light" } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/huntweb-swapi/`,
    /* Sempre um build novo: reaproveitar a porta podia testar um build antigo ou de outro projeto */
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
/* Fim de playwright.config.js */
