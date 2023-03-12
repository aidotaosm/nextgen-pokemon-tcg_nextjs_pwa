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
  faArrowsSpin,
  faCheck,
  faDownload,
  faGear,
  faRecycle,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ToastComponent } from "../UtilityComponents/ToastComponent";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";
import { IF } from "../UtilityComponents/IF";
import { flushSync } from "react-dom";
import { LocalSearchComponent } from "../LocalSearchComponent/LocalSearchComponent";
import {
  getAllCards,
  getAllRarities,
  getAllSubtypes,
  getAllSuperTypes,
  getAllTypes,
} from "../../utils/networkCalls";
import { Helper } from "../../utils/helper";
import { Tooltip } from "bootstrap";
import { DEFAULT_PAGE_SIZE } from "../../constants/constants";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  arrayOfSeries,
  totalNumberOfSets,
}: any) => {
  let router = useRouter();
  const { appState, updateGlobalSearchTerm } = useContext(AppContext);
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
  const [searchPageDownloaded, setSearchPageDownloaded] = useState<
    "no" | "loading" | "yes"
  >("no");
  const [downloadAllCardsLoading, setDownloadAllCardsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const downloadLatestAllCardsJsonTooltipId =
    "downloadLatestAllCardsJsonTooltipId";
  const clearCacheUnregisterSWARefreshTooltipId =
    "clearCacheUnregisterSWARefreshTooltipId";
  const settingsTooltipId = "settingsTooltipId";

  useEffect(() => {
    if (router.isReady) {
      triggerSearchPagePrefetch();
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
        router.push("/series?opened-series=" + setsBySeries[0]?.id, undefined, {
          shallow: true,
        });
      }
    }
  }, [router.isReady]);
  useEffect(() => {
    let tooltipTriggerInstance: Tooltip,
      cacheTooltipInstance: Tooltip,
      settingsTooltipInstance: Tooltip;
    let bootStrapMasterClass = appState?.bootstrap;
    const tooltipTrigger = document.getElementById(
      downloadLatestAllCardsJsonTooltipId
    ) as any;
    if (bootStrapMasterClass && tooltipTrigger) {
      tooltipTriggerInstance = new bootStrapMasterClass.Tooltip(tooltipTrigger);
    }
    const cacheTooltipTrigger = document.getElementById(
      clearCacheUnregisterSWARefreshTooltipId
    ) as any;
    if (bootStrapMasterClass && cacheTooltipTrigger) {
      cacheTooltipInstance = new bootStrapMasterClass.Tooltip(
        cacheTooltipTrigger
      );
    }
    const settingsTrigger = document.getElementById(settingsTooltipId) as any;
    if (bootStrapMasterClass && settingsTrigger) {
      settingsTooltipInstance = new bootStrapMasterClass.Tooltip(
        settingsTrigger
      );
    }
    return () => {
      tooltipTriggerInstance?.dispose();
      cacheTooltipInstance?.dispose();
      settingsTooltipInstance?.dispose();
    };
  }, [appState?.bootstrap, router.pathname]);
  useEffect(() => {
    const onToastShowHandler = async () => {
      triggerSearchPagePrefetch();
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
    if (navigator.onLine) {
      const toastLiveExample = document.getElementById(prefetchToastId);
      let bootStrapMasterClass = appState?.bootstrap;
      // if (modalCloseButton.current) {
      //   modalCloseButton.current.click();
      // }
      if (toastLiveExample && bootStrapMasterClass) {
        const settingsTooltipInstance: Tooltip =
          bootStrapMasterClass.Tooltip.getInstance("#" + settingsTooltipId);

        setTimeout(() => {
          settingsTooltipInstance?.hide();
        }, 0);

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
  const triggerSearchPagePrefetch = async () => {
    setSearchPageDownloaded("loading");
    router
      .prefetch("/search")
      .then((prefetchedData) => {
        setSearchPageDownloaded("yes");
      })
      .catch((e) => {
        setSearchPageDownloaded("no");
      });
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
        await router.prefetch(set.callUrl, undefined, {
          unstable_skipClientCache: true,
        });
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

  const downloadAllCardsJson = () => {
    setDownloadAllCardsLoading(true);
    getAllCards()
      .then((cardsParentObject) => {
        let firstPageOfCards = cardsParentObject.slice(0, DEFAULT_PAGE_SIZE);
        let firstPageOfCardsWithTotalCount = {
          firstPageOfCards,
          totalCount: cardsParentObject.length,
        };
        Helper.saveTemplateAsFile(
          "firstPageOfCardsWithTotalCount.json",
          firstPageOfCardsWithTotalCount
        );
        Helper.saveTemplateAsFile("AllCards.json", cardsParentObject);
      })
      .finally(() => {
        setDownloadAllCardsLoading(false);
      });
    Promise.all([
      getAllRarities(),
      getAllSuperTypes(),
      getAllTypes(),
      getAllSubtypes(),
    ]).then((responseArray) => {
      const allRarities = responseArray[0];
      const allSuperTypes = responseArray[1];
      const allTypes = responseArray[2];
      const allSubtypes = responseArray[3];
      Helper.saveTemplateAsFile("AllRarities.json", allRarities);
      Helper.saveTemplateAsFile("AllSuperTypes.json", allSuperTypes);
      Helper.saveTemplateAsFile("AllTypes.json", allTypes);
      Helper.saveTemplateAsFile("AllSubtypes.json", allSubtypes);
    });
  };
  const clearCacheUnregisterSWARefresh = async () => {
    self.caches.keys().then((keys) => {
      keys.forEach((key) => self.caches.delete(key));
    });
    const registeredServiceWorkers =
      await navigator.serviceWorker.getRegistrations();
    registeredServiceWorkers.forEach((registration) => {
      registration.unregister();
    });
    window.location.reload();
  };
  const setSearchValueFunction = (
    value: string,
    eventType: "onChange" | "submit"
  ) => {
    if (eventType === "submit") {
      updateGlobalSearchTerm?.(value || "");
      router.push("/search");
    }
    setSearchValue(value);
  };
  return (
    <Fragment>
      <div className="container">
        <div className="d-md-flex justify-content-between mb-4">
          <div className="mb-4 mb-md-0 search-wrapper">
            <LocalSearchComponent
              setSearchValueFunction={setSearchValueFunction}
              initialPlaceHolder={"Global search e.g. "}
              defaultSearchTerm={searchValue}
            />
          </div>
          <div className="d-flex justify-content-center justify-content-md-end">
            <h4 className="me-4 mb-0">Pokemon TCG Expansions</h4>
            <span
              data-bs-title={
                "Settings - Preload data for offline use. Fix unexpected issues and more."
              }
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              id={settingsTooltipId}
            >
              <FontAwesomeIcon
                icon={faGear}
                size="2x"
                onClick={handleToastClick}
                // data-bs-toggle="modal"
                // data-bs-target={"#" + prefetchInitModalId}
                className="cursor-pointer"
                spin={
                  totalNumberOfSetsDone === totalNumberOfSets ||
                  searchPageDownloaded === "yes"
                }
                spinPulse={
                  (totalNumberOfSetsDone === totalNumberOfSets ||
                    searchPageDownloaded === "yes") &&
                  !(
                    totalNumberOfSetsDone === totalNumberOfSets &&
                    searchPageDownloaded === "yes"
                  )
                }
              />
            </span>
          </div>
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
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 align-items-center">
                      {series.sets.map((set: any, setIndex: number) => {
                        return (
                          <Link
                            className={"col mb-2 " + styles.set}
                            key={set.id}
                            id={set.id}
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
                                  fallBackType="logo"
                                  fallbackImage={
                                    "/images/International_Pokémon_logo.png"
                                  }
                                />
                              </div>
                              <div className={styles["set-name"]}>
                                <span className="fw-bold me-2">{set.name}</span>
                                <ImageComponent
                                  src={set?.images?.symbol}
                                  alt={set?.name + " Symbol"}
                                  height={25}
                                  width={25}
                                  blurDataURL={logoBlurImage}
                                  className="disable-save set-symbol-in-expansions"
                                  fallBackType="symbol"
                                  fallbackImage={"/images/free-energy.png"}
                                />
                              </div>
                            </>
                          </Link>
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
      {/* <MemoizedModalComponent
        id={prefetchInitModalId}
        primaryClasses="vertical-align-modal"
        hideFooter={false}
        hideHeader={false}
        modalTitle="Download data"
        modalCloseButton={modalCloseButton}
        handleOkButtonPress={handleToastClick}
        okButtonText={"Download"}
      >
        <div>
          Do you want to pre-load expansions for offline use? You can continue
          using the site as it runs in the background.
        </div>
      </MemoizedModalComponent> */}
      <ToastComponent
        autoHide={false}
        toastTitle={
          <div>
            <span className="me-2">Optimization Status</span>
            <a
              className="cursor-pointer"
              onClick={() => {
                clearCacheUnregisterSWARefresh();
              }}
              data-bs-title={
                "If you are facing any problems you may use this feature. It should fix any issues on the app's end. Note that the optimizations will need to be re-run."
              }
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              id={clearCacheUnregisterSWARefreshTooltipId}
            >
              <FontAwesomeIcon icon={faRecycle} className="" />
            </a>
          </div>
        }
        id={prefetchToastId}
      >
        <div>
          <p>
            Pre-load expansions for offline use. You can continue using the site
            as it runs in the background.
          </p>
          <hr />
          <div className="mb-2 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="">
                {searchPageDownloaded == "loading" ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin={true}
                    className="text-primary"
                  />
                ) : searchPageDownloaded == "yes" ? (
                  <FontAwesomeIcon icon={faCheck} className="text-success" />
                ) : (
                  <FontAwesomeIcon icon={faXmark} className="text-danger" />
                )}
              </div>
              <div className="ms-2 fw-bold">Offline Global search</div>
            </div>
            <a
              className="cursor-pointer"
              onClick={() => {
                if (downloadAllCardsLoading) {
                  return;
                }
                downloadAllCardsJson();
              }}
              data-bs-title={
                "(For developers only) Download all cards data in a JSON file. This might take around 3 minutes."
              }
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              id={downloadLatestAllCardsJsonTooltipId}
            >
              <FontAwesomeIcon
                spin={downloadAllCardsLoading ? true : false}
                icon={downloadAllCardsLoading ? faArrowsSpin : faDownload}
                className=""
              />
            </a>
          </div>
          <hr />
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
                  if (navigator.onLine) {
                    flushSync(() => {
                      setShouldCancel(false);
                    });
                    await triggerPrefetch();
                  }
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
                  if (navigator.onLine) {
                    setShouldCancel(true);
                  }
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
