import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "./../../components/Loader";
import "./styles.css";

export default function Main() {
  const [personas, setPersonas] = useState([]);
  const [personaInfo, setPersonaInfo] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPersonas(1);
  }, []);

  async function loadPersonas(page) {
    async function fetchPeople() {
      let response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
      let data = await response.json();
      setPage(page);
      setPersonaInfo(data);
      setPersonas(data.results);
      setTimeout(setLoading(true), 1000);
    }
    fetchPeople();
  }

  function prevPage() {
    loadPersonas(page - 1);
  }

  function nextPage() {
    loadPersonas(page + 1);
  }

  return (
    <div className="main-list">
      {!loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {personas.map((persona, index) => (
            <article key={index}>
              <strong>{persona.name}</strong>
              <p>
                <strong>planet: </strong>
                {persona.homeworld}
              </p>
              <p>
                <strong>this: </strong>
                {persona.url}
              </p>
              <Link to={`/people/${index + 1}`}>Acessar</Link>
            </article>
          ))}
          <div className="actions">
            <button disabled={personaInfo.previous === null} onClick={prevPage}>
              Anterior
            </button>
            <button disabled={personaInfo.next === null} onClick={nextPage}>
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
