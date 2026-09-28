/* Indicador de carregamento com texto para leitores de tela */
import loader from "../../assets/loader.svg";
import "./styles.css";

export default function Loader({ label = "Carregando…" }) {
  return (
    <div id="loader" data-testid="loader" role="status">
      <img className="loader-image" src={loader} alt="" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
/* Fim de Loader/index.jsx */
