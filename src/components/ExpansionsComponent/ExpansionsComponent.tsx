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
import { logoBlurImage } from "../../../base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { SpecialSetNames } from "../../models/Enums";
import { LocalSearchComponent } from "../LocalSearchComponent/LocalSearchComponent";
import { PreloadComponent } from "../Preload/PreloadComponent";
import { Helper } from "../../utils/helper";
import { Vercel_DEFAULT_URL } from "../../constants/constants";

export const ExpansionsComponent: FunctionComponent<SeriesArrayProps> = ({
  totalNumberOfSets,
  arrayOfSeries,
}: any) => {
  let router = useRouter();
  const { updateGlobalSearchTerm } = useContext(AppContext);
  const [setsBySeries, setSetsBySeries] = useState<any[]>(arrayOfSeries);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (router.isReady) {
      // let arrayOfSets:any[] = [];
      // arrayOfSeries.forEach((x: any) => { arrayOfSets.push(...x.sets) });
      // const xmlText = Helper.generateSiteMap(arrayOfSets, Vercel_DEFAULT_URL + 'set/');
      // console.log(arrayOfSets);
      // Helper.saveTemplateAsFile(
      //   "sitemap.xml",
      //   xmlText,
      //   false,
      //   "text/plain"
      // );
      let selectedSeriesId = router.query["opened-series"]?.toString();
      let parentOfAccordionToOpen = document.getElementById(
        selectedSeriesId || ""
      );
      if (parentOfAccordionToOpen && selectedSeriesId !== setsBySeries[0].id) {
        const latestSetAccordion = document.getElementById(setsBySeries[0].id)
          ?.children[0].children[0] as HTMLElement;
        latestSetAccordion?.click();
        const accordionToOpen = parentOfAccordionToOpen.children[0]
          .children[0] as HTMLElement;
        accordionToOpen?.click();
        setTimeout(() => {
          parentOfAccordionToOpen?.scrollIntoView({
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
    if (allowScroll) {
      let newAccordionToOpen = document.getElementById(seriesId);
      setTimeout(() => {
        console.log(newAccordionToOpen);
        newAccordionToOpen?.scrollIntoView({
          behavior: "smooth",
          inline: "start",
          block: "start",
        });
      }, 500);
      router.push("/series?opened-series=" + seriesId, undefined, {
        shallow: true,
      });
    } else {
      router.push("/series", undefined, {
        shallow: true,
      });
    }
    setSetsBySeries([...setsBySeries]);
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
          <div className="ms-0 ms-md-4 d-flex justify-content-center justify-content-md-end">
            <h1 className="me-4 mb-0 h4">All Pokemon TCG Expansions</h1>
            <PreloadComponent
              arrayOfSeries={arrayOfSeries}
              totalNumberOfSets={totalNumberOfSets}
            ></PreloadComponent>
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
                      "accordion-button special-accordion py-2-2-5 px-3  " +
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
                    <h2 className="fs-5 fw-bold mb-0">{series.series}</h2>
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
                            prefetch={setIndex < 2 ? undefined : false}
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
    </Fragment>
  );
};
