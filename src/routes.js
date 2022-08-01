import React from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "./pages/main";
import Persona from "./pages/persona";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/people/:id" component={Persona} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
