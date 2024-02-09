import {
  faArrowsSpin,
  faCheck,
  faDownload,
  faGear,
  faPlay,
  faRecycle,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "bootstrap";
import { useRouter } from "next/router";
import {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { AppContext } from "../../contexts/AppContext";
import { SpecialSetNames } from "../../models/Enums";
import { Helper } from "../../utils/helper";
import {
  getAllCards,
  getAllRarities,
  getAllSubtypes,
  getAllSuperTypes,
  getAllTypes,
} from "../../utils/networkCalls";
import { IF } from "../UtilityComponents/IF";
import { ToastComponent } from "../UtilityComponents/ToastComponent";
import {
  chechSetAndSearchPreCacheStatus,
  triggerAllCardsPreCache,
} from "../../utils/prefetch-allcards";
interface PreloadComponentProps {
  arrayOfSeries?: any[];
  totalNumberOfSets: number;
}
export const PreloadComponent: FunctionComponent<PreloadComponentProps> = ({
  arrayOfSeries,
  totalNumberOfSets,
}: any) => {
  const { appState } = useContext(AppContext);
  const prefetchToastId = "prefetchToast";
  const [prefetchingSets, setPrefetchingSets] = useState<any[]>([]);
  const [setsBySeries, setSetsBySeries] = useState<any[]>(arrayOfSeries);
  const [totalNumberOfSetsDone, setTotalNumberOfSetsDone] = useState<number>(0);
  const [shouldCancel, setShouldCancel] = useState<boolean>(true);
  const [serviceWorkerIsReady, setServiceWorkerIsReady] =
    useState<boolean>(false);
  const [lastSeriesAndSetIndexes, setLastSeriesAndSetIndexes] = useState({
    lastSeriesIndex: 0,
    lastSetOfSeriesIndex: 0,
  });
  const [searchPageDownloaded, setSearchPageDownloaded] = useState<
    "no" | "loading" | "yes"
  >("no");
  const [downloadAllCardsLoading, setDownloadAllCardsLoading] = useState(false);
  const downloadLatestAllCardsJsonTooltipId =
    "downloadLatestAllCardsJsonTooltipId";
  const clearCacheUnregisterSWARefreshTooltipId =
    "clearCacheUnregisterSWARefreshTooltipId";
  const settingsTooltipId = "settingsTooltipId";
  let router = useRouter();
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
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(async (x) => {
        setServiceWorkerIsReady(true);
        chechSetAndSearchPreCacheStatus(
          setsBySeries,
          setSearchPageDownloaded,
          setTotalNumberOfSetsDone,
          setSetsBySeries
        );
      });
    }
  }, []);

  const triggerSearchPagePrefetch = async () => {
    setSearchPageDownloaded("loading");
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready
        .then(async (x) => {
          router.prefetch("/search");
          await triggerAllCardsPreCache(
            () => {
              setSearchPageDownloaded("yes");
            },
            () => {
              setSearchPageDownloaded("no");
            }
          );
        })
        .catch((e) => {
          setSearchPageDownloaded("no");
        });
    } else {
      setSearchPageDownloaded("no");
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
        await router.prefetch(set.callUrl);
        flushSync(() => {
          setShouldCancel((x) => {
            localShouldCancel = x;
            return x;
          });
        });
        set.done = true;
        const updatedSetsWithCallUrls = [...setsWithCallUrls];
        setPrefetchingSets(updatedSetsWithCallUrls);
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
      if (setsBySeries[seriesIndex].prefetchStatus !== "done") {
        if (seriesIndex > 0) {
          setsBySeries[seriesIndex - 1].prefetchStatus = "done";
          setSetsBySeries([...setsBySeries]);
        }
        const isLastSeries = setsBySeries.length - 1 === seriesIndex;
        setLoop: for (
          let setIndex = startingIndexOfTheLastPausedSetDownload;
          setIndex < setsBySeries[seriesIndex].sets.length;
          setIndex++
        ) {
          const isLastSetOfSeries =
            setsBySeries[seriesIndex].sets.length - 1 === setIndex;
          if (setsBySeries[seriesIndex].sets[setIndex].done !== true) {
            if ((setIndex + 1) % 5) {
              // pushing urls to be executed when we have 5 urls
              setsWithCallUrls.push({
                ...setsBySeries[seriesIndex].sets[setIndex],
                callUrl:
                  "/set/" +
                  (setsBySeries[seriesIndex].sets[setIndex].id ==
                  SpecialSetNames.pop2
                    ? SpecialSetNames.poptwo
                    : setsBySeries[seriesIndex].sets[setIndex].id),
              });
              // executing prefetch since isLastSetOfSeries
              if (isLastSetOfSeries) {
                let res = await batchAndExecutePrefetchThenClearUrls(setIndex);
                if (res?.message === "manual abort") {
                  setPrefetchingSets([]);
                  lastIndex = seriesIndex;
                  setLastSeriesAndSetIndexes({
                    lastSeriesIndex: isLastSeries ? seriesIndex : ++seriesIndex,
                    lastSetOfSeriesIndex: 0,
                  });
                  break seriesLoop;
                }
              }
            } else {
              // executing prefetch since we have got 5 urls
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
                  lastSeriesIndex:
                    isLastSetOfSeries && !isLastSeries
                      ? ++seriesIndex
                      : seriesIndex,
                  lastSetOfSeriesIndex: isLastSetOfSeries ? 0 : ++setIndex,
                });
                break seriesLoop;
              }
            }
          }
          //resetting starting index since at last one set has past over the last download index.
          startingIndexOfTheLastPausedSetDownload = 0;
        }
      } else {
        if (seriesIndex > 0) {
          setsBySeries[seriesIndex - 1].prefetchStatus = "done";
          setSetsBySeries([...setsBySeries]);
        }
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
      .then((cardsParentObject: any[]) => {
        //sort all cards to national dex numbers
        cardsParentObject.sort(
          (firstColumn, secondColumn) =>
            (firstColumn.nationalPokedexNumbers?.[0] ||
              cardsParentObject.length - 1) -
            (secondColumn.nationalPokedexNumbers?.[0] ||
              cardsParentObject.length - 1)
        );
        Helper.saveTemplateAsFile("AllCards.json", cardsParentObject);

        // sort by name
        cardsParentObject.sort((firstColumn, secondColumn) =>
          firstColumn.name.localeCompare(secondColumn.name)
        );
        let listOfCardsWithUniqueNames = Array.from(
          new Set(cardsParentObject.map((card: any) => card.name))
        );
        Helper.saveTemplateAsFile(
          "AllCardsWithUniqueNames.json",
          listOfCardsWithUniqueNames
        );

        //reverse sort all cards with release date
        cardsParentObject.sort((firstColumn, secondColumn) =>
          new Date(firstColumn.set.releaseDate) >
          new Date(secondColumn.set.releaseDate)
            ? 1
            : new Date(firstColumn.set.releaseDate) ===
              new Date(secondColumn.set.releaseDate)
            ? 0
            : -1
        );
        cardsParentObject.reverse();
        let listOfUniqueSets = Array.from(
          new Map(cardsParentObject.map((item) => [item.set.id, item.set.name]))
        );
        Helper.saveTemplateAsFile("AllSetNames.json", listOfUniqueSets);
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
  const handleToastClick = async () => {
    if (navigator.onLine) {
      const toastLiveExample = document.getElementById(prefetchToastId);
      let bootStrapMasterClass = appState?.bootstrap;
      if (toastLiveExample && bootStrapMasterClass) {
        const settingsTooltipInstance: Tooltip =
          bootStrapMasterClass.Tooltip.getInstance("#" + settingsTooltipId);

        setTimeout(() => {
          settingsTooltipInstance?.hide();
        }, 0);

        new bootStrapMasterClass.Toast(toastLiveExample).show();
        //resetting all related states for new fetch session
        // setPrefetchingSets([]);
        // setTotalNumberOfSetsDone(0);
        // setShouldCancel(false);
        // setLastSeriesAndSetIndexes({
        //   lastSeriesIndex: 0,
        //   lastSetOfSeriesIndex: 0,
        // });
      }
    }
  };
  return (
    <Fragment>
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
          onClick={handleToastClick}
          className="cursor-pointer fs-3"
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
      <ToastComponent
        autoHide={false}
        toastTitle={
          <div>
            <span className="me-2">Optimization Status</span>
            <span
              className={
                "cursor-pointer span-link " +
                ((typeof window !== "undefined" && !navigator.onLine) ||
                !serviceWorkerIsReady
                  ? "disabled"
                  : "")
              }
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
            </span>
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
                  <FontAwesomeIcon
                    icon={faPlay}
                    className={
                      "cursor-pointer span-link " +
                      ((typeof window !== "undefined" && !navigator.onLine) ||
                      !serviceWorkerIsReady
                        ? "disabled"
                        : "")
                    }
                    onClick={triggerSearchPagePrefetch}
                  />
                )}
              </div>
              <div className="ms-2 fw-bold">Offline Global search</div>
            </div>
            <span
              className={
                "cursor-pointer span-link " +
                ((typeof window !== "undefined" && !navigator.onLine) ||
                !serviceWorkerIsReady
                  ? "disabled"
                  : "")
              }
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
            </span>
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
              <span
                className={
                  "cursor-pointer span-link " +
                  ((typeof window !== "undefined" && !navigator.onLine) ||
                  !serviceWorkerIsReady
                    ? "disabled"
                    : "")
                }
                onClick={async () => {
                  if (navigator.onLine) {
                    flushSync(() => {
                      setShouldCancel(false);
                    });
                    await triggerPrefetch();
                  }
                }}
              >
                {totalNumberOfSetsDone === 0 ? "Start" : "Resume"}
              </span>
            </IF>
            <IF
              condition={
                totalNumberOfSetsDone < totalNumberOfSets && !shouldCancel
              }
            >
              <span
                className={
                  "cursor-pointer span-link " +
                  ((typeof window !== "undefined" && !navigator.onLine) ||
                  !serviceWorkerIsReady
                    ? "disabled"
                    : "")
                }
                onClick={() => {
                  if (navigator.onLine) {
                    setShouldCancel(true);
                  }
                }}
              >
                Pause
              </span>
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
                <div className="col mb-1" key={series.id}>
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
