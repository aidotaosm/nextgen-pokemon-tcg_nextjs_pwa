import {
  DEV_POKEMONTCG_IO_API_KEY,
  Netlify_DEFAULT_URL,
  Vercel_DEFAULT_URL,
} from "../constants/constants";
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
  static getLocalStorageItem = (itemName: any) => {
    let parsedItem = null;
    if (typeof window !== "undefined") {
      parsedItem = JSON.parse(localStorage.getItem(itemName) || "{}");
    }
    return parsedItem;
  };
  static get Protocol() {
    if (typeof window !== "undefined") {
      return `${window.location.host}`;
    } else {
      return this.getBaseDomainServerSide();
    }
  }
  static getBaseDomainServerSide() {
    return process.env.NETLIFY !== "true"
      ? Vercel_DEFAULT_URL
      : Netlify_DEFAULT_URL;
  }
}
