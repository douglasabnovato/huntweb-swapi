/* Fluxo principal no navegador: buscar, abrir o detalhe pelo teclado e voltar; link direto; SWAPI fora do ar; axe em cada tela */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const API = "https://swapi.dev/api";

/* Personagens fictícios no formato da SWAPI (count/next/results); planetas 1 e 2 vêm do JSON local */
const person = (id, name, planet = 1) => ({
  name, url: `${API}/people/${id}/`, homeworld: `${API}/planets/${planet}/`,
  birth_year: "19BBY", height: "172", mass: "77", gender: "male",
  hair_color: "blond", eye_color: "blue", skin_color: "fair",
  films: [`${API}/films/1/`, `${API}/films/2/`],
});
const TODOS = [person(1, "Luke Skywalker"), person(2, "C-3PO"), person(3, "R2-D2", 8), person(5, "Leia Organa", 2)];

/* Simula a SWAPI: lista paginada com busca, detalhe e 404; com fora=true responde 503 */
async function simularSwapi(page, estado = { fora: false }) {
  await page.route(`${API}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (estado.fora) return route.fulfill({ status: 503, json: {} });
    const lista = url.pathname.match(/\/people\/$/);
    if (lista) {
      const termo = (url.searchParams.get("search") || "").toLowerCase();
      const results = TODOS.filter((p) => p.name.toLowerCase().includes(termo));
      return route.fulfill({ json: { count: results.length, next: null, previous: null, results } });
    }
    const um = url.pathname.match(/\/people\/(\d+)\/$/);
    const achado = um && TODOS.find((p) => p.url.endsWith(`/people/${um[1]}/`));
    if (achado) return route.fulfill({ json: achado });
    return route.fulfill({ status: 404, json: { detail: "Not found" } });
  });
  return estado;
}

/* axe com as regras WCAG 2.0 e 2.1, níveis A e AA */
async function semViolacoes(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
}

test("buscar, abrir o detalhe pelo teclado e voltar com a busca mantida", async ({ page }) => {
  await simularSwapi(page);
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Leia Organa" })).toBeVisible();
  await expect(page.getByText("Alderaan")).toBeVisible();
  await expect(page).toHaveTitle("Personagens · Huntweb SWAPI");
  await semViolacoes(page);

  /* Busca: digitar e Enter */
  const campo = page.getByLabel("Buscar personagem pelo nome");
  await campo.fill("luke");
  await campo.press("Enter");
  await expect(page).toHaveURL(/\?q=luke$/);
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(["Luke Skywalker"]);
  await expect(page).toHaveTitle("Busca: luke · Huntweb SWAPI");

  /* Teclado: Tab do botão Buscar até o link do personagem, com foco visível, e Enter */
  await page.getByRole("button", { name: "Buscar" }).focus();
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: "Acessar os detalhes de Luke Skywalker" });
  await expect(link).toBeFocused();
  const contorno = await link.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(contorno).not.toBe("none");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/huntweb-swapi\/people\/1$/);
  await expect(page.getByRole("heading", { level: 1, name: "Luke Skywalker" })).toBeVisible();
  await expect(page.getByText("Tatooine")).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveText(["Episódio IV: Uma Nova Esperança (1977)", "Episódio V: O Império Contra-Ataca (1980)"]);
  await expect(page).toHaveTitle("Luke Skywalker · Huntweb SWAPI");
  await semViolacoes(page);

  /* Voltar pelo teclado: a lista volta com a busca no campo e na URL */
  await page.getByRole("button", { name: "Voltar" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\?q=luke$/);
  await expect(campo).toHaveValue("luke");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(["Luke Skywalker"]);
});

test("abrir o detalhe direto pelo endereço e ver a página não encontrada", async ({ page }) => {
  await simularSwapi(page);
  await page.goto("./people/5");
  await expect(page.getByRole("heading", { level: 1, name: "Leia Organa" })).toBeVisible();
  await expect(page.getByText("Alderaan")).toBeVisible();

  await page.goto("./people/999");
  await expect(page.getByRole("heading", { name: "Personagem não encontrado" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tentar de novo" })).toHaveCount(0);

  await page.goto("./nada-aqui");
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar para a lista" }).click();
  await expect(page.getByRole("heading", { name: "C-3PO" })).toBeVisible();
});

test("SWAPI fora do ar: aviso acessível e nova tentativa", async ({ page }) => {
  const estado = await simularSwapi(page, { fora: true });
  await page.goto("./");
  await expect(page.getByRole("alert")).toContainText("indisponível");
  await semViolacoes(page);
  estado.fora = false;
  await page.getByRole("button", { name: "Tentar de novo" }).click();
  await expect(page.getByRole("heading", { name: "Luke Skywalker" })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
/* Fim de fluxo.e2e.js */
