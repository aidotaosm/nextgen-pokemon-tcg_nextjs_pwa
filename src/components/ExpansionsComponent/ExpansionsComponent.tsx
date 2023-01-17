import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { SeriesArrayProps } from "../../models/GenericModels";
import styles from "./ExpansionsComponent.module.css";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { useRouter } from "next/router";
import Link from "next/link";
import { defaultBlurImage } from "../../../public/base64Images/base64Images";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  arrayOfSeries,
  totalNumberOfSets,
}: any) => {
  let router = useRouter();

  const [setsBySeries, setSetsBySeries] = useState<any[]>(arrayOfSeries);
  // useEffect(() => {
  //   setsBySeries.forEach((series: any) => {
  //     series.sets.forEach((set: any) => {
  //       //router.prefetch("/set/" + (set.id == "pop2" ? "poptwo" : set.id));
  //     });
  //   });
  // }, []);
  useEffect(() => {
    if (router.isReady) {
      let selectedSeriesId = router.query["opened-series"]?.toString();
      let element = document.getElementById(selectedSeriesId || "");
      console.log(element);
      if (element && selectedSeriesId !== setsBySeries[0].id) {
        (
          document.getElementById(setsBySeries[0].id)?.children[0]
            .children[0] as any
        )?.click();
        (element.children[0].children[0] as any)?.click();
        setTimeout(() => {
          element?.scrollIntoView({
            behavior: "smooth",
            inline: "start",
            block: "start",
          });
        }, 500);
        setsBySeries.forEach((series) => {
          if (series.id === selectedSeriesId) {
            series.isOpen = true;
          } else {
            series.isOpen = false;
          }
        });
        console.log(setsBySeries);
        setSetsBySeries([...setsBySeries]);
      } else {
        router.push("/series?opened-series=" + setsBySeries[0].id, undefined, {
          shallow: true,
        });
        // (
        //   document.getElementById(setsBySeries[0].id)?.children[0]
        //     .children[0] as any
        // )?.click();
      }
      // let prefetchModalElement = document.getElementById(
      //   "prefetch-modal-trigger"
      // );
      // if (prefetchModalElement) {
      //   prefetchModalElement.click();
      // }
      // setsBySeries.forEach((series: any, seriesIndex: number) => {
      //   series.sets.forEach((set: any, setIndex: number) => {
      //     router
      //       .prefetch("/set/" + (set.id == "pop2" ? "poptwo" : set.id))
      //       .then((x) => {})
      //       .catch((e) => {});
      //   });
      // });
    }
  }, [router.isReady]);

  const toggleAccordion = (seriesId: any) => {
    console.log(seriesId);
    let allowScroll = false;
    setsBySeries.forEach((s: any) => {
      if (s.id !== seriesId) {
        if (s.isOpen) {
          (
            document.getElementById(s.id)?.children[0].children[0] as any
          )?.click();
          console.log(document.getElementById(s.id));
        }
        s.isOpen = false;
      } else {
        s.isOpen = !s.isOpen;
        allowScroll = s.isOpen;
      }
    });
    console.log(setsBySeries);
    setSetsBySeries([...setsBySeries]);
    if (allowScroll) {
      router.push("/series?opened-series=" + seriesId, undefined, {
        shallow: true,
      });
    } else {
      router.push("/series", undefined, {
        shallow: true,
      });
    }
    console.log("allowScroll", allowScroll);
    if (allowScroll) {
      setTimeout(() => {
        document.getElementById(seriesId)?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "start",
        });
      }, 200);
    }
  };

  return (
    <Fragment>
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
                      (seriesIndex === 0 ? "" : "collapsed")
                    }
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={"#" + series.id + "-series-id"}
                    aria-expanded="false"
                    aria-controls={series.id + "-series-id"}
                    onClick={(e) => {
                      console.log(e);
                      if (e.nativeEvent?.isTrusted) {
                        toggleAccordion(series.id);
                      }
                    }}
                  >
                    {series.series}
                  </button>
                </h2>
                <div
                  id={series.id + "-series-id"}
                  className={
                    "accordion-collapse collapse " +
                    (seriesIndex === 0 ? "show" : "")
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
                                "/set/" +
                                (set.id === "pop2" ? "poptwo" : set.id)
                              }
                            >
                              <>
                                <div className={styles["set-image"]}>
                                  <ImageComponent
                                    src={set?.images?.logo}
                                    alt={set.name}
                                    height={72}
                                    width={192}
                                    blurDataURL={defaultBlurImage}
                                    className="w-100 h-auto"
                                  />
                                </div>
                                <div className={styles["set-name"]}>
                                  <span className="fw-bold">{set.name}</span>
                                </div>
                              </>
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
      {/* <i class="fa-solid fa-memory"></i> */}
      <div
        id="prefetch-modal-trigger"
        data-bs-toggle="modal"
        data-bs-target="#prefetch-modal"
      ></div>
      <MemoizedModalComponent
        id="prefetch-modal"
        primaryClasses="modal-xl vertical-align-modal"
        // handleModalClose={handleModalClose}
        // modalCloseButton={modalCloseButton}
      >
        {totalNumberOfSets}
      </MemoizedModalComponent>
    </Fragment>
  );
};

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
