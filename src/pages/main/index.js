import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "./../../components/Loader";
import "./styles.css";

export default function Main() {
  const [personas, setPersonas] = useState([]);
  const [personaInfo, setPersonaInfo] = useState({});
  const [page, setPage] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPersonas(1);
  }, []);

  async function loadPersonas(page) {
    async function fetchPeople() {
      let response = await fetch("https://swapi.dev/api/people/");
      let data = await response.json();
      setPersonas(data.results);
      setTimeout(setLoading(true), 1000);      
    }
    fetchPeople();
  }

  function prevPage() {
    const [pagePrev, setPagePrev] = useState(page);
    const [personaInfoPrev, setPersonaInfoPrev] = useState(personaInfo);
    if (pagePrev === 1) return;
    const pageNumber = pagePrev - 1;
    loadPersonas(pageNumber);
  }

  function nextPage() {
    const [pageNext, setPageNext] = useState(page);
    const [personaInfoNext, setPersonaInfoNext] = useState(personaInfo);
    if (pageNext === personaInfoNext.pages) return;
    const pageNumber = pageNext + 1;
    loadPersonas(pageNumber);
  }

  return (
    <div className="main-list">
      {(!loading) ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {personas.map((persona, index) => (
            <article key={index}>
              <strong>{persona.name}</strong>
              <p>{persona.homeworld}</p>
              <Link to={`/people/${index + 1}`}>Acessar</Link>
            </article>
          ))}
          <div className="actions">
            <button disabled={page === 1} onClick={prevPage}>
              Anterior
            </button>
            <button disabled={page === personaInfo.pages} onClick={nextPage}>
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
