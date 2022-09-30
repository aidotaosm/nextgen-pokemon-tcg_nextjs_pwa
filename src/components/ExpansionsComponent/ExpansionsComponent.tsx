import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SeriesArrayProps } from "../../models/GenericModels";
import styles from "./ExpansionsComponent.module.css";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import Link from "../UtilityComponents/Link";
import { useRouter } from "next/router";
import { type } from "os";
import { Helper } from "../../utils/helper";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  arrayOfSeries,
}: any) => {
  let router = useRouter();
  const memoizedArrayOfSeries = useMemo(() => {
    arrayOfSeries[0].isOpen = true;
    return arrayOfSeries;
  }, []);
  const [setsBySeries, setSetsBySeries] = useState<any[]>(
    memoizedArrayOfSeries
  );
  // async function localExpansionsGet() {
  //   let arrayOfSeries = await getExpansions();
  //   console.log(arrayOfSeries);
  //   setSetsBySeries(arrayOfSeries);
  // }
  useEffect(() => {
    if (router.isReady) {
      console.log(setsBySeries);
      setsBySeries.forEach((series: any) => {
        series.sets.forEach((set: any) => {
          //router.prefetch("/set/" + (set.id == "pop2" ? "poptwo" : set.id));
        });
      });
      let selectedSeries = router.query["opened-series"]?.toString();
      let element = document.getElementById(selectedSeries || "");
      console.log(element);
      if (element) {
        toggleAccordion(selectedSeries);
      } else {
        router.push(
          "/series?" + "opened-series=" + setsBySeries[0].id,
          undefined,
          {
            shallow: true,
          }
        );
      }
      //   localExpansionsGet();
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
  }, [router.isReady]);
  const toggleAccordion = (seriesId: any) => {
    console.log(seriesId);
    setTimeout(() => {
      setSetsBySeries((arrayOfSeriesState: any) => {
        arrayOfSeriesState.forEach((s: any) => {
          // s.isOpen = false;
          if (s.id == seriesId) {
            // s.isOpen = !series.isOpen;
            s.isOpen = true;
          } else {
            s.isOpen = false;
          }
          console.log(s.isOpen);
        });
        console.log(arrayOfSeriesState);
        router.push("/series?" + "opened-series=" + seriesId, undefined, {
          shallow: true,
        });
        return [...arrayOfSeriesState];
      });
      setTimeout(() => {
        document.getElementById(seriesId)?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "start",
        });
      }, 100);
    }, 200); //default accordion transition is 0.2s
  };
  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        <h4 className="mb-4">All Pokemon TCG expansions</h4>
      </div>
      <div className="accordion">
        {setsBySeries.map((series, seriesIndex) => {
          return (
            <div
              className="accordion-item special-accordion-wrapper"
              key={series.id}
              id={series.id}
            >
              <h2
                className="accordion-header  special-accordion-border special-accordion"
                id={series.id + "-heading"}
              >
                <button
                  className={
                    "accordion-button special-accordion py-2-5 px-3 fs-5 fw-bold " +
                    (series.isOpen ? "" : "collapsed")
                  }
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={"#" + series.id + "-series-id"}
                  aria-expanded="false"
                  aria-controls={series.id + "-series-id"}
                  onClick={() => toggleAccordion(series.id)}
                >
                  {series.series}
                </button>
              </h2>
              <div
                id={series.id + "-series-id"}
                className={
                  "accordion-collapse collapse " + (series.isOpen ? "show" : "")
                }
                aria-labelledby={series.id + "-heading"}
              >
                <div className="accordion-body pb-2 pt-3">
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
                    {series.sets.map((set: any) => {
                      return (
                        <div
                          className={"col mb-2 " + styles.set}
                          key={set.id}
                          id={set.id}
                        >
                          <Link
                            href={
                              // this is done because pop2 is blocked by ad blocker
                              "/set/" + (set.id == "pop2" ? "poptwo" : set.id)
                            }
                          >
                            <a>
                              <div className={styles["set-image"]}>
                                <ImageComponent
                                  src={set?.images?.logo}
                                  alt={set.name}
                                  height={72}
                                  width={192}
                                  blurDataURL={"/images/Cardback-sideways.webp"}
                                />
                              </div>

                              <div className={styles["set-name"]}>
                                <span className="fw-bold">{set.name}</span>
                              </div>
                            </a>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
