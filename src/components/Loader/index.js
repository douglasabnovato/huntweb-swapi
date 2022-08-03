import React from "react";
import { ReactComponent as Logo } from "./../../assets/loader.svg";
import "./styles.css";

const Loader = () => (
  <div id="loader" data-testid="loader">
    <Logo className="loader-image" />
  </div>
);

export default Loader;
