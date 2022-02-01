import React, { Component } from "react";
import PokemonCard from "./PokemonCard";
import axios from "axios";
import spinner from "../Pokemon/771.gif";

export default class PokemonList extends Component {
  state = {
    url: "https://pokeapi.co/api/v2/pokemon?limit=898",
    pokemon: null,
  };

  async componentDidMount() {
    const res = await axios.get(this.state.url);
    this.setState({ pokemon: res.data["results"] });
    console.log(this.state.pokemon);
  }

  render() {
    return (
      <React.Fragment>
        {this.state.pokemon ? (
          <div className="row">
            {this.state.pokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
              />
            ))}
          </div>
        ) : (
          <div className="col">
            <img
              src={spinner}
              style={{ width: "40em", height: "40em" }}
              className="card-img-top rounded mx-auto mt-2 d-flex justify-content-center"
            />
            <div class="d-flex justify-content-center row ">
              <div class="spinner-grow text-light m-5 " role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="spinner-grow text-light m-5 " role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="spinner-grow text-light m-5 " role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="spinner-grow text-light m-5 " role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="spinner-grow text-light m-5 " role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
