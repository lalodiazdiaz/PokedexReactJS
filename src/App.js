import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/layouts/NavBar";

import "./App.css";
import Dsdhboard from "./Components/layouts/Dsdhboard";

import backgroundImage from "./pattern.jpg";

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Pokemon from "./Components/Pokemon/Pokemon";

function App() {
  return (
    <Router>
      <div className="App" style={{ background: ` url(${backgroundImage})` }}>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Dsdhboard} />
            <Route
              exact
              path={"/pokemon/:pokemonIndex"}
              //  render={(props) => <Pokemon {...props} />}
              component={Pokemon}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
