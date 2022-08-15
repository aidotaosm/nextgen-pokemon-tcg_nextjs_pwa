import { Helper } from "./helper";

export async function getExpansions() {
  let pokemonSDKVariable = Helper.initializePokemonSDK();
  let arrayOfSeries: any[] = [];
  await pokemonSDKVariable.set.all({ page: 0 }).then((sets: any[]) => {
    let setsGroupedBySeries: any = Helper.GroupBy(sets, "series");
    // setsGroupedBySeries.reverse();
    Object.keys(setsGroupedBySeries).forEach((seriesName, index) => {
      arrayOfSeries.push({
        id: "series" + index + 1,
        series: seriesName,
        sets: setsGroupedBySeries[seriesName],
        releaseDate: setsGroupedBySeries[seriesName][0].releaseDate,
      });
    });
  });
  arrayOfSeries.reverse();
  return arrayOfSeries;
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
    });
  return setsObject;
};
