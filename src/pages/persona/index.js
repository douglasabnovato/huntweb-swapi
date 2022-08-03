import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./styles.css";

export default function Persona() {
  const [persona, setPersona] = useState({});
  const index = useParams()

  useEffect(() => {
    loadPersona()
  }, []);

  async function loadPersona() {
    async function fetchPersona() {
      let response = await fetch(`https://swapi.dev/api/people/${index.id}`);
      let data = await response.json();
      setPersona(data);
    }
    fetchPersona();
  }
 
  return (
    <div className="persona-info">
      <h1>{persona.name}</h1>
      <p>birth year:{persona.birth_year}</p>
      <p>height:{persona.height}</p>
    </div>
  );
}
