/* Acesso à SWAPI: URL configurável, id a partir da URL do recurso, planetas com cache e dados locais de reserva */
import planets from "../data/planets.json";

export const SWAPI = (import.meta.env.VITE_SWAPI_URL || "https://swapi.dev/api").replace(/\/$/, "");

/* Extrai o id numérico de uma URL da SWAPI (antes: substring(29, 31), que falhava para ids de 1 ou 3 dígitos) */
export function idFromUrl(url) {
  const m = String(url || "").match(/\/(\d+)\/?$/);
  return m ? m[1] : null;
}

/* Tempo máximo de espera por resposta da SWAPI */
export const TIMEOUT_MS = 15_000;

/* Junta o sinal de quem chama (troca de página) com o limite de tempo; navegador sem suporte segue só com o sinal */
function withTimeout(signal) {
  if (typeof AbortSignal.timeout !== "function" || typeof AbortSignal.any !== "function") return signal;
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

/* GET JSON com erro legível; TimeoutError vira mensagem, AbortError (troca de página) segue adiante */
export async function getJson(url, { signal } = {}) {
  let res;
  try {
    res = await fetch(url, { signal: withTimeout(signal) });
  } catch (err) {
    if (err.name === "TimeoutError") throw new Error("A SWAPI demorou demais para responder. Tente de novo.");
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
/* Títulos dos filmes pelo id da SWAPI (dados fixos: a saga não muda) */
const FILMS = {
  1: "Episódio IV: Uma Nova Esperança (1977)",
  2: "Episódio V: O Império Contra-Ataca (1980)",
  3: "Episódio VI: O Retorno de Jedi (1983)",
  4: "Episódio I: A Ameaça Fantasma (1999)",
  5: "Episódio II: Ataque dos Clones (2002)",
  6: "Episódio III: A Vingança dos Sith (2005)",
};

/* Filmes do personagem na ordem de lançamento, sem nova chamada à API */
export function filmTitles(urls = []) {
  return urls.map(idFromUrl).filter((id) => FILMS[id]).sort((a, b) => a - b).map((id) => FILMS[id]);
}
/* Fim de swapi.js */
