/* Foco no título quando a rota muda: numa SPA, trocar de página não avisa o leitor de tela e deixa o foco num link que some (WCAG 2.4.3) */
import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/* true depois da primeira troca de caminho; na primeira carga o foco fica no topo da página */
export const RouteFocusContext = createContext(false);

/* Devolve a ref do h1 (com tabIndex={-1}); quando o caminho muda e a página está pronta, o foco vai para ele. Trocar só a busca ou a página da lista não move o foco */
export default function useRouteFocus(ready = true) {
  const ref = useRef(null);
  const navigated = useContext(RouteFocusContext);
  const { pathname } = useLocation();

  useEffect(() => {
    if (navigated && ready && ref.current) ref.current.focus();
  }, [navigated, ready, pathname]);

  return ref;
}
/* Fim de routeFocus.js */
