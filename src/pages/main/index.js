import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./style.css";

export default function Main() {
  const [products, setProducts] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {

    loadProducts()

  }, []); 

  async function loadProducts(page){

    async function fetchPeople(){
        let response = await fetch("https://swapi.dev/api/people/")
        let data = await response.json()
        setProducts(data.results)
    }

    fetchPeople()

  }

  function prevPage() {
    const [pagePrev, setPagePrev] = useState(page);
    const [productInfoPrev, setProductInfoPrev] = useState(productInfo);
    if (pagePrev === 1) return;
    const pageNumber = pagePrev - 1;
    loadProducts(pageNumber);
  }

  function nextPage() {
    const [pageNext, setPageNext] = useState(page);
    const [productInfoNext, setProductInfoNext] = useState(productInfo);
    if (pageNext === productInfoNext.pages) return;
    const pageNumber = pageNext + 1;
    loadProducts(pageNumber);
  }

  return (
    <div className="product-list">
      {products.map((product) => (

        <article key={product.created}>
          <strong>{product.name}</strong>
          <p>{product.homeworld}</p>
          <Link to={`/people/${product.created}`}>Acessar</Link>
        </article>

      ))}
      <div className="actions">
        <button disabled={page === 1} onClick={prevPage}>
          Anterior
        </button>
        <button disabled={page === productInfo.pages} onClick={nextPage}>
          Próximo
        </button>
      </div>
    </div>
  );
}
