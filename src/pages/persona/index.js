import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Loader from "./../../components/Loader";

import "./styles.css";

export default function Persona() {
  const [persona, setPersona] = useState({});
  const index = useParams();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  
  useEffect(() => {
    loadPersona();
  }, []);

  function goBack() {
    history.goBack();
  }

  async function loadPersona() {
    async function fetchPersona() {
      let response = await fetch(`https://swapi.dev/api/people/${index.id}`);
      let data = await response.json();
      setPersona(data);
      setLoading(true);
    }
    fetchPersona();
  }

  return (
    <div className="persona-info">
      {!loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <h1>{persona.name}</h1>
          <p>birth year:{persona.birth_year}</p>
          <p>height:{persona.height}</p>
          <div className="actions">
            <Link onClick={goBack}>Voltar para Home </Link>
          </div>
        </>
      )}
    </div>
  );
}
