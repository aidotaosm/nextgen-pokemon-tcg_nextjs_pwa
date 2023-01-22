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
import { defaultBlurImage } from "../../../public/base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { Helper } from "../../utils/helper";
import { SpecialSetNames } from "../../models/Enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { ToastComponent } from "../UtilityComponents/ToastComponent";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  arrayOfSeries,
  totalNumberOfSets,
  sets,
}: any) => {
  let router = useRouter();
  const appContextValues = useContext(AppContext);
  const [setsBySeries, setSetsBySeries] = useState<any[]>(arrayOfSeries);
  const modalCloseButton = useRef<any>();
  const prefetchToastButtonId = "prefetchToastButton";
  const prefetchToastId = "prefetchToast";
  const prefetchInitModalId = "prefetchInitModal";

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

  let handleToastClick = () => {
    const toastLiveExample = document.getElementById(prefetchToastId);
    let bootStrapMasterClass = appContextValues?.appState?.bootstrap;
    if (toastLiveExample && bootStrapMasterClass) {
      new bootStrapMasterClass.Toast(toastLiveExample).show();
      triggerPrefetch();
    }
    if (modalCloseButton.current) {
      modalCloseButton.current.click();
    }
  };
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
  console.log(sets);
  const triggerPrefetch = async () => {
    let setsWithCallUrls: any[] = [];
    const batchAndExecutePrefetchThenClearUrls = async (i: number) => {
      console.log(setsWithCallUrls, "in progress");
      let calls = setsWithCallUrls.map(async (set) => {
        return router.prefetch(set.callUrl).then((prefetchedData) => {
          console.log(set.name, "done");
        });
      });
      await Promise.all(calls);
      setsWithCallUrls = [];
    };
    for (let i = 0; i < sets.length; i++) {
      if ((i + 1) % 5) {
        setsWithCallUrls.push({
          ...sets[i],
          callUrl:
            "/set/" +
            (sets[i].id == SpecialSetNames.pop2
              ? SpecialSetNames.poptwo
              : sets[i].id),
        });
        if (sets.length - 1 === i) {
          await batchAndExecutePrefetchThenClearUrls(i);
        }
      } else {
        setsWithCallUrls.push({
          ...sets[i],
          callUrl:
            "/set/" +
            (sets[i].id == SpecialSetNames.pop2
              ? SpecialSetNames.poptwo
              : sets[i].id),
        });
        await batchAndExecutePrefetchThenClearUrls(i);
      }
    }
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
        <div>as</div>
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
