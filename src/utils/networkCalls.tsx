import axios, { AxiosInstance } from "axios";
import { Helper } from "./helper";
const axiosHttpClient: AxiosInstance = axios.create({});

export async function getExpansions() {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let arrayOfSeries: any[] = [];
  let sets: any[] = [];
  await pokemonSDKVariable.set
    .all({ page: 0 })
    .then((resSets: any[]) => {
      if (resSets) {
        let setsGroupedBySeries: any = Helper.GroupBy(resSets, "series");
        sets = resSets;
        Object.keys(setsGroupedBySeries).forEach((seriesName, index) => {
          arrayOfSeries.push({
            id: "series" + index + 1,
            series: seriesName,
            sets: setsGroupedBySeries[seriesName].reverse(),
            releaseDate: setsGroupedBySeries[seriesName][0].releaseDate,
          });
        });
      }
    })
    .catch((c: any) => {
      console.log(c);
    });
  arrayOfSeries.reverse();
  sets.reverse();
  return { arrayOfSeries, sets };
}
export const getAllSetCards = async (setId?: string) => {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let setsObject: any = {};
  await pokemonSDKVariable.card
    .where({
      q: "set.id:" + setId,
    })
    .then((response: any) => {
      setsObject = response;
    })
    .catch((c: any) => {
      console.error("error occurred on " + setId);
    });
  return setsObject;
};
export const getAllCards = async () => {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let setsObject: any = {};
  await pokemonSDKVariable.card
    .all()
    .then((response: any) => {
      setsObject = response;
    })
    .catch((c: any) => {
      console.error("error occurred on all");
    });
  return setsObject;
};
export const getCardById = async (cardId?: string) => {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let returnObject: any = {};
  await pokemonSDKVariable.card
    .find(cardId)
    .then((card: any) => {
      returnObject = card;
    })
    .catch((c: any) => {
      console.error("error occurred on " + cardId);
    });
  return returnObject;
};
export const getCardsFromNextServer = async (
  page?: number,
  search?: string
) => {
  let url = "/api/search";
  if (page === 0 || !!page || search) {
    url += "?";
    if (page === 0 || !!page) {
      url += "page=" + page;
    }
    if (search) {
      if (url.includes("?")) {
        url += "&";
      } else {
        url += "?";
      }
      url += "search=" + search;
    }
  }

  const response = await axiosHttpClient.get(url);
  return response.data;
};

export const getAllRarities = async () => {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let rarityList = [];
  try {
    rarityList = await pokemonSDKVariable.rarity.all();
  } catch (e) {
    console.log(e, "rarity error");
  }
  return rarityList;
};
export const getAllSuperTypes = async () => {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let superTypeList = [];
  try {
    superTypeList = await pokemonSDKVariable.supertype.all();
  } catch (e) {
    console.log(e, "supertype error");
  }
  return superTypeList;
};

export const getAllSubtypes = async () => {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let subtypeList = [];
  try {
    subtypeList = await pokemonSDKVariable.subtype.all();
  } catch (e) {
    console.log(e, "subtype error");
  }
  return subtypeList;
};
export const getAllTypes = async () => {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let typeList = [];
  try {
    typeList = await pokemonSDKVariable.type.all();
  } catch (e) {
    console.log(e, "type error");
  }
  return typeList;
};
// pokemonSDKVariable.card
//   .all({ q: "!name:charizard", page: 0, pageSize: 100 })
//   .then((cards: any[]) => {
//     console.log(cards);
//   });
