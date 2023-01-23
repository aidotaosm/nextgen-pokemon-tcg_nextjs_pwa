import { Helper } from "./helper";

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
