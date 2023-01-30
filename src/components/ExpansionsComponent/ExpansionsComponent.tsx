import {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SeriesArrayProps } from "../../models/GenericModels";
import styles from "./ExpansionsComponent.module.css";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { useRouter } from "next/router";
import Link from "next/link";
import { logoBlurImage } from "../../../base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { SpecialSetNames } from "../../models/Enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClipboardCheck,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ToastComponent } from "../UtilityComponents/ToastComponent";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";
import { IF } from "../UtilityComponents/IF";
import { flushSync } from "react-dom";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  arrayOfSeries,
  totalNumberOfSets,
}: any) => {
  let router = useRouter();
  const appContextValues = useContext(AppContext);
  const [setsBySeries, setSetsBySeries] = useState<any[]>(arrayOfSeries);
  const modalCloseButton = useRef<any>();
  const prefetchToastId = "prefetchToast";
  const prefetchInitModalId = "prefetchInitModal";
  const [prefetchingSets, setPrefetchingSets] = useState<any[]>([]);
  const [totalNumberOfSetsDone, setTotalNumberOfSetsDone] = useState<number>(0);
  const [shouldCancel, setShouldCancel] = useState<boolean>(false);
  const [lastSeriesAndSetIndexes, setLastSeriesAndSetIndexes] = useState({
    lastSeriesIndex: 0,
    lastSetOfSeriesIndex: 0,
  });
  useEffect(() => {
    if (router.isReady) {
      let selectedSeriesId = router.query["opened-series"]?.toString();
      let element = document.getElementById(selectedSeriesId || "");
      if (element && selectedSeriesId !== setsBySeries[0].id) {
        (
          document.getElementById(setsBySeries[0].id)?.children[0]
            .children[0] as HTMLElement
        )?.click();
        (element.children[0].children[0] as HTMLElement)?.click();
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
    const onToastShowHandler = async () => {
      await triggerPrefetch();
    };
    const myToastEl = document.getElementById(prefetchToastId) as HTMLElement;
    if (myToastEl) {
      myToastEl.addEventListener("shown.bs.toast", onToastShowHandler);
    }
    return () => {
      myToastEl.removeEventListener("shown.bs.toast", onToastShowHandler);
    };
  }, []);
  const handleToastClick = async () => {
    const toastLiveExample = document.getElementById(prefetchToastId);
    let bootStrapMasterClass = appContextValues?.appState?.bootstrap;
    if (modalCloseButton.current) {
      modalCloseButton.current.click();
    }
    if (toastLiveExample && bootStrapMasterClass) {
      new bootStrapMasterClass.Toast(toastLiveExample).show();
      //resetting all related states for new fetch session
      setPrefetchingSets([]);
      setTotalNumberOfSetsDone(0);
      setShouldCancel(false);
      setLastSeriesAndSetIndexes({
        lastSeriesIndex: 0,
        lastSetOfSeriesIndex: 0,
      });
    }
  };
  const toggleAccordion = (seriesId: any) => {
    let allowScroll = false;
    setsBySeries.forEach((s: any) => {
      if (s.id !== seriesId) {
        if (s.isOpen) {
          (
            document.getElementById(s.id)?.children[0]
              .children[0] as HTMLElement
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
    let localShouldCancel = false;
    let setsWithCallUrls: any[] = [];
    let lastIndex = 0;
    let startingIndexOfTheLastPausedSetDownload =
      lastSeriesAndSetIndexes.lastSetOfSeriesIndex;

    const batchAndExecutePrefetchThenClearUrls = async (setIndex: number) => {
      setPrefetchingSets(setsWithCallUrls);
      let calls = setsWithCallUrls.map(async (set) => {
        return router.prefetch(set.callUrl).then((prefetchedData) => {
          flushSync(() => {
            setShouldCancel((x) => {
              localShouldCancel = x;
              return x;
            });
          });

          set.done = true;
          setPrefetchingSets([...setsWithCallUrls]);
          setTotalNumberOfSetsDone((e) => ++e);
          if (localShouldCancel) {
            throw new Error("manual abort");
          }
        });
      });
      let res = null;
      try {
        res = await Promise.all(calls);
      } catch (e: any) {
        res = e;
      }
      setsWithCallUrls = [];
      setPrefetchingSets(setsWithCallUrls);
      return res;
    };
    seriesLoop: for (
      let seriesIndex = lastSeriesAndSetIndexes.lastSeriesIndex;
      seriesIndex < setsBySeries.length;
      seriesIndex++
    ) {
      setsBySeries[seriesIndex].prefetchStatus = "loading";
      if (seriesIndex > 0) {
        setsBySeries[seriesIndex - 1].prefetchStatus = "done";
      }
      setSetsBySeries([...setsBySeries]);
      setLoop: for (
        let setIndex = startingIndexOfTheLastPausedSetDownload;
        setIndex < setsBySeries[seriesIndex].sets.length;
        setIndex++
      ) {
        if ((setIndex + 1) % 5) {
          setsWithCallUrls.push({
            ...setsBySeries[seriesIndex].sets[setIndex],
            callUrl:
              "/set/" +
              (setsBySeries[seriesIndex].sets[setIndex].id ==
              SpecialSetNames.pop2
                ? SpecialSetNames.poptwo
                : setsBySeries[seriesIndex].sets[setIndex].id),
          });
          if (setsBySeries[seriesIndex].sets.length - 1 === setIndex) {
            let res = await batchAndExecutePrefetchThenClearUrls(setIndex);
            if (res?.message === "manual abort") {
              setPrefetchingSets([]);
              lastIndex = seriesIndex;
              setLastSeriesAndSetIndexes({
                lastSeriesIndex:
                  setsBySeries.length - 1 === seriesIndex
                    ? seriesIndex
                    : ++seriesIndex,
                lastSetOfSeriesIndex: 0,
              });
              break seriesLoop;
            }
          }
        } else {
          setsWithCallUrls.push({
            ...setsBySeries[seriesIndex].sets[setIndex],
            callUrl:
              "/set/" +
              (setsBySeries[seriesIndex].sets[setIndex].id ==
              SpecialSetNames.pop2
                ? SpecialSetNames.poptwo
                : setsBySeries[seriesIndex].sets[setIndex].id),
          });
          let res = await batchAndExecutePrefetchThenClearUrls(setIndex);
          if (res?.message === "manual abort") {
            setPrefetchingSets([]);
            lastIndex = seriesIndex;
            setLastSeriesAndSetIndexes({
              lastSeriesIndex: seriesIndex,
              lastSetOfSeriesIndex: ++setIndex,
            });
            break seriesLoop;
          }
        }
        //resetting starting index since at last one set has past over the last download index.
        startingIndexOfTheLastPausedSetDownload = 0;
      }
      lastIndex = seriesIndex;
    }
    if (!localShouldCancel) {
      setsBySeries[lastIndex].prefetchStatus = "done";
    } else {
      delete setsBySeries[lastIndex].prefetchStatus;
    }
    setSetsBySeries([...setsBySeries]);
  };
  return (
    <Fragment>
      <div className="container">
        <div className="d-flex justify-content-end mb-4">
          <h4 className="me-4 mb-0">All Pokemon TCG expansions</h4>
          <FontAwesomeIcon
            icon={faClipboardCheck}
            size="2x"
            data-bs-toggle="modal"
            data-bs-target={"#" + prefetchInitModalId}
            className="cursor-pointer"
          />
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
                      "accordion-button special-accordion py-2-2-5 px-3 fs-5 fw-bold " +
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
                      {series.sets.map((set: any, setIndex: number) => {
                        return (
                          <div
                            className={"col mb-2 " + styles.set}
                            key={set.id}
                            id={set.id}
                          >
                            <Link
                              //only the first 2 sets of each expansion are prefetched upon viewport entry
                              prefetch={setIndex < 2}
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
                                    blurDataURL={logoBlurImage}
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
      <MemoizedModalComponent
        id={prefetchInitModalId}
        primaryClasses="vertical-align-modal"
        hideFooter={false}
        hideHeader={false}
        modalTitle="Download all expansion data"
        modalCloseButton={modalCloseButton}
        handleOkButtonPress={handleToastClick}
        okButtonText={"Download"}
      >
        <div>
          Do you want to pre-load all the sets for offline use? You can continue
          using the site as it runs in the background.
        </div>
      </MemoizedModalComponent>
      <ToastComponent
        autoHide={false}
        toastTitle="Prefetch Status"
        id={prefetchToastId}
      >
        <div>
          <div
            className={
              "mb-2 d-flex fw-bold " +
              (totalNumberOfSetsDone < totalNumberOfSets
                ? "justify-content-between"
                : "justify-content-end")
            }
          >
            <IF
              condition={
                totalNumberOfSetsDone < totalNumberOfSets && shouldCancel
              }
            >
              <a
                className="cursor-pointer"
                onClick={async () => {
                  flushSync(() => {
                    setShouldCancel(false);
                  });
                  await triggerPrefetch();
                }}
              >
                Resume
              </a>
            </IF>
            <IF
              condition={
                totalNumberOfSetsDone < totalNumberOfSets && !shouldCancel
              }
            >
              <a
                className="cursor-pointer"
                onClick={() => {
                  setShouldCancel(true);
                }}
              >
                Pause
              </a>
            </IF>
            <span>
              {totalNumberOfSetsDone} / {totalNumberOfSets}
            </span>
          </div>
          <IF condition={prefetchingSets.length}>
            <div className="fw-bold mb-2 fs-6">Currently downloading sets</div>
            <div className="row row-cols-2">
              {prefetchingSets.map((set: any, setIndex: number) => {
                return (
                  <div className="col mb-1" key={set.id} id={set.id}>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        {set.done ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-success"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faSpinner}
                            spin={true}
                            className="text-primary"
                          />
                        )}
                      </div>
                      <div>{set.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <hr />
          </IF>
          <div className="fw-bold mb-2 fs-6">Expansions</div>
          <div className="row row-cols-2">
            {setsBySeries.map((series, seriesIndex) => {
              return (
                <div className="col mb-1" key={series.id} id={series.id}>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      {series.prefetchStatus == "loading" ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin={true}
                          className="text-primary"
                        />
                      ) : series.prefetchStatus == "done" ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-success"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-danger"
                        />
                      )}
                    </div>
                    <div className="">{series.series}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ToastComponent>
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
