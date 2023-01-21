import {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { SeriesArrayProps } from "../../models/GenericModels";
import styles from "./ExpansionsComponent.module.css";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { useRouter } from "next/router";
import Link from "next/link";
import { defaultBlurImage } from "../../../public/base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { Helper } from "../../utils/helper";
import { SpecialSetNames } from "../../models/Enums";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  arrayOfSeries,
  totalNumberOfSets,
  sets,
}: any) => {
  let router = useRouter();
  const appContextValues = useContext(AppContext);
  const [setsBySeries, setSetsBySeries] = useState<any[]>(arrayOfSeries);

  useEffect(() => {
    if (router.isReady) {
      let selectedSeriesId = router.query["opened-series"]?.toString();
      let element = document.getElementById(selectedSeriesId || "");
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
        setSetsBySeries([...setsBySeries]);
      } else {
        router.push("/series?opened-series=" + setsBySeries[0].id, undefined, {
          shallow: true,
        });
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    const toastTrigger = document.getElementById("liveToastBtn");
    const toastLiveExample = document.getElementById("liveToast");
    let handleToastClick = () => {
      let bootStrapMasterClass = appContextValues?.appState?.bootstrap;
      new bootStrapMasterClass.Toast(toastLiveExample).show();
      triggerPrefetch();
    };
    if (toastTrigger && appContextValues?.appState?.bootstrap) {
      toastTrigger.addEventListener("click", handleToastClick);
    }
    return () => {
      toastTrigger?.removeEventListener("click", handleToastClick);
    };
  }, [appContextValues?.appState?.bootstrap]);

  const toggleAccordion = (seriesId: any) => {
    let allowScroll = false;
    setsBySeries.forEach((s: any) => {
      if (s.id !== seriesId) {
        if (s.isOpen) {
          (
            document.getElementById(s.id)?.children[0].children[0] as any
          )?.click();
        }
        s.isOpen = false;
      } else {
        s.isOpen = !s.isOpen;
        allowScroll = s.isOpen;
      }
    });
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
    if (allowScroll) {
      setTimeout(() => {
        document.getElementById(seriesId)?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "start",
        });
      }, 500);
    }
  };

  const triggerPrefetch = async () => {
    let callUrls: string[] = [];
    const batchAndExecutePrefetchThenClearUrls = async (i: number) => {
      callUrls.push(
        "/set/" +
          (sets[i].id == SpecialSetNames.pop2
            ? SpecialSetNames.poptwo
            : sets[i].id)
      );
      console.log(callUrls, "in progress");
      let calls = callUrls.map(async (callUrl) => {
        return router.prefetch(callUrl).then((prefetchedData) => {
          console.log(callUrl, "done");
        });
      });
      await Promise.all(calls);
      callUrls = [];
    };
    for (let i = 0; i < sets.length; i++) {
      if ((i + 1) % 5) {
        if (sets.length - 1 === i) {
          batchAndExecutePrefetchThenClearUrls(i);
        }
      } else {
        batchAndExecutePrefetchThenClearUrls(i);
      }
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
                      if (e.isTrusted) {
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
                                (set.id === SpecialSetNames.pop2
                                  ? SpecialSetNames.poptwo
                                  : set.id)
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
      <button type="button" className="btn btn-primary" id="liveToastBtn">
        Show live toast
      </button>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-autohide="false"
        >
          <div className="toast-header">
            <img src="..." className="rounded me-2" alt="..." />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            Hello, world! This is a toast message.
          </div>
        </div>
      </div>
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
