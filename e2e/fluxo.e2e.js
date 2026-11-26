/* Fluxo principal no navegador: buscar, abrir o detalhe pelo teclado e voltar, com o foco no título a cada troca de rota; link direto; SWAPI fora do ar; axe e corte lateral em cada tela. Roda na mesa e a 320 px (playwright.config.js) */
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

/* Sem rolagem lateral e sem conteúdo cortado nas bordas (#50). Duas medidas:
   1. a largura do documento não passa da área visível;
   2. nenhum elemento visível passa da borda direita nem da esquerda.
   Não tirar a 2ª: é a única que pega o corte por overflow: hidden (que não muda o scrollWidth)
   e o corte à esquerda (que não gera rolagem). As mutações da R19 do #57 provaram os dois casos.
   Ficam de fora o invisível de propósito: visibility: hidden, opacity: 0 e o .sr-only (1 x 1 px) */
async function semCorteLateral(page) {
  const { largura, janela, fora } = await page.evaluate(() => {
    const janela = document.documentElement.clientWidth;
    const fora = [...document.querySelectorAll("body *")]
      .filter((e) => {
        const c = e.getBoundingClientRect();
        if (c.width <= 1 || c.height <= 1) return false;
        if (c.right <= janela + 1 && c.left >= -1) return false;
        const s = getComputedStyle(e);
        return s.visibility !== "hidden" && s.opacity !== "0";
      })
      .slice(0, 5)
      .map((e) => e.tagName + (e.id ? `#${e.id}` : "") + (e.classList[0] ? `.${e.classList[0]}` : "") + ` (${Math.round(e.getBoundingClientRect().left)} a ${Math.round(e.getBoundingClientRect().right)} px)`);
    return { largura: document.documentElement.scrollWidth, janela, fora };
  });
  expect(largura, "rolagem lateral").toBeLessThanOrEqual(janela);
  expect(fora, "elementos além das bordas").toEqual([]);
}

/* axe com as regras WCAG 2.0 e 2.1, níveis A e AA; antes, a medida de corte lateral */
async function semViolacoes(page) {
  await semCorteLateral(page);
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

  /* Só teclado desde o topo: Tab (logotipo), Tab (campo de busca), digitar e Enter */
  const campo = page.getByLabel("Buscar personagem pelo nome");
  /* O texto de exemplo cabe inteiro no campo, com o "Luke", nos 2 projetos (#58: a 320 px, "Buscar pelo nome (ex.: Luke)" pedia 209 px e o campo tinha 152).
     Mede como aparece na tela (R19 do QA no #61): põe o exemplo no value com a fonte e o espaço entre letras do ::placeholder,
     compara o scrollWidth com o clientWidth e devolve o campo como estava. Confere também o contraste do exemplo (4,5:1) */
  const exemplo = await campo.evaluate((el) => {
    const antes = el.value;
    const ph = getComputedStyle(el, "::placeholder");
    el.value = el.placeholder;
    el.style.font = ph.font;
    el.style.letterSpacing = ph.letterSpacing;
    const r = { texto: el.placeholder, largura: el.scrollWidth, cabe: el.clientWidth, cor: ph.color, fundo: getComputedStyle(el).backgroundColor };
    el.style.font = "";
    el.style.letterSpacing = "";
    el.value = antes;
    return r;
  });
  expect(exemplo.texto, "o exemplo cita um nome").toContain("Luke");
  expect(exemplo.largura, `o exemplo "${exemplo.texto}" cabe no campo`).toBeLessThanOrEqual(exemplo.cabe);
  const lum = (cor) => {
    const [r, g, b] = cor.match(/[\d.]+/g).slice(0, 3).map((v) => { const s = Number(v) / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const fundo = /rgba\(0, 0, 0, 0\)|transparent/.test(exemplo.fundo) ? "rgb(255, 255, 255)" : exemplo.fundo;
  const [l1, l2] = [lum(exemplo.cor), lum(fundo)].sort((a, b) => b - a);
  expect((l1 + 0.05) / (l2 + 0.05), `contraste do exemplo (${exemplo.cor} sobre ${fundo})`).toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /ir para a lista de personagens/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(campo).toBeFocused();
  await page.keyboard.type("luke");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\?q=luke$/);
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(["Luke Skywalker"]);
  await expect(page).toHaveTitle("Busca: luke · Huntweb SWAPI");

  /* O foco segue no campo: Tab (Buscar), Tab (link do personagem), com o contorno do app (3px solid), e Enter */
  await expect(campo).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Buscar" })).toBeFocused();
  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: "Acessar os detalhes de Luke Skywalker" });
  await expect(link).toBeFocused();
  const contorno = await link.evaluate((el) => { const c = getComputedStyle(el); return `${c.outlineStyle} ${c.outlineWidth}`; });
  expect(contorno).toBe("solid 3px");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/huntweb-swapi\/people\/1$/);
  await expect(page.getByRole("heading", { level: 1, name: "Luke Skywalker" })).toBeVisible();
  /* A troca de rota leva o foco ao h1 do personagem (o link clicado sumiu da tela) */
  await expect(page.getByRole("heading", { level: 1, name: "Luke Skywalker" })).toBeFocused();
  await expect(page.getByText("Tatooine")).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveText(["Episódio IV: Uma Nova Esperança (1977)", "Episódio V: O Império Contra-Ataca (1980)"]);
  await expect(page).toHaveTitle("Luke Skywalker · Huntweb SWAPI");
  await semViolacoes(page);

  /* Voltar pelo teclado: Tab a partir do h1 até o botão "Voltar" e Enter */
  const voltar = page.getByRole("button", { name: "Voltar" });
  for (let i = 0; i < 5; i += 1) {
    if (await voltar.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(voltar).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\?q=luke$/);
  await expect(campo).toHaveValue("luke");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(["Luke Skywalker"]);
  /* De volta à lista, o foco vai para o título da página */
  await expect(page.getByRole("heading", { level: 1, name: "Personagens de Star Wars" })).toBeFocused();
  await semViolacoes(page);

  /* Voltar do navegador sai da busca: o campo acompanha a URL e fica vazio */
  await page.goBack();
  await expect(page).toHaveURL(/\/huntweb-swapi\/$/);
  await expect(campo).toHaveValue("");
  await expect(page.getByRole("heading", { name: "Leia Organa" })).toBeVisible();
});

test("o build tem o 404.html igual ao index.html, que o Pages usa para o link direto", async () => {
  const { readFileSync } = await import("node:fs");
  expect(readFileSync("build/404.html", "utf8")).toBe(readFileSync("build/index.html", "utf8"));
});

test("abrir o detalhe direto pelo endereço e ver a página não encontrada", async ({ page }) => {
  await simularSwapi(page);
  await page.goto("./people/5");
  await expect(page.getByRole("heading", { level: 1, name: "Leia Organa" })).toBeVisible();
  await expect(page.getByText("Alderaan")).toBeVisible();
  /* Na primeira carga o foco fica no topo: só a troca de rota move o foco */
  await expect(page.getByRole("heading", { level: 1, name: "Leia Organa" })).not.toBeFocused();

  await page.goto("./people/999");
  await expect(page.getByRole("heading", { name: "Personagem não encontrado" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tentar de novo" })).toHaveCount(0);
  await semCorteLateral(page);

  await page.goto("./nada-aqui");
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
  await semCorteLateral(page);
  await page.getByRole("link", { name: "Voltar para a lista" }).click();
  await expect(page.getByRole("heading", { name: "C-3PO" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Personagens de Star Wars" })).toBeFocused();
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
