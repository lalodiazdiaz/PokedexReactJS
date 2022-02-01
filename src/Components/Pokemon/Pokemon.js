import React, { Component } from "react";
import Axios from "axios";

const TYPE_COLORS = {
  bug: "B1C12E",
  dark: "4F3A2D",
  dragon: "755EDF",
  electric: "FCBC17",
  fairy: "F4B1F4",
  fighting: "823551D",
  fire: "E73B0C",
  flying: "A3B3F7",
  ghost: "6060B2",
  grass: "74C236",
  ground: "D3B357",
  ice: "A3E7FD",
  normal: "C8C4BC",
  poison: "934594",
  psychic: "ED4882",
  rock: "B9A156",
  steel: "B5B5C3",
  water: "3295F6",
};

const TYPE_IMAGE = {
  bug: "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Bug.png",
  dark: "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Dark.png",
  dragon:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Dragon.png",
  electric:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Electric.png",
  fairy:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Fairy.png",
  fighting:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Fighting.png",
  fire: "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Fire.png",
  flying:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Flying.png",
  ghost:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Ghost.png",
  grass:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Grass.png",
  ground:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Ground.png",
  ice: "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Ice.png",
  normal:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Normal.png",
  poison:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Poison.png",
  psychic:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Psychic.png",
  rock: "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Rock.png",
  steel:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Steel.png",
  water:
    "https://img.rankedboost.com/wp-content/plugins/pokemon_go_tier_list_usermang/assets/roles/Water.png",
};

export default class Pokemon extends Component {
  state = {
    name: "",
    pokemonIndex: "",
    imageUrl: "",
    types: [],
    description: "",
    statTitleWidth: 3,
    statBarWidth: 9,
    stats: {
      hp: "",
      attack: "",
      defense: "",
      speed: "",
      specialAttack: "",
      specialDefense: "",
    },
    height: "",
    weight: "",
    eggGroups: "",
    catchRate: "",
    abilities: "",
    genderRatioMale: "",
    genderRatioFemale: "",
    evs: "",
    hatchSteps: "",
  };

  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;

    // Urls for pokemon information
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    // Get Pokemon Information
    const pokemonRes = await Axios.get(pokemonUrl);

    const name = pokemonRes.data.name;
    const imageUrl = pokemonRes.data.sprites.front_default;

    let { hp, attack, defense, speed, specialAttack, specialDefense } = "";

    pokemonRes.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case "hp":
          hp = stat["base_stat"];
          break;
        case "attack":
          attack = stat["base_stat"];
          break;
        case "defense":
          defense = stat["base_stat"];
          break;
        case "speed":
          speed = stat["base_stat"];
          break;
        case "special-attack":
          specialAttack = stat["base_stat"];
          break;
        case "special-defense":
          specialDefense = stat["base_stat"];
          break;
        default:
          break;
      }
    });

    // Convert Decimeters to Feet... The + 0.0001 * 100 ) / 100 is for rounding to two decimal places :)
    const height =
      Math.round((pokemonRes.data.height * 0.328084 + 0.00001) * 100) / 100;

    const weight =
      Math.round((pokemonRes.data.weight * 0.220462 + 0.00001) * 100) / 100;

    const types = pokemonRes.data.types.map((type) => type.type.name);

    const abilities = pokemonRes.data.abilities
      .map((ability) => {
        return ability.ability.name
          .toLowerCase()
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
      })
      .join(", ");

    const evs = pokemonRes.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name
          .toLowerCase()
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ")}`;
      })
      .join(", ");

    // Get Pokemon Description .... Is from a different end point uggh
    await Axios.get(pokemonSpeciesUrl).then((res) => {
      let description = "";
      res.data.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === "en") {
          description = flavor.flavor_text;
          return;
        }
      });
      const femaleRate = res.data["gender_rate"];
      const genderRatioFemale = 12.5 * femaleRate;
      const genderRatioMale = 12.5 * (8 - femaleRate);

      const catchRate = Math.round((100 / 255) * res.data["capture_rate"]);

      const eggGroups = res.data["egg_groups"]
        .map((group) => {
          return group.name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        })
        .join(", ");

      const hatchSteps = 255 * (res.data["hatch_counter"] + 1);

      this.setState({
        description,
        genderRatioFemale,
        genderRatioMale,
        catchRate,
        eggGroups,
        hatchSteps,
      });
    });

    this.setState({
      imageUrl,
      pokemonIndex,
      name,
      types,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
      },

      height,
      weight,
      abilities,
      evs,
    });
  }
  render() {
    return (
      <div className="col">
        <div className="card">
          <div className="card-header">
            {/**Index */}
            <div className="row bg-primary align-items-start border border-dark border-3 ">
              <div className="col-md-3  d-flex justify-content-center ">
                <h1 style={{ color: "white" }}> #{this.state.pokemonIndex}</h1>
              </div>
              <div className="col border-start border-dark border-3 border-end bg-light d-flex justify-content-center">
                <h1>
                  {this.state.name
                    .toLowerCase()
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                </h1>
              </div>
              {/**Types */}
              <div className="col-md-3 d-flex justify-content-center ">
                <div className="float-end">
                  <div className="row">
                    {this.state.types.map((type) => (
                      <div className="mx-auto col">
                        <img
                          style={{ width: 50 }}
                          src={`${TYPE_IMAGE[type]}`}
                        />
                        {/* <span
                        key={type}
                        className="badge rounded-pill mr-2"
                        style={{
                          backgroundColor: `#${TYPE_COLORS[type]}`,
                          color: "white",
                          marginLeft: 5,
                        }}
                      >
                        {type
                          .toLowerCase()
                          .split("-")
                          .map(
                            (s) => s.charAt(0).toUpperCase() + s.substring(1)
                          )
                          .join(" ")}
                      </span> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body ">
              <div className="row align-items-center d-flex justify-content-center">
                {/**Image */}
                <div className="col-md-5 mb-5 ">
                  <img
                    src={`https://img.pokemondb.net/artwork/${this.state.name}.jpg`}
                    className="card-img-top rounded p-1 border border-3 border-dark "
                  />
                </div>
                {/**name pokemon */}
                <div className="row mt-1 d-flex justify-content-center">
                  <div className="col d-flex justify-content-center">
                    <p className="p-2 lead">{this.state.description}</p>
                  </div>
                </div>
                <div className="col-md-9">
                  {/* <h4 className="mx-auto">
                    {this.state.name
                      .toLowerCase()
                      .split(" ")
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(" ")}
                  </h4> */}
                  {/**Description */}

                  {/*HP */}
                  <div className="row align-items-center d-flex justify-content-center">
                    <div className="col-12 col-md-3">HP</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-danger"
                          role="progresBar"
                          style={{ width: `${this.state.stats.hp}%` }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {this.state.stats.hp}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/**Attack */}
                  <div className="row align-items-center ">
                    <div className="col-12 col-md-3">Attack</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-success"
                          role="progresBar"
                          style={{ width: `${this.state.stats.attack}%` }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {this.state.stats.attack}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/**Defense */}
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Defense</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-success"
                          role="progresBar"
                          style={{ width: `${this.state.stats.defense}%` }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {this.state.stats.defense}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/**Speed */}
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Speed</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-success"
                          role="progresBar"
                          style={{ width: `${this.state.stats.speed}%` }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {this.state.stats.speed}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/**specialAttack */}
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">Special Attack</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-warning"
                          role="progresBar"
                          style={{
                            width: `${this.state.stats.specialAttack}%`,
                          }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {this.state.stats.specialAttack}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/**specialDefense */}
                  <div className="row align-items-center">
                    <div className="col-12 col-md-3">SpecialDefense</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped bg-warning"
                          role="progresBar"
                          style={{
                            width: `${this.state.stats.specialDefense}%`,
                          }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {this.state.stats.specialDefense}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="card-body">
              <h5 className="card-title text-center">Profile</h5>
              <div className="row">
                <div className="col-md-6">
                  {/**Height */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end">Height:</h6>
                    </div>

                    <div className="col-md-6">
                      <h6 className="float-start">{this.state.height} ft.</h6>
                    </div>
                  </div>
                  {/**Weight */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end">Weight::</h6>
                    </div>
                    <div className="col-md-6">
                      <h6 className="float-start">{this.state.weight} lbs.</h6>
                    </div>
                  </div>
                  {/**Catch rate */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end">Catch Rate:</h6>
                    </div>
                    <div className="col-md-6">
                      <h6 className="float-start">{this.state.catchRate} %.</h6>
                    </div>
                  </div>
                  {/**Gender ratio */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end">Gender Ratio:</h6>
                    </div>
                    <div className="col-md-6">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{
                            width: `${this.state.genderRatioFemale}%`,
                            backgroundColor: "#c2185B",
                          }}
                          aria-valuenow="15"
                          aria-valuemin="0"
                          aria-aria-valuemax="100"
                        >
                          {this.state.genderRatioFemale}
                        </div>
                        <div
                          className="progress-bar"
                          role="progressBar"
                          style={{
                            width: `${this.state.genderRatioMale}%`,
                            backgroundColor: "#1976D2",
                          }}
                          aria-valuenow="15"
                          aria-valuemin="0"
                          aria-aria-valuemax="100"
                        >
                          {this.state.genderRatioMale}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  {/**Egg group */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end"> Egg Groups </h6>
                    </div>
                    <div className="col-md-6">
                      <h6 className="float-start">{this.state.eggGroups}</h6>
                    </div>
                  </div>
                  {/**Hatch steps */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end">Hatch Steps </h6>
                    </div>
                    <div className="col-md-6">
                      <h6 className="float-start">{this.state.hatchSteps}</h6>
                    </div>
                  </div>
                  {/**Abilities */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end">Abilities </h6>
                    </div>
                    <div className="col-md-6">
                      <h6 className="float-start">{this.state.abilities}</h6>
                    </div>
                  </div>
                  {/**EVs */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="float-end"> EVs </h6>
                    </div>
                    <div className="col-md-6">
                      <h6 className="float-start">{this.state.evs}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/**Footer */}
          <div className="card-footer text-muted">
            Data From{" "}
            <a href="https://pokeapi.com" target="_blank" className="card-link">
              {" "}
              PokeApi.co
            </a>
          </div>
        </div>
      </div>
    );
  }
}
