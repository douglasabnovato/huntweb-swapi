import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./styles.css";

export default function Product() {
  const [persona, setPersona] = useState({});

  useEffect(() => {
    const { id } = this.props.match.params;
    const response = api.get(`/persona/${id}`);
    setPersona({ product: response.data });
  }, []);
 
  return (
    <div className="persona-info">
      <h1>{persona.name}</h1>
      <p>{persona.homeworld}</p>
      <p>
        URL:<a href="{persona.url}">{persona.url}</a>
      </p>
    </div>
  );
}
