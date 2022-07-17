import { useEffect, useState } from "react";
import { Helper } from "../utils/helper";

export const ExpansionsComponent = (pokemonSDKVariable: any) => {
  const [setsBySeries, setSetsBySeries] = useState([]);
  useEffect(() => {
    if (pokemonSDKVariable) {
      console.log(pokemonSDKVariable);
      pokemonSDKVariable.pokemon.set.all({ page: 0 }).then((sets: any[]) => {
        console.log(sets);
        // let uniqueSeries = [...Array.from(new Set(sets.map((set) => set.series)))];
        // console.log(uniqueSeries);
        let setsGroupedBySeries: any = Helper.GroupBy(sets, "series");
        let arrayOfSeries: any[] = [];
        Object.keys(setsGroupedBySeries).forEach((seriesName) => {
          arrayOfSeries.push({
            series: seriesName,
            sets: setsGroupedBySeries[seriesName],
            releaseDate: setsGroupedBySeries[seriesName][0].releaseDate,
          });
        });
        console.log(arrayOfSeries);
        // let sortedArrayOfSeries = arrayOfSeries.sort(function (a, b) {
        //   return b.releaseDate - a.releaseDate;
        // });
        // console.log(sortedArrayOfSeries);
      });
      pokemonSDKVariable.pokemon.card
        .all({ q: "!name:charizard", page: 0, pageSize: 100 })
        .then((cards: any[]) => {
          console.log(cards);
        });
      pokemonSDKVariable.pokemon.type.all({ page: 0 }).then((cards: any[]) => {
        console.log(cards);
      });
      pokemonSDKVariable.pokemon.subtype
        .all({ page: 0 })
        .then((cards: any[]) => {
          console.log(cards);
        });
      pokemonSDKVariable.pokemon.rarity
        .all({ page: 0 })
        .then((cards: any[]) => {
          console.log(cards);
        });
      pokemonSDKVariable.pokemon.supertype
        .all({ page: 0 })
        .then((cards: any[]) => {
          console.log(cards);
        });
    }
  }, []);

  return <div className=""></div>;
};
