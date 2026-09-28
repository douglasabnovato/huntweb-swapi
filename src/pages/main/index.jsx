/* Lista paginada de personagens com busca; página e busca ficam na URL (voltar mantém a posição) */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";
import PlanetName from "../../components/PlanetName";
import { fetchPeople, idFromUrl } from "../../lib/swapi";
import "./styles.css";

export default function Main() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("q") || "";
  const [term, setTerm] = useState(search);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setData(null);
    setError("");
    fetchPeople(page, search, { signal: ctrl.signal })
      .then(setData)
      .catch((err) => { if (err.name !== "AbortError") setError(err.message); });
    return () => ctrl.abort();
  }, [page, search, attempt]);

  /* Aplica a busca a partir da primeira página */
  function handleSearch(e) {
    e.preventDefault();
    setParams(term.trim() ? { q: term.trim() } : {});
  }

  /* Vai para outra página mantendo a busca */
  const go = (p) => setParams({ ...(search ? { q: search } : {}), page: String(p) });

  return (
    <div className="main-list">
      <h1 className="page-title">Personagens de Star Wars</h1>
      <form className="search" role="search" onSubmit={handleSearch}>
        <label htmlFor="search" className="sr-only">Buscar personagem pelo nome</label>
        <input id="search" type="search" placeholder="Buscar pelo nome (ex.: Luke)" value={term} onChange={(e) => setTerm(e.target.value)} />
        <button type="submit">Buscar</button>
      </form>

      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setAttempt((a) => a + 1)}>Tentar de novo</button>
        </div>
      )}
      {!data && !error && <Loader label="Carregando personagens…" />}
      {data && data.results.length === 0 && <p className="empty">Nenhum personagem encontrado para “{search}”.</p>}
      {data && data.results.map((persona) => (
        <article key={persona.url}>
          <h2>{persona.name}</h2>
          <p><strong>Planeta natal: </strong><PlanetName url={persona.homeworld} /></p>
          <p><strong>Ano de nascimento: </strong>{persona.birth_year}</p>
          <Link to={`/people/${idFromUrl(persona.url)}`} aria-label={`Ver detalhes de ${persona.name}`}>Acessar</Link>
        </article>
      ))}
      {data && data.results.length > 0 && (
        <nav className="actions" aria-label="Paginação">
          <button type="button" disabled={!data.previous} onClick={() => go(page - 1)}>Anterior</button>
          <span aria-live="polite">Página {page} de {Math.max(1, Math.ceil(data.count / 10))}</span>
          <button type="button" disabled={!data.next} onClick={() => go(page + 1)}>Próximo</button>
        </nav>
      )}
    </div>
  );
}
/* Fim de main/index.jsx */
