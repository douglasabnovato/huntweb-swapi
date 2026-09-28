/* Cabeçalho fixo com o logotipo, que leva de volta à lista */
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "./styles.css";

export default function Header() {
  return (
    <header id="main-header">
      <Link to="/" className="logo-link"><img className="logo" src={logo} alt="Star Wars — ir para a lista de personagens" /></Link>
    </header>
  );
}
/* Fim de Header/index.jsx */
