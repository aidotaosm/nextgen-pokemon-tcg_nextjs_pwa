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
  const [setCards, setSetCards] = useState<any>(getCardsForServerSide() || []);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const { appState, updateGridView } = useContext(AppContext);
  const appContextValues = useContext(AppContext);
  const [searchValue, setSearchValue] = useState("");
  const [newChangedCardObject, setNewChangeCardObject] = useState([]);

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
      if (
        router.query.searchTerm &&
        typeof router.query.searchTerm === "string"
      ) {
        setSearchValueFunction(router.query.searchTerm, "onChange");
      }
      let routerPageIndex = 0;
      if (
        router.query.page &&
        !isNaN(+router.query.page) &&
        !isNaN(parseFloat(router.query.page.toString()))
      ) {
        // if (isSearchPage) {
        //   if (
        //     (+router.query.page + 1) * DEFAULT_PAGE_SIZE >
        //     cardsObject.data.length
        //   ) {
        //     let lastPage = Math.floor(
        //       cardsObject.data.length / DEFAULT_PAGE_SIZE
        //     );
        //     routerPageIndex = lastPage;
        //   } else {
        //     routerPageIndex = +router.query.page;
        //   }
        // } else {
        //   if (
        //     (+router.query.page + 1) * DEFAULT_PAGE_SIZE >
        //     cardsObject.totalCount
        //   ) {
        //     let lastPage = Math.floor(
        //       cardsObject.totalCount / DEFAULT_PAGE_SIZE
        //     );
        //     routerPageIndex = lastPage;
        //   } else {
        //     routerPageIndex = +router.query.page;
        //   }
        // }
        if (
          (+router.query.page + 1) * DEFAULT_PAGE_SIZE >
          cardsObject.data.length
        ) {
          let lastPage = Math.floor(
            cardsObject.data.length / DEFAULT_PAGE_SIZE
          );
          routerPageIndex = lastPage;
        } else {
          routerPageIndex = +router.query.page;
        }
      }
      if (routerPageIndex !== pageIndex) {
        pageChanged(routerPageIndex, false);
      }
    }
  }, [router.isReady]);

  const triggerSearch = (paramSearchValue: string) => {
    let tempChangedCArdsObject = [];
    if (paramSearchValue) {
      const data = cardsObject.data.filter((item: any) => {
        return item.name.toLowerCase().includes(paramSearchValue.toLowerCase());
      });
      console.log(data);
      tempChangedCArdsObject = data;
      setNewChangeCardObject(data);
    } else {
      setNewChangeCardObject([]);
    }
    pageChanged(0, false, paramSearchValue, tempChangedCArdsObject, true);
  };

  const pageChanged = (
    newPageIndex: number,
    updateRoute: boolean = true,
    paramSearchValue?: string,
    paramNewChangedCardObject?: [],
    instantTrigger: boolean = false
  ) => {
    // if (!isLoading) {
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
    if (updateRoute) {
      updateRouteWithQuery(newPageIndex);
    } else {
      setRefPageNumber(newPageIndex + 1);
    }
    //getSetCards(newPageIndex);
    //}
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
    triggerSearch(value);
    setSearchValue(value);
  };
  const syncPagingReferences = (pageNumber: number) => {
    setRefPageNumber(pageNumber);
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
        <div className="mb-4 row">
          <div className="col d-flex align-items-center">
            <LocalSearchComponent
              setSearchValueFunction={setSearchValueFunction}
              defaultSearchTerm={searchValue}
            />
          </div>
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={
              searchValue
                ? newChangedCardObject.length
                : cardsObject?.data.length
            }
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
            showToggleButton={true}
          >
            <ListOrGridViewToggle
              isGridView={appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses="col-1"
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
          <div className="col"></div>
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={
              searchValue
                ? newChangedCardObject.length
                : cardsObject?.data.length
            }
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
            showToggleButton={true}
          >
            <ListOrGridViewToggle
              isGridView={appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses="col-1"
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
      </div>
    );
  }
};
