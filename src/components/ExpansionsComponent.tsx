import { useEffect, useState } from "react";
import { Helper } from "../utils/helper";
import "./ExpansionsComponent.css";
import { Link } from "react-router-dom";

export const ExpansionsComponent = (pokemonSDKVariable: any) => {
  const [setsBySeries, setSetsBySeries] = useState<any[]>([]);
  useEffect(() => {
    if (pokemonSDKVariable) {
      console.log(pokemonSDKVariable);
      pokemonSDKVariable.pokemon.set.all({ page: 0 }).then((sets: any[]) => {
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

  return (
    <div className="container">
      <div className="accordion">
        {setsBySeries.map((series) => {
          return (
            <div
              className="accordion-item"
              key={series.series}
              id={series.series}
            >
              <h2 className="accordion-header " id={series.id + "-heading"}>
                <button
                  className="accordion-button collapsed py-2 px-3 fs-5 fw-bold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={"#" + series.id}
                  aria-expanded="false"
                  aria-controls={series.id}
                >
                  {series.series}
                </button>
              </h2>
              <div
                id={series.id}
                className="accordion-collapse collapse"
                aria-labelledby={series.id + "-heading"}
              >
                <div className="accordion-body py-2 ">
                  {series.sets.map((set: any) => {
                    return (
                      <div className="set" key={set.id} id={set.id}>
                        <img
                          className="set-image"
                          src={set?.images?.logo}
                          alt={set.name}
                        />
                        <div className="set-name">
                          <Link to={"/set/" + set.name}>{set.name}</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
