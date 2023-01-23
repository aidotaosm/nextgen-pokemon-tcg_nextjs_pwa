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
import { defaultBlurImage } from "../../../public/base64Images/base64Images";

export const SetComponent: FunctionComponent<CardsObjectProps> = ({
  cardsObject,
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
  const appContextValues = useContext(AppContext);

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
    appContextValues?.updateGridView(view);
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
      if (routerPageIndex !== pageIndex) {
        pageChanged(routerPageIndex, false);
      }
    }
  }, [router.isReady]);

  const pageChanged = (newPageIndex: number, updateRoute: boolean = true) => {
    // if (!isLoading) {
    let from = newPageIndex * DEFAULT_PAGE_SIZE;
    let to = (newPageIndex + 1) * DEFAULT_PAGE_SIZE;
    let changedSetOfCards = cardsObject.data.slice(from, to);
    setSetCards(changedSetOfCards);
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
        "/set/" + router.query.setId + "?page=" + newPageIndex,
        undefined,
        { shallow: true }
      );
    } else {
      router.push("/set/" + router.query.setId, undefined, { shallow: true });
    }
  };

  const syncPagingReferences = (pageNumber: number) => {
    setRefPageNumber(pageNumber);
  };
  if (router.isFallback) {
    return (
      <div className="container d-flex h-100 align-items-center justify-content-center">
        <h1>Set Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="d-flex justify-content-center mb-4 align-items-center">
          <div style={{ width: "8rem" }}>
            <ImageComponent
              src={cardsObject.data[0].set?.images?.logo}
              alt={cardsObject.data[0].set.name}
              height={72}
              width={192}
              blurDataURL={defaultBlurImage}
              className="w-100 h-auto"
            />
          </div>
          {/* 
          <h4 className="mb-0 ms-3">
            {cardsObject.data[0].set.name +
              " expansion of " +
              cardsObject.data[0].set.series}
          </h4> */}
        </div>
        <div className="mb-4">
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={cardsObject?.totalCount}
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
          >
            <ListOrGridViewToggle
              isGridView={appContextValues?.appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses="col-1"
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
        <IF condition={appContextValues?.appState.gridView}>
          <GridViewComponent setCards={setCards}></GridViewComponent>
        </IF>
        <IF condition={!appContextValues?.appState.gridView}>
          <ListViewComponent setCards={setCards}></ListViewComponent>
        </IF>
        <div className="mt-4">
          <PagingComponent
            pageChanged={pageChanged}
            paramPageSize={DEFAULT_PAGE_SIZE}
            paramNumberOfElements={cardsObject?.totalCount}
            paramPageIndex={pageIndex}
            syncPagingReferences={syncPagingReferences}
            pageNumber={refPageNumber}
          >
            <ListOrGridViewToggle
              isGridView={appContextValues?.appState.gridView}
              getUpdatedView={getUpdatedView}
              additionalClasses="col-1"
            ></ListOrGridViewToggle>
          </PagingComponent>
        </div>
      </div>
    );
  }
};
