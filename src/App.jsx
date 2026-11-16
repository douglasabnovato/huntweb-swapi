/* Layout com cabeçalho fixo e rotas: lista de personagens e detalhe */
import { Route, Routes, Link } from "react-router-dom";
import Header from "./components/Header";
import Main from "./pages/main";
import Persona from "./pages/persona";
import useTitle from "./lib/useTitle";
import "./styles.css";

/* Rota inexistente: aviso e caminho de volta */
function NotFound() {
  useTitle("Página não encontrada");
  return <div className="persona-info"><h1>Página não encontrada</h1><Link to="/">Voltar para a lista</Link></div>;
}

export default function App() {
  return (
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
  );
}
/* Fim de App.jsx */
