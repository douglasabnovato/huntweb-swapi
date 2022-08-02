import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./styles.css";

export default function Persona() {
  const [persona, setPersona] = useState({});

  useEffect(() => {
    const { id } = this.props.match.params;
    const response = api.get(`/people/${id}`);
    setPersona({ persona: response.data });
  }, []);
 
  return (
    <div className="persona-info">
      <h1>{persona.name}</h1>
      <p>{persona.homeworld}
         {console.log(persona.id)}</p>
      <p>
        URL:<a href="{persona.url}">{persona.url}</a>
      </p>
    </div>
  );
}
