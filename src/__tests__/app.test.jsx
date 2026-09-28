/* Testes: id a partir da URL, lista com planeta resolvido, paginação na URL, busca, erro e detalhe */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { idFromUrl } from "../lib/swapi";

const person = (id, name, planet = 1) => ({ name, birth_year: "19BBY", url: `https://swapi.dev/api/people/${id}/`, homeworld: `https://swapi.dev/api/planets/${planet}/`, height: "172", mass: "77", gender: "male", hair_color: "blond", eye_color: "blue", skin_color: "fair" });

let handler;
beforeEach(() => {
  cleanup();
  handler = () => [404, {}];
  globalThis.fetch = vi.fn(async (url) => {
    const [status, body] = handler(new URL(url));
    return { ok: status < 400, status, json: async () => body };
  });
});
const renderAt = (path) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe("swapi", () => {
  it("extrai ids de 1, 2 e 3 dígitos (antes substring(29, 31))", () => {
    expect(idFromUrl("https://swapi.dev/api/people/1/")).toBe("1");
    expect(idFromUrl("https://swapi.dev/api/people/83/")).toBe("83");
    expect(idFromUrl("https://swapi.info/api/people/100")).toBe("100");
  });
});

describe("lista", () => {
  it("mostra personagens com o nome do planeta e pagina", async () => {
    handler = (u) => {
      if (u.pathname.endsWith("/people/") && u.searchParams.get("page") === "1") return [200, { count: 12, next: "x", previous: null, results: [person(1, "Luke Skywalker"), person(12, "Wilhuff Tarkin", 21)] }];
      if (u.pathname.endsWith("/people/") && u.searchParams.get("page") === "2") return [200, { count: 12, next: null, previous: "x", results: [person(13, "Chewbacca", 14)] }];
      if (u.pathname.endsWith("/planets/21/")) return [200, { name: "Eriadu" }];
      if (u.pathname.endsWith("/planets/14/")) return [200, { name: "Kashyyyk" }];
      return [404, {}];
    };
    renderAt("/");
    expect(await screen.findByRole("heading", { name: "Luke Skywalker" })).toBeTruthy();
    expect(await screen.findByText("Tatooine")).toBeTruthy();
    expect(await screen.findByText("Eriadu")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ver detalhes de Wilhuff Tarkin" }).getAttribute("href")).toBe("/people/12");
    expect(screen.getByRole("button", { name: "Anterior" }).disabled).toBe(true);
    await userEvent.click(screen.getByRole("button", { name: "Próximo" }));
    expect(await screen.findByRole("heading", { name: "Chewbacca" })).toBeTruthy();
    expect(screen.getByText("Página 2 de 2")).toBeTruthy();
  });

  it("busca sem resultados e erro com nova tentativa", async () => {
    handler = (u) => (u.searchParams.get("search") === "xyz" ? [200, { count: 0, next: null, previous: null, results: [] }] : [500, {}]);
    renderAt("/");
    expect((await screen.findByRole("alert")).textContent).toMatch(/indisponível/);
    await userEvent.type(screen.getByLabelText(/Buscar personagem/), "xyz");
    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(await screen.findByText(/Nenhum personagem encontrado/)).toBeTruthy();
  });
});

describe("detalhe", () => {
  it("mostra os dados e trata personagem inexistente", async () => {
    handler = (u) => (u.pathname.endsWith("/people/1/") ? [200, person(1, "Luke Skywalker")] : [404, {}]);
    renderAt("/people/1");
    expect(await screen.findByRole("heading", { name: "Luke Skywalker" })).toBeTruthy();
    expect(screen.getByText("172")).toBeTruthy();
    cleanup();
    renderAt("/people/999");
    expect(await screen.findByRole("heading", { name: "Personagem não encontrado" })).toBeTruthy();
  });
});
/* Fim de app.test.jsx */
