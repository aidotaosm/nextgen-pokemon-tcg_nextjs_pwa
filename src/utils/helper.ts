import { DEV_POKEMONTCG_IO_API_KEY } from "../constants/constants";
const pokemon = require("pokemontcgsdk");

export class Helper {
  static GroupBy: any = (items: any[], key: string) =>
    items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item],
      }),
      {}
    );
  static initializePokemonSDK: any = () => {
    console.log(pokemon);
    let pokemonSDKVariable;
    if (typeof window === "undefined") {
      pokemonSDKVariable = pokemon;
    } else {
      pokemonSDKVariable = pokemon.default;
    }

    pokemonSDKVariable.configure({ apiKey: DEV_POKEMONTCG_IO_API_KEY });
    return pokemonSDKVariable;
  };
  static populateSubtype = (card: any) => {
    let returnVal = "";
    if (card.subtype || card.subtypes) {
      returnVal = " - ";
      if (card.subtype) {
        returnVal += card.subtype;
      } else {
        returnVal += card.subtypes?.join(" - ");
      }
    }
    return returnVal;
  };
}
