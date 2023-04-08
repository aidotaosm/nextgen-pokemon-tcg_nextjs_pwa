import { FunctionComponent, useContext, useEffect, useState } from "react";
import { PagingComponent } from "../PagingComponent/PagingComponent";
import {
  DEFAULT_PAGE_SIZE,
  Vercel_DEFAULT_URL,
} from "../../constants/constants";
import { useRouter } from "next/router";
import { CardsObjectProps } from "../../models/GenericModels";

import { IF } from "../UtilityComponents/IF";
import { GridViewComponent } from "../GridViewComponent/GridViewComponent";
import { ListOrGridViewToggle } from "../UtilityComponents/ListOrGridViewToggle";
import { ListViewComponent } from "../ListViewComponent/ListViewComponent";
import { AppContext } from "../../contexts/AppContext";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { logoBlurImage } from "../../../base64Images/base64Images";
import { LocalSearchComponent } from "../LocalSearchComponent/LocalSearchComponent";
import {
  getAllCardsJSONFromFileBaseIPFS,
  getCardsFromNextServer,
} from "../../utils/networkCalls";
import { SidebarFiltersComponent } from "../SidebarFiltersComponent/SidebarFiltersComponent";
import { Form } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "bootstrap/js/dist/tooltip";
import { FilterFieldNames, ValidHPRange } from "../../models/Enums";
import energyTypes from "../../InternalJsons/AllTypes.json";
import superTypes from "../../InternalJsons/AllSuperTypes.json";
import subTypes from "../../InternalJsons/AllSubtypes.json";
import rarities from "../../InternalJsons/AllRarities.json";
import regulationMarks from "../../InternalJsons/AllRegulationMarks.json";
import { SortOptions, SortOrderOptions } from "../../data";
import { Helper } from "../../utils/helper";

export const SetComponent: FunctionComponent<CardsObjectProps> = ({
  cardsObject,
  isSearchPage = false,
}) => {
  const [formInstance] = Form.useForm();
  let router = useRouter();
  const getCardsForServerSide = () => {
    let from = 0 * DEFAULT_PAGE_SIZE;
    let to = (0 + 1) * DEFAULT_PAGE_SIZE;
    let changedSetOfCards: any[] | null = null;
    if (!isSearchPage) {
      changedSetOfCards = cardsObject?.data.slice(from, to);
    };
    return changedSetOfCards;
  }
  const [totalCount, setTotalCount] = useState<number>(
    cardsObject?.totalCount || 0
  );
  const [allCardsFromNetwork, setAllCardsFromNetwork] = useState<any[]>([]);
  const [setCards, setSetCards] = useState<any>(
    getCardsForServerSide()
  );
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const {
    appState,
    updateGridView,
    updateGlobalSearchTerm,
    updateSidebarCollapsed,
  } = useContext(AppContext);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const filterButtonTooltipId = "filterButtonTooltipId";

  const getUpdatedView = (view: boolean) => {
    updateGridView?.(view);
  };

  useEffect(() => {
    const filterCardsOnLoad = (paramAllCardsREsponse?: any[]) => {
      let routerPageIndex = 0;
      const fieldValues = router.query as any;
      const filterNames = Object.keys(fieldValues);
      let correctedFieldValues: any = {};
      filterNames.forEach((fieldName) => {
        if (fieldValues[fieldName]) {
          const fieldValue = fieldValues[fieldName];
          switch (fieldName) {
            case FilterFieldNames.energyType:
              if (fieldValue) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((energy) => {
                  if (energyTypes.includes(energy)) {
                    correctedFieldValues[fieldName].push(energy);
                  }
                });
              }
              break;
            case FilterFieldNames.regulationMarks:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((regulationMark) => {
                  if (regulationMarks.includes(regulationMark)) {
                    correctedFieldValues[fieldName].push(regulationMark);
                  }
                });
              }
              break;
            case FilterFieldNames.subType:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((subType) => {
                  if (subTypes.includes(subType)) {
                    correctedFieldValues[fieldName].push(subType);
                  }
                });
              }
              break;
            case FilterFieldNames.rarity:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((rarity) => {
                  if (rarities.includes(rarity)) {
                    correctedFieldValues[fieldName].push(rarity);
                  }
                });
              }
              break;
            case FilterFieldNames.hpRange:
              if (fieldValue) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((hp) => {
                  if (ValidHPRange.max >= +hp && ValidHPRange.min <= +hp) {
                    correctedFieldValues[fieldName].push(+hp);
                  }
                });
              }
              break;
            case FilterFieldNames.cardType:
              if (fieldValue.length) {
                let TypedFieldValue = fieldValue.split(",") as string[];
                correctedFieldValues[fieldName] = [];
                TypedFieldValue.forEach((cardType) => {
                  if (superTypes.includes(cardType)) {
                    correctedFieldValues[fieldName].push(cardType);
                  }
                });
              }
            case FilterFieldNames.sortLevelOne:
              if (fieldValue) {
                let TypedFieldValue = fieldValue as string;
                correctedFieldValues[fieldName] = '';
                if (Object.keys(SortOptions).includes(TypedFieldValue)) {
                  correctedFieldValues[fieldName] = TypedFieldValue;
                }
              }
              break;
            case FilterFieldNames.sortLevelOneOrder:
              if (fieldValue) {
                let TypedFieldValue = fieldValue as string;
                correctedFieldValues[fieldName] = '';
                if (Object.keys(SortOrderOptions).includes(TypedFieldValue)) {
                  correctedFieldValues[fieldName] = TypedFieldValue;
                }
              }
              break;
          }
        }
      });
      const filterInQueryExists = Object.keys(correctedFieldValues).length;
      if (filterInQueryExists) {
        formInstance.setFieldsValue(correctedFieldValues);
      }
      let tempTotalCount = isSearchPage ? paramAllCardsREsponse?.length : cardsObject.totalCount;
      if (
        router.query.page &&
        !isNaN(+router.query.page) &&
        !isNaN(parseFloat(router.query.page.toString()))
      ) {
        if (
          (+router.query.page + 1) * DEFAULT_PAGE_SIZE >
          tempTotalCount
        ) {
          let lastPage = Math.floor(tempTotalCount / DEFAULT_PAGE_SIZE);
          routerPageIndex = lastPage;
        } else {
          routerPageIndex = +router.query.page;
        }
      }
      let searchTerm = "";
      if (router.query.search && typeof router.query.search === "string") {
        searchTerm = router.query.search;
      }
      if (appState.globalSearchTerm) {
        searchTerm = appState.globalSearchTerm;
      }
      if (routerPageIndex !== pageIndex || searchTerm || filterInQueryExists || isSearchPage) {
        pageChanged(
          routerPageIndex,
          searchTerm,
          correctedFieldValues,
          paramAllCardsREsponse
        );
        setSearchValue(searchTerm);
      }
    };
    if ((cardsObject || isSearchPage) && router.isReady) {
      if (isSearchPage) {
        getAllCardsJSONFromFileBaseIPFS()
          .then((allCardsResponse) => {
            setAllCardsFromNetwork(allCardsResponse);
            filterCardsOnLoad(allCardsResponse);
          })
          .catch((e) => {
            console.log(e, "allCardsResponse error");
          });
      } else {
        filterCardsOnLoad();
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    let bootStrapMasterClass = appState?.bootstrap;
    const filterButtonTrigger = document.getElementById(
      filterButtonTooltipId
    ) as any;
    let filterTooltipInstance: Tooltip;
    if (bootStrapMasterClass && filterButtonTrigger) {
      filterTooltipInstance = new bootStrapMasterClass.Tooltip(
        filterButtonTrigger
      );
    }

    return () => {
      filterTooltipInstance?.dispose();
    };
  }, [appState?.bootstrap]);

  useEffect(() => {
    return () => {
      updateGlobalSearchTerm?.("");
    };
  }, []);

  const handleSearchAndFilter = (
    paramSearchValue: string | undefined,
    initialCards: any[],
    newPageIndex: number,
    instantFilterValues?: any
  ) => {
    let tempSearchValue: string =
      paramSearchValue === "" || paramSearchValue
        ? paramSearchValue
        : searchValue;
    let tempChangedCards: any[] = initialCards.filter((item: any) => {
      return item.name.toLowerCase().includes(tempSearchValue.toLowerCase());
    });
    const fieldValues = instantFilterValues || formInstance.getFieldsValue();
    const filterNames = Object.keys(fieldValues);
    filterNames.forEach((fieldName) => {
      if (fieldValues[fieldName]) {
        const fieldValue = fieldValues[fieldName];
        switch (fieldName) {
          case FilterFieldNames.energyType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.forEach((energy) => {
                tempChangedCards = tempChangedCards.filter((card: any) => {
                  return (
                    card.types && (card.types as string[]).includes(energy)
                  );
                });
              });
            }
            break;
          case FilterFieldNames.regulationMarks:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let regulationMarks: any[] = [];
              TypedFieldValue.forEach((regulationMark) => {
                regulationMarks = [
                  ...regulationMarks,
                  ...tempChangedCards.filter((card: any) => {
                    return (
                      card.regulationMark &&
                      (card.regulationMark === regulationMark)
                    );
                  }),
                ];
              });
              tempChangedCards = regulationMarks.filter(
                (value, index, self) =>
                  self.findIndex((v) => v.id === value.id) === index
              );
            }
            break;
          case FilterFieldNames.subType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let subTypeResult: any[] = [];
              TypedFieldValue.forEach((subtype) => {
                subTypeResult = [
                  ...subTypeResult,
                  ...tempChangedCards.filter((card: any) => {
                    return (
                      card.subtypes &&
                      (card.subtypes as string[]).includes(subtype)
                    );
                  }),
                ];
              });
              tempChangedCards = subTypeResult.filter(
                (value, index, self) =>
                  self.findIndex((v) => v.id === value.id) === index
              );
            }
            break;
          case FilterFieldNames.rarity:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let subTypeResult: any[] = [];
              TypedFieldValue.forEach((rarity) => {
                subTypeResult = [
                  ...subTypeResult,
                  ...tempChangedCards.filter((card: any) => {
                    return card.rarity === rarity;
                  }),
                ];
              });
              tempChangedCards = subTypeResult.filter(
                (value, index, self) =>
                  self.findIndex((v) => v.id === value.id) === index
              );
            }
            break;
          case FilterFieldNames.hpRange:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as number[];
              tempChangedCards = tempChangedCards.filter((card: any) => {
                return (
                  (card.hp && (+card.hp as number) >= TypedFieldValue[0] && (+card.hp as number) <= TypedFieldValue[1]) || (card.supertype !== superTypes[1])
                );
              });
            }
            break;
          case FilterFieldNames.cardType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              let cardTypeResult: any[] = [];
              TypedFieldValue.forEach((cardType) => {
                cardTypeResult = [
                  ...cardTypeResult,
                  ...tempChangedCards.filter((card: any) => {
                    return card.supertype === cardType;
                  }),
                ];
              });
              tempChangedCards = cardTypeResult;
            }
            break;
          case FilterFieldNames.sortLevelOne:
            if (fieldValue) {
              let TypedFieldValue = fieldValue as keyof typeof SortOptions;
              if (TypedFieldValue === 'sortByDexNumber') {
                tempChangedCards.sort(
                  (firstColumn, secondColumn) => (firstColumn.nationalPokedexNumbers?.[0] || (tempChangedCards.length - 1)) - (secondColumn.nationalPokedexNumbers?.[0] || (tempChangedCards.length - 1))
                );
              } else if (TypedFieldValue === 'sortByHP') {
                tempChangedCards.sort(
                  (firstColumn, secondColumn) => (+firstColumn.hp || 1000) - (+secondColumn.hp || 1000)
                );
              } else if (TypedFieldValue === 'sortByName') {
                tempChangedCards.sort(
                  (firstColumn, secondColumn) => firstColumn.name.localeCompare(secondColumn.name)
                );
              }
            }
            break;
          case FilterFieldNames.sortLevelOneOrder:
            if (fieldValue) {
              let TypedFieldValue = fieldValue as keyof typeof SortOrderOptions;
              if (TypedFieldValue === 'asc') {
                // tempChangedCards.reverse();
              } else if (TypedFieldValue === 'desc') {
                tempChangedCards.reverse();
              }
            }
            break;
        }
      }
    });
    let from = newPageIndex * DEFAULT_PAGE_SIZE;
    let to = (newPageIndex + 1) * DEFAULT_PAGE_SIZE;
    //cards of the day
    // Helper.saveTemplateAsFile(
    //   "CardsOfTheDay.json",
    //   tempChangedCards.slice(
    //     tempChangedCards.length - 11,
    //     tempChangedCards.length - 1
    //   )
    // );
    // unique cards
    // let listOfCardsWithUniqueNames = Array.from(new Set(tempChangedCards.map((card: any) => card.name)));
    // console.log(listOfCardsWithUniqueNames);
    // Helper.saveTemplateAsFile("AllCardsWithUniqueNames.json", listOfCardsWithUniqueNames);
    setSetCards(tempChangedCards.slice(from, to));
    setTotalCount(tempChangedCards.length);
    setPageIndex(newPageIndex);
    updateRouteWithQuery(newPageIndex, tempSearchValue, instantFilterValues);
    setRefPageNumber(newPageIndex + 1);
  };

  const pageChanged = async (
    newPageIndex: number,
    paramSearchValue?: string,
    instantFilterValues?: any,
    allCardsResponse?: any[]
  ) => {
    if (isSearchPage) {
      setIsLoading(true);
      try {
        // if (!appState.darkMode && navigator.onLine) {
        if (false) {
          let tempSearchValue: string | undefined =
            paramSearchValue === "" || paramSearchValue
              ? paramSearchValue
              : searchValue;
          let cardsParentObject = await getCardsFromNextServer(
            newPageIndex,
            tempSearchValue
          );
          setSetCards(cardsParentObject.data);
          setTotalCount(cardsParentObject.totalCount);
          setPageIndex(newPageIndex);
          updateRouteWithQuery(newPageIndex, tempSearchValue);
          setRefPageNumber(newPageIndex + 1);
          setIsLoading(false);
        } else {
          // import("../../InternalJsons/AllCards.json").then(
          //   (allCardsModule) => {
          //     if (allCardsModule.default) {
          //       try {
          //         let allCardsFromCache = allCardsModule.default as any[];
          //         //YYYY-MM-DD
          //         // const xmlText = Helper.generateSiteMap(allCardsFromCache, Vercel_DEFAULT_URL + 'card/');
          //         // Helper.saveTemplateAsFile(
          //         //   "sitemap.xml",
          //         //   xmlText,
          //         //   false,
          //         //   "text/plain"
          //         // );
          //         handleSearchAndFilter(
          //           paramSearchValue,
          //           allCardsFromCache,
          //           newPageIndex,
          //           instantFilterValues
          //         );
          //         setIsLoading(false);
          //       } catch (e) {
          //         console.log(e);
          //         setIsLoading(false);
          //       }
          //     }
          //   }
          // );
          let allCardsFromCache = allCardsResponse || allCardsFromNetwork;
          handleSearchAndFilter(
            paramSearchValue,
            allCardsFromCache,
            newPageIndex,
            instantFilterValues
          );
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      handleSearchAndFilter(
        paramSearchValue,
        cardsObject.data,
        newPageIndex,
        instantFilterValues
      );
    }
  };

  const updateRouteWithQuery = (
    newPageIndex: number,
    searchValue?: string,
    instantFilterValues?: any
  ) => {
    const fieldValues = instantFilterValues || formInstance.getFieldsValue();
    const filterNames = Object.keys(fieldValues);
    let filterQuery = "";
    filterNames.forEach((fieldName) => {
      if (fieldValues[fieldName]) {
        const fieldValue = fieldValues[fieldName];
        switch (fieldName) {
          case FilterFieldNames.energyType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.regulationMarks:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.subType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.rarity:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.hpRange:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as number[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.cardType:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string[];
              TypedFieldValue.join(",");
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.sortLevelOne:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string;
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
          case FilterFieldNames.sortLevelOneOrder:
            if (fieldValue.length) {
              let TypedFieldValue = fieldValue as string;
              filterQuery += "&" + fieldName + "=" + TypedFieldValue;
            }
            break;
        }
      }
    });

    let updatedQuery =
      (isSearchPage ? "/search" : "/set/" + router.query.setId) +
      (newPageIndex || searchValue || filterQuery
        ? "?" +
        (newPageIndex ? "&page=" + newPageIndex : "") +
        (searchValue ? "&search=" + searchValue : "") +
        filterQuery
        : "");
    const fixedQuery = updatedQuery.replaceAll("?&", "?");
    router.push(fixedQuery, undefined, { shallow: true });
  };

  const setSearchValueFunction = (
    value: string,
    eventType: "onChange" | "submit"
  ) => {
    setSearchValue(value);
    if (
      (!isLoading && isSearchPage && eventType === "submit") ||
      !isSearchPage
    ) {
      pageChanged(0, value);
    }
  };
  const syncPagingReferences = (pageNumber: number) => {
    setRefPageNumber(pageNumber);
  };

  const triggerFilter = () => {
    pageChanged(0);
  };
  const hideAllTollTips = () => {
    let bootStrapMasterClass = appState?.bootstrap;
    if (bootStrapMasterClass) {
      const filterButtonTooltipInstance: Tooltip =
        bootStrapMasterClass.Tooltip.getInstance("#" + filterButtonTooltipId);
      filterButtonTooltipInstance?.hide();
    }
  };
  if (router.isFallback) {
    return (
      <div className="container d-flex flex-grow-1 justify-content-center">
        <h1 className="align-self-center">Set Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="container d-flex flex-column" onClick={hideAllTollTips}>
        <div
          className="d-flex justify-content-center mb-4 align-items-center"
          style={{ height: "5rem", minHeight: "5rem", overflow: "hidden" }}
        >
          <IF condition={isSearchPage}>
            <h1 className="h4">
              Fastest Pokemon card search experience out there!
            </h1>
          </IF>
          {!isSearchPage && <>
            <div
              className={
                "position-relative w-100 " +
                (!appState.offLineMode ? "d-block" : "d-none")
              }
              style={{ height: "5rem" }}
            >
              <ImageComponent
                src={cardsObject.data[0].set?.images?.logo}
                alt={cardsObject.data[0].set.name}
                shouldFill={true}
                blurDataURL={logoBlurImage}
                fallBackType="logo"
                fallbackImage={"/images/International_Pokémon_logo.png"}
              />
            </div>
            <h1
              className={
                "mb-0 ms-3 h4 " +
                (appState.offLineMode ? "d-block" : "d-none")
              }
            >
              {cardsObject.data[0].set.name +
                " set of " +
                cardsObject.data[0].set.series}{" "}
              series
            </h1>
          </>}

        </div>
        <div className="mb-4 row row-cols-2 row-cols-md-3 buttons-wrapper">
          <div className="d-flex align-items-center col col-12 col-md-4 mb-4 mb-md-0">
            <div
              className="sidebar-trigger cursor-pointer"
              data-bs-title={"Show / Hide filters."}
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              data-bs-placement="top"
              id={filterButtonTooltipId}
            >
              <IF condition={!appState.sidebarCollapsed}>
                <FontAwesomeIcon
                  size="2x"
                  icon={faBarsStaggered}
                  onClick={(e) => {
                    updateSidebarCollapsed?.(!appState.sidebarCollapsed);
                  }}
                />
              </IF>
              <IF condition={appState.sidebarCollapsed}>
                <FontAwesomeIcon
                  size="2x"
                  icon={faBars}
                  onClick={(e) => {
                    updateSidebarCollapsed?.(!appState.sidebarCollapsed);
                  }}
                />
              </IF>
            </div>
            <div className=" flex-grow-1 ms-2">
              <LocalSearchComponent
                setSearchValueFunction={setSearchValueFunction}
                defaultSearchTerm={searchValue}
                initialPlaceHolder={
                  isSearchPage ? "Global search e.g. " : "Search in set e.g. "
                }
                disabled={isSearchPage && setCards === null}
                setCards={isSearchPage ? null : cardsObject.data}
              />
            </div>
          </div>
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={totalCount}
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
            isLoading={isLoading}
            disabled={isSearchPage && setCards === null}
          >
            <ListOrGridViewToggle
              isGridView={appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses={
                totalCount > DEFAULT_PAGE_SIZE ? "col-4" : "col-12"
              }
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
        <div
          className={
            "d-flex sidebar-content-wrapper h-100 " +
            (appState.sidebarCollapsed ? "collapsed" : "")
          }
        >
          <div className={"sidebar"}>
            <SidebarFiltersComponent
              formInstance={formInstance}
              triggerFilter={triggerFilter}
            />
          </div>
          <IF condition={appState.gridView}>
            <GridViewComponent setCards={setCards}></GridViewComponent>
          </IF>
          <IF condition={!appState.gridView}>
            <ListViewComponent setCards={setCards}></ListViewComponent>
          </IF>
        </div>
        <div className="mt-4 row row-cols-2 row-cols-md-3">
          <div className="col d-none d-md-block"></div>
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={totalCount}
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
            isLoading={isLoading}
            disabled={isSearchPage && setCards === null}
            bottomScroll={true}
          >
            <ListOrGridViewToggle
              isGridView={appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses={
                totalCount > DEFAULT_PAGE_SIZE ? "col-4" : "col-12"
              }
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
      </div>
    );
  }
};
