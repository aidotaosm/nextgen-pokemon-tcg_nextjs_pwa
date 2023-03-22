import {
  APP_PRIMARY_URL,
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
  static get origin() {
    if (typeof window !== "undefined") {
      return `${window.location.origin}`;
    } else {
      return this.getBaseDomainServerSide();
    }
  }
  static getBaseDomainServerSide() {
    return process.env.IS_VERCEL === "true"
      ? Vercel_DEFAULT_URL
      : Netlify_DEFAULT_URL;
  }
  static get isServerSide() {
    return typeof window === "undefined";
  }
  static get primaryHost() {
    const host =
      typeof window !== "undefined" && window.location.host
        ? window.location.host
        : "";
    let primaryHost = host.replace(APP_PRIMARY_URL + ".", "");
    return primaryHost;
  }

  static saveTemplateAsFile = (
    filename: string,
    dataObjToWrite: any,
    shouldStringify: boolean = true,
    type: "text/json" | "text/plain" = "text/json"
  ) => {
    const blob = shouldStringify
      ? new Blob([JSON.stringify(dataObjToWrite)], {
          type,
        })
      : new Blob([dataObjToWrite], {
          type,
        });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = [type, link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove();
  };
  static randDelay = (min: number, max: number) => {
    let delayValue = Math.floor(Math.random() * (max - min + 1) + min);
    return delayValue;
  };
}
