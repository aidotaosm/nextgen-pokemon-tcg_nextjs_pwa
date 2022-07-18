import { useEffect, useState } from "react";
import { Helper } from "../utils/helper";
import "./ExpansionsComponent.css";

export const ExpansionsComponent = (pokemonSDKVariable: any) => {
  const [setsBySeries, setSetsBySeries] = useState<any[]>([]);
  useEffect(() => {
    if (pokemonSDKVariable) {
      console.log(pokemonSDKVariable);
      pokemonSDKVariable.pokemon.set.all({ page: 0 }).then((sets: any[]) => {
        console.log(sets);
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
        setSetsBySeries(arrayOfSeries);
      });
      // pokemonSDKVariable.pokemon.card
      //   .all({ q: "!name:charizard", page: 0, pageSize: 100 })
      //   .then((cards: any[]) => {
      //     console.log(cards);
      //   });
      // pokemonSDKVariable.pokemon.type.all({ page: 0 }).then((cards: any[]) => {
      //   console.log(cards);
      // });
      // pokemonSDKVariable.pokemon.subtype
      //   .all({ page: 0 })
      //   .then((cards: any[]) => {
      //     console.log(cards);
      //   });
      // pokemonSDKVariable.pokemon.rarity
      //   .all({ page: 0 })
      //   .then((cards: any[]) => {
      //     console.log(cards);
      //   });
      // pokemonSDKVariable.pokemon.supertype
      //   .all({ page: 0 })
      //   .then((cards: any[]) => {
      //     console.log(cards);
      //   });
    }
  }, []);

  return <div className="container">
    <div className="series">
      {setsBySeries.map(series=>{
        return (<div id={series.series}>
          <div className="series-name">{series.series}</div>
          {series.sets.map((set:any)=>{
            return(
              <div className="sets" id={set.id}>{set.name}</div>
            );
          })}
     
        </div>);
      })}
    </div>
  </div>;
};
