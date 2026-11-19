/* Layout com cabeçalho fixo e rotas: lista de personagens e detalhe */
import { useState } from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Main from "./pages/main";
import Persona from "./pages/persona";
import useTitle from "./lib/useTitle";
import useRouteFocus, { RouteFocusContext } from "./lib/routeFocus";
import "./styles.css";

/* Rota inexistente: aviso e caminho de volta */
function NotFound() {
  useTitle("Página não encontrada");
  const titleRef = useRouteFocus();
  return <div className="persona-info"><h1 ref={titleRef} tabIndex={-1}>Página não encontrada</h1><Link to="/">Voltar para a lista</Link></div>;
}

export default function App() {
  /* Marca a primeira troca de caminho ainda na renderização, antes dos efeitos das páginas */
  const { pathname } = useLocation();
  const [initialPath] = useState(pathname);
  const [navigated, setNavigated] = useState(false);
  if (!navigated && pathname !== initialPath) setNavigated(true);

  return (
    <RouteFocusContext.Provider value={navigated}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/people/:id" element={<Persona />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </RouteFocusContext.Provider>
  );
}
/* Fim de App.jsx */
