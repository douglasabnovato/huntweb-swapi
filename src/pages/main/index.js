import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export default function Main() {
  const [personas, setPersonas] = useState([]);
  const [personaInfo, setPersonaInfo] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPersonas(1);
  }, []);

  async function loadPersonas(page) {
    async function fetchPeople() {
      let response = await fetch(`https://swapi.dev/api/people/`);
      let data = await response.json();
      setPersonas(data.results);
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

    console.log(pageNumber)
  }

  return (
    <div className="main-list">
      {personas.map((persona) => (
        <article key={persona.id}>
          <strong>{persona.name}</strong>
          <p>{persona.homeworld}
          {console.log("persona: ",persona.id)}
          {console.log("personas: ", personas)}</p>
          <Link to={`/people/${persona.name}`}>Acessar</Link>
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
    </div>
  );
}
