import React, { Component } from "react";
import PokemonList from "../Pokemon/PokemonList";

export default class Dsdhboard extends Component {
  render() {
    return (
      <div className="row align-items-center">
        <div className="col ">
          <PokemonList />
        </div>
      </div>
    );
  }
}
