import { useEffect, useMemo, useState } from "react";
import { Helper } from "../utils/helper";
import "./ExpansionsComponent.css";
import { Link, useParams, useNavigate } from "react-router-dom";

export const SetComponent = () => {
  let params = useParams();
  let navigate = useNavigate();
  const [setCards, setSetCards] = useState<any[]>([]);

  useEffect(() => {
    console.log(params);
    if (!params.setId) {
      navigate("/dashboard");
    } else {
      let pokemonSDKVariable = Helper.initializePokemonSDK();
      if (pokemonSDKVariable) {
        console.log(pokemonSDKVariable);
        pokemonSDKVariable.set.all({ page: 0 }).then((sets: any[]) => {
          console.log(sets);
          let setsGroupedBySeries: any = Helper.GroupBy(sets, "series");
          let arrayOfSeries: any[] = [];
          Object.keys(setsGroupedBySeries).forEach((seriesName, index) => {
            arrayOfSeries.push({
              id: "series" + index + 1,
              series: seriesName,
              sets: setsGroupedBySeries[seriesName],
              releaseDate: setsGroupedBySeries[seriesName][0].releaseDate,
            });
          });
          console.log(arrayOfSeries);
          setSetCards(arrayOfSeries);
        });
        // pokemonSDKVariable.card
        //   .all({ q: "!name:charizard", page: 0, pageSize: 100 })
        //   .then((cards: any[]) => {
        //     console.log(cards);
        //   });
        // pokemonSDKVariable.type.all({ page: 0 }).then((cards: any[]) => {
        //   console.log(cards);
        // });
        // pokemonSDKVariable.subtype
        //   .all({ page: 0 })
        //   .then((cards: any[]) => {
        //     console.log(cards);
        //   });
        // pokemonSDKVariable.rarity
        //   .all({ page: 0 })
        //   .then((cards: any[]) => {
        //     console.log(cards);
        //   });
        // pokemonSDKVariable.supertype
        //   .all({ page: 0 })
        //   .then((cards: any[]) => {
        //     console.log(cards);
        //   });
      }
    }
  }, []);

  return <div className="container"></div>;
};
