import { useEffect, useState } from "react";
import { Helper } from "../utils/helper";
import styles from "./ExpansionsComponent.module.css";
import { ImageComponent } from "./ImageComponent/ImageComponent";
import Link from "./UtilityComponents/Link";

export const ExpansionsComponent = () => {
  const [setsBySeries, setSetsBySeries] = useState<any[]>([]);
  useEffect(() => {
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
        arrayOfSeries.reverse();
        console.log(arrayOfSeries);
        setSetsBySeries(arrayOfSeries);
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
  }, []);

  return (
    <div className="container">
      <div className="accordion">
        {setsBySeries.map((series, seriesIndex) => {
          return (
            <div
              className="accordion-item"
              key={series.series}
              id={series.series}
            >
              <h2 className="accordion-header " id={series.id + "-heading"}>
                <button
                  className={
                    "accordion-button  py-2-5 px-3 fs-5 fw-bold " +
                    (seriesIndex ? "collapsed" : "")
                  }
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
                className={
                  "accordion-collapse collapse " + (seriesIndex ? "" : "show")
                }
                aria-labelledby={series.id + "-heading"}
              >
                <div className="accordion-body py-2 ">
                  {series.sets.map((set: any) => {
                    return (
                      <div className={styles.set} key={set.id} id={set.id}>
                        <div className={styles["set-image"]}>
                          <ImageComponent
                            src={set?.images?.logo}
                            alt={set.name}
                            objectFit="contain"
                            layout="fill"
                          />
                        </div>
                        {/* <img
                          className={styles["set-image"]}
                          src={set?.images?.logo}
                          alt={set.name}
                        /> */}
                        <div className={styles["set-name"]}>
                          <Link href={"/set/" + set.id}>
                            <a>{set.name}</a>
                          </Link>
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
