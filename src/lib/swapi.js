/* Acesso à SWAPI: URL configurável, id a partir da URL do recurso, planetas com cache e dados locais de reserva */
import planets from "../data/planets.json";

export const SWAPI = (import.meta.env.VITE_SWAPI_URL || "https://swapi.dev/api").replace(/\/$/, "");

/* Extrai o id numérico de uma URL da SWAPI (antes: substring(29, 31), que falhava para ids de 1 ou 3 dígitos) */
export function idFromUrl(url) {
  const m = String(url || "").match(/\/(\d+)\/?$/);
  return m ? m[1] : null;
}

/* GET JSON com erro legível */
export async function getJson(url, { signal } = {}) {
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Não foi possível falar com a SWAPI. Verifique sua conexão.");
  }
  if (res.status === 404) throw Object.assign(new Error("Não encontrado."), { status: 404 });
  if (!res.ok) throw new Error("A SWAPI está indisponível no momento. Tente de novo.");
  return res.json();
}

/* Página de personagens, com busca opcional por nome */
export function fetchPeople(page, search, opts) {
  const q = new URLSearchParams({ page: String(page) });
  if (search) q.set("search", search);
  return getJson(`${SWAPI}/people/?${q}`, opts);
}

/* Um personagem pelo id */
export function fetchPerson(id, opts) {
  return getJson(`${SWAPI}/people/${encodeURIComponent(id)}/`, opts);
}

const planetCache = new Map(planets.results.map((p) => [idFromUrl(p.url), p.name]));

/* Nome do planeta natal: usa o JSON local e, se faltar, busca uma vez e guarda */
export async function planetName(url) {
  const id = idFromUrl(url);
  if (!id) return "desconhecido";
  if (!planetCache.has(id)) {
    planetCache.set(id, getJson(`${SWAPI}/planets/${id}/`).then((p) => p.name).catch(() => "desconhecido"));
  }
  return planetCache.get(id);
}
/* Fim de swapi.js */
