/* Nome do planeta natal resolvido a partir da URL (antes a lista mostrava a URL crua) */
import { useEffect, useState } from "react";
import { planetName } from "../lib/swapi";

export default function PlanetName({ url }) {
  const [name, setName] = useState("…");
  useEffect(() => {
    let alive = true;
    planetName(url).then((n) => alive && setName(n));
    return () => { alive = false; };
  }, [url]);
  return <>{name}</>;
}
/* Fim de PlanetName.jsx */
