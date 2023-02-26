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
import { SidebarFiltersComponent } from "../SidebarFiltersComponent/SidebarFiltersComponent";
import { Form } from "antd";

export const SetComponent: FunctionComponent<CardsObjectProps> = ({
  cardsObject,
  isSearchPage = false,
}) => {
  const [formInstance] = Form.useForm();
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
  const { appState, updateGridView, updateGlobalSearchTerm } =
    useContext(AppContext);
  const [searchValue, setSearchValue] = useState("");
  const [newChangedCardObject, setNewChangeCardObject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      if (router.query.search && typeof router.query.search === "string") {
        searchTerm = router.query.search;
      }
      if (appState.globalSearchTerm) {
        searchTerm = appState.globalSearchTerm;
      }
      if (routerPageIndex !== pageIndex || searchTerm) {
        pageChanged(routerPageIndex, searchTerm);
        setSearchValue(searchTerm);
      }
    }
  }, [router.isReady]);
  useEffect(() => {
    return () => {
      updateGlobalSearchTerm?.("");
    };
  }, []);

  const pageChanged = async (
    newPageIndex: number,
    paramSearchValue?: string
  ) => {
    if (isSearchPage) {
      setIsLoading(true);
      try {
        // if (!appState.darkMode && navigator.onLine) {
        if (false) {
          let cardsParentObject = await getCardsFromNextServer(
            newPageIndex,
            paramSearchValue === "" || paramSearchValue
              ? paramSearchValue
              : searchValue
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
                  let allCardsFromCache = allCardsModule.default as any[];
                  let tempChangedCArdsObject = null;
                  let tempSearchValue =
                    paramSearchValue === "" || paramSearchValue
                      ? paramSearchValue
                      : searchValue;
                  if (tempSearchValue) {
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
                  updateRouteWithQuery(newPageIndex, tempSearchValue);
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
      let tempSearchValue: string =
        paramSearchValue === "" || paramSearchValue
          ? paramSearchValue
          : searchValue;
      let temNewChangedCardObject: any[] = newChangedCardObject;
      if (tempSearchValue) {
        const data = cardsObject.data.filter((item: any) => {
          return item.name
            .toLowerCase()
            .includes(tempSearchValue.toLowerCase());
        });
        temNewChangedCardObject = data;
        setNewChangeCardObject(data);
      } else {
        setNewChangeCardObject([]);
      }
      if (tempSearchValue) {
        setSetCards(temNewChangedCardObject.slice(from, to));
      } else {
        setSetCards(cardsObject.data.slice(from, to));
      }
      setPageIndex(newPageIndex);
      updateRouteWithQuery(newPageIndex, tempSearchValue);
      setRefPageNumber(newPageIndex + 1);
    }
  };

  const updateRouteWithQuery = (newPageIndex: number, searchValue?: string) => {
    router.push(
      (isSearchPage ? "/search" : "/set/" + router.query.setId) +
        (newPageIndex || searchValue ? "?" : "") +
        (newPageIndex ? "page=" + newPageIndex : "") +
        (newPageIndex && searchValue ? "&" : "") +
        (searchValue ? "search=" + searchValue : ""),
      undefined,
      { shallow: true }
    );
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
  let numberOfElements =
    searchValue && !isSearchPage ? newChangedCardObject.length : totalCount;
  const triggerFilter = () => {
    pageChanged(0);
    console.log(formInstance.getFieldsValue());
  };
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
                fallbackImage={"/images/International_Pokémon_logo.png"}
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
                numberOfElements > DEFAULT_PAGE_SIZE ? "col-4" : "col-12"
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
        <div className="d-flex">
          <SidebarFiltersComponent
            formInstance={formInstance}
            triggerFilter={triggerFilter}
          />
          <IF condition={appState.gridView}>
            <GridViewComponent setCards={setCards}></GridViewComponent>
          </IF>
          <IF condition={!appState.gridView}>
            <ListViewComponent setCards={setCards}></ListViewComponent>
          </IF>
        </div>
        <div className="mt-4 row row-cols-2 row-cols-md-3 ">
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
                numberOfElements > DEFAULT_PAGE_SIZE ? "col-4" : "col-12"
              }
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
      </div>
    );
  }
};
