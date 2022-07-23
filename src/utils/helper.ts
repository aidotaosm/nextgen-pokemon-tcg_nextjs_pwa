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
    let pokemonSDKVariable = pokemon.default;
    pokemonSDKVariable.configure({ apiKey: DEV_POKEMONTCG_IO_API_KEY });
    return pokemonSDKVariable;
  };
}
