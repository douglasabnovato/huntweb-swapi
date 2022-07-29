import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./styles.css";

export default function Product() {
  const [product, setProduct] = useState({});

  useEffect(() => {
    const { id } = this.props.match.params;
    const response = api.get(`/people/${id}`);
    setProduct({ product: response.data });
  }, []);
 
  return (
    <div className="product-info">
      <h1>{product.name}</h1>
      <p>{product.homeworld}</p>
      <p>
        URL:<a href="{product.url}">{product.url}</a>
      </p>
    </div>
  );
}
