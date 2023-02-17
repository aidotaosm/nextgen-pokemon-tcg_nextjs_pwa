import { FunctionComponent, useContext, useEffect, useState } from "react";
import { PagingComponent } from "../PagingComponent/PagingComponent";
import { DEFAULT_PAGE_SIZE } from "../../constants/constants";
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
import { getCardsFromNextServer } from "../../utils/networkCalls";

export const SetComponent: FunctionComponent<CardsObjectProps> = ({
  cardsObject,
  isSearchPage = false,
}) => {
  // console.log(cardsObject);

  let router = useRouter();
  const getCardsForServerSide = () => {
    let from = 0 * DEFAULT_PAGE_SIZE;
    let to = (0 + 1) * DEFAULT_PAGE_SIZE;
    let changedSetOfCards = cardsObject?.data.slice(from, to);
    return changedSetOfCards;
  };
  const [totalCount, setTotalCount] = useState<number>(
    cardsObject?.totalCount || 0
  );
  const [setCards, setSetCards] = useState<any>(getCardsForServerSide() || []);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const { appState, updateGridView } = useContext(AppContext);
  const appContextValues = useContext(AppContext);
  const [searchValue, setSearchValue] = useState("");
  const [newChangedCardObject, setNewChangeCardObject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // const getSetCards = (paramPageIndex: number) => {
  //   setIsLoading(true);
  //   let pokemonSDKVariable = Helper.initializePokemonSDK();
  //   pokemonSDKVariable.card
  //     .where({
  //       q: "set.id:" + router.query.setId,
  //       pageSize: DEFAULT_PAGE_SIZE,
  //       page: paramPageIndex + 1,
  //     })
  //     .then((response: any) => {
  //       console.log(response);
  //       setSetCards(response);
  //       setPageIndex(paramPageIndex);
  //       setIsLoading(false);
  //     });
  // };
  const getUpdatedView = (view: boolean) => {
    updateGridView?.(view);
  };

  useEffect(() => {
    if (cardsObject && router.isReady) {
      let routerPageIndex = 0;
      if (
        router.query.page &&
        !isNaN(+router.query.page) &&
        !isNaN(parseFloat(router.query.page.toString()))
      ) {
        if (
          (+router.query.page + 1) * DEFAULT_PAGE_SIZE >
          cardsObject.totalCount
        ) {
          let lastPage = Math.floor(cardsObject.totalCount / DEFAULT_PAGE_SIZE);
          routerPageIndex = lastPage;
        } else {
          routerPageIndex = +router.query.page;
        }
      }
      let searchTerm = "";
      if (
        router.query.searchTerm &&
        typeof router.query.searchTerm === "string"
      ) {
        searchTerm = router.query.searchTerm;
      }
      if (routerPageIndex !== pageIndex || searchTerm != searchValue) {
        pageChanged(routerPageIndex, false, searchTerm);
      }
    }
  }, [router.isReady]);

  const triggerSearch = (paramSearchValue: string) => {
    let tempChangedCArdsObject: any[] = [];
    if (isSearchPage) {
      pageChanged(0, false, paramSearchValue);
    } else {
      if (paramSearchValue) {
        const data = cardsObject.data.filter((item: any) => {
          return item.name
            .toLowerCase()
            .includes(paramSearchValue.toLowerCase());
        });
        tempChangedCArdsObject = data;
        setNewChangeCardObject(data);
      } else {
        setNewChangeCardObject([]);
      }
      pageChanged(0, false, paramSearchValue, tempChangedCArdsObject, true);
    }
  };

  const pageChanged = async (
    newPageIndex: number,
    updateRoute: boolean = true,
    paramSearchValue?: string,
    paramNewChangedCardObject?: any[],
    instantTrigger: boolean = false
  ) => {
    // if (!isLoading) {
    if (isSearchPage) {
      setIsLoading(true);

      try {
        if (!appState.darkMode && navigator.onLine) {
          let cardsParentObject = await getCardsFromNextServer(
            newPageIndex,
            paramSearchValue || searchValue
          );
          setIsLoading(false);
          setSetCards(cardsParentObject.data);
          setTotalCount(cardsParentObject.totalCount);
          setPageIndex(newPageIndex);
          updateRouteWithQuery(newPageIndex);
          setRefPageNumber(newPageIndex + 1);
        } else {
          import("../../../public/Jsons/AllCards.json").then(
            (allCardsModule) => {
              if (allCardsModule.default) {
                try {
                  let allCardsFromCache = JSON.parse(
                    (allCardsModule.default as any).cards
                  );
                  console.log(allCardsFromCache);
                  let tempChangedCArdsObject = null;
                  if (paramSearchValue || searchValue) {
                    let tempSearchValue = paramSearchValue || searchValue;
                    tempChangedCArdsObject = allCardsFromCache.filter(
                      (item: any) => {
                        return item.name
                          .toLowerCase()
                          .includes(tempSearchValue.toLowerCase());
                      }
                    );
                  }
                  let from = newPageIndex * DEFAULT_PAGE_SIZE;
                  let to = (newPageIndex + 1) * DEFAULT_PAGE_SIZE;
                  if (tempChangedCArdsObject) {
                    let changedSetOfCards = tempChangedCArdsObject.slice(
                      from,
                      to
                    );
                    setSetCards(changedSetOfCards);
                    setTotalCount(tempChangedCArdsObject.length);
                  } else {
                    let changedSetOfCards = allCardsFromCache.slice(from, to);
                    setSetCards(changedSetOfCards);
                    setTotalCount(allCardsFromCache.length);
                  }
                  setPageIndex(newPageIndex);
                  updateRouteWithQuery(newPageIndex);
                  setRefPageNumber(newPageIndex + 1);
                  setIsLoading(false);
                } catch (e) {
                  console.log(e);
                  setIsLoading(false);
                }
              }
            }
          );
        }
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      let from = newPageIndex * DEFAULT_PAGE_SIZE;
      let to = (newPageIndex + 1) * DEFAULT_PAGE_SIZE;
      // let changedSetOfCards = cardsObject.data.slice(from, to);
      let tempSearchValue: string | undefined = searchValue;
      let temNewChangedCardObject: any = newChangedCardObject;
      if (instantTrigger) {
        tempSearchValue = paramSearchValue;
        temNewChangedCardObject = paramNewChangedCardObject;
      }
      if (tempSearchValue) {
        let changedSetOfCards = temNewChangedCardObject.slice(from, to);
        setSetCards(changedSetOfCards);
      } else {
        let changedSetOfCards = cardsObject.data.slice(from, to);
        setSetCards(changedSetOfCards);
      }
      setPageIndex(newPageIndex);
      updateRouteWithQuery(newPageIndex);
      setRefPageNumber(newPageIndex + 1);
    }
  };

  const updateRouteWithQuery = (newPageIndex: number) => {
    if (newPageIndex > 0) {
      router.push(
        (isSearchPage ? "/search" : "/set/" + router.query.setId) +
          "?page=" +
          newPageIndex,
        undefined,
        { shallow: true }
      );
    } else {
      router.push(
        isSearchPage ? "/search" : "/set/" + router.query.setId,
        undefined,
        {
          shallow: true,
        }
      );
    }
  };

  const setSearchValueFunction = (
    value: string,
    eventType: "onChange" | "submit"
  ) => {
    if (!isLoading) {
      if ((isSearchPage && eventType === "submit") || !isSearchPage) {
        triggerSearch(value);
      }
    }
    setSearchValue(value);
  };
  const syncPagingReferences = (pageNumber: number) => {
    setRefPageNumber(pageNumber);
  };
  let numberOfElements =
    searchValue && !isSearchPage ? newChangedCardObject.length : totalCount;
  if (router.isFallback) {
    return (
      <div className="container d-flex flex-grow-1 justify-content-center">
        <h1 className="align-self-center">Set Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="container d-flex flex-column">
        <div className="d-flex justify-content-center mb-4 align-items-center">
          <IF condition={isSearchPage}>
            <h4>Search from all the cards ever printed!</h4>
          </IF>
          <IF condition={!appState.offLineMode && !isSearchPage}>
            <div style={{ width: "8rem" }}>
              <ImageComponent
                src={cardsObject.data[0].set?.images?.logo}
                alt={cardsObject.data[0].set.name}
                height={72}
                width={192}
                blurDataURL={logoBlurImage}
                className="w-100 h-auto"
                fallBackType="logo"
                fallbackImage={"/images/International_Pokémon_logo.svg"}
              />
            </div>
          </IF>
          <IF condition={appState.offLineMode && !isSearchPage}>
            <h4 className="mb-0 ms-3">
              {cardsObject.data[0].set.name +
                " expansion of " +
                cardsObject.data[0].set.series}
            </h4>
          </IF>
        </div>
        <div className="mb-4 row row-cols-2 row-cols-md-3 ">
          <div className="col col-12 col-md-4 d-flex align-items-center mb-4 mb-md-0">
            <LocalSearchComponent
              setSearchValueFunction={setSearchValueFunction}
              defaultSearchTerm={searchValue}
            />
          </div>
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={numberOfElements}
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
            isLoading={isLoading}
          >
            <ListOrGridViewToggle
              isGridView={appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses={
                numberOfElements > DEFAULT_PAGE_SIZE ? "col" : "col-12"
              }
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
        <IF condition={!setCards.length && searchValue}>
          <div className="d-flex justify-content-center flex-grow-1">
            <h2 className="align-self-center">
              No Cards found with {searchValue}
            </h2>
          </div>
        </IF>
        <IF condition={appState.gridView}>
          <GridViewComponent setCards={setCards}></GridViewComponent>
        </IF>
        <IF condition={!appState.gridView}>
          <ListViewComponent setCards={setCards}></ListViewComponent>
        </IF>
        <div className="mt-4 row">
          <div className="col d-none d-md-block"></div>
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={numberOfElements}
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
            isLoading={isLoading}
          >
            <ListOrGridViewToggle
              isGridView={appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses={
                numberOfElements > DEFAULT_PAGE_SIZE ? "col" : "col-12"
              }
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
      </div>
    );
  }
};
