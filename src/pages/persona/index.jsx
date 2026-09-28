/* Detalhe do personagem com estados de carregando, não encontrado e erro */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import PlanetName from "../../components/PlanetName";
import { fetchPerson } from "../../lib/swapi";
import "./styles.css";

const FIELDS = [
  ["birth_year", "Ano de nascimento"],
  ["height", "Altura (cm)"],
  ["mass", "Massa (kg)"],
  ["gender", "Gênero"],
  ["hair_color", "Cor do cabelo"],
  ["eye_color", "Cor dos olhos"],
  ["skin_color", "Cor da pele"],
];

export default function Persona() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setPersona(null);
    setError(null);
    fetchPerson(id, { signal: ctrl.signal })
      .then(setPersona)
      .catch((err) => { if (err.name !== "AbortError") setError(err); });
    return () => ctrl.abort();
  }, [id]);

  /* Volta para a página anterior (ou para a lista se abriu direto pelo link) */
  const back = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));

  return (
    <div className="persona-info">
      {error ? (
        <>
          <h1>{error.status === 404 ? "Personagem não encontrado" : "Não foi possível carregar"}</h1>
          <p role="alert">{error.message}</p>
        </>
      ) : !persona ? <Loader label="Carregando personagem…" /> : (
        <>
          <h1>{persona.name}</h1>
          <dl>
            {FIELDS.map(([k, label]) => (
              <div key={k}><dt>{label}</dt><dd>{persona[k]}</dd></div>
            ))}
            <div><dt>Planeta natal</dt><dd><PlanetName url={persona.homeworld} /></dd></div>
          </dl>
        </>
      )}
      <div className="actions">
        <button type="button" className="link-button" onClick={back}>Voltar</button>
        <Link to="/">Ir para a lista</Link>
      </div>
    </div>
  );
}
/* Fim de persona/index.jsx */
