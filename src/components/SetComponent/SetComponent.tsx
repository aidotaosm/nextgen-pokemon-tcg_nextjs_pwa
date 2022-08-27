import { FunctionComponent, useEffect, useState } from "react";
import { Helper } from "../../utils/helper";
import { PagingComponent } from "../PagingComponent/PagingComponent";
import { DEFAULT_PAGE_SIZE } from "../../constants/constants";
import { useRouter } from "next/router";
import { CardObjectProps } from "../../models/GenericModels";

import { IF } from "../UtilityComponents/IF";
import { GridViewComponent } from "../GridViewComponent/GridViewComponent";
import { ListOrGridView } from "../UtilityComponents/ListOrGridView";

export const SetComponent: FunctionComponent<CardObjectProps> = ({
  cardsObject,
}) => {
  // console.log(cardsObject);
  let router = useRouter();

  const [setCards, setSetCards] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGridView, setIsGridView] = useState<boolean>(true);

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
    setIsGridView(view);
  };
  useEffect(() => {
    console.log(cardsObject);
    if (cardsObject) {
      if (router.isReady) {
        console.log(router);
        let routerPageIndex = 0;
        console.log(router?.query?.page);
        if (
          router.query.page &&
          !isNaN(+router.query.page) &&
          !isNaN(parseFloat(router.query.page.toString()))
        ) {
          if (
            (+router.query.page + 1) * DEFAULT_PAGE_SIZE >
            cardsObject.totalCount
          ) {
            let lastPage = Math.floor(
              cardsObject.totalCount / DEFAULT_PAGE_SIZE
            );
            routerPageIndex = lastPage;
          } else {
            routerPageIndex = +router.query.page;
          }
        }
        pageChanged(routerPageIndex, false);
      } else {
        //serverSide
        pageChanged(0, false);
      }
    }
  }, [router.isReady]);

  const pageChanged = (newPageIndex: number, updateRoute: boolean = true) => {
    console.log(newPageIndex);
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
        <div className="d-flex justify-content-end">
          <h4 className=" mb-4">
            {cardsObject.data[0].set.name +
              " expansion of " +
              cardsObject.data[0].set.series}
          </h4>
        </div>
        <PagingComponent
          pageChanged={pageChanged}
          paramPageSize={DEFAULT_PAGE_SIZE}
          paramNumberOfElements={cardsObject?.totalCount}
          paramPageIndex={pageIndex}
          syncPagingReferences={syncPagingReferences}
          pageNumber={refPageNumber}
        >
          <ListOrGridView
            isGridView={isGridView}
            getUpdatedView={getUpdatedView}
          ></ListOrGridView>
        </PagingComponent>
        <GridViewComponent setCards={setCards}></GridViewComponent>
        <PagingComponent
          pageChanged={pageChanged}
          paramPageSize={DEFAULT_PAGE_SIZE}
          paramNumberOfElements={cardsObject?.totalCount}
          paramPageIndex={pageIndex}
          syncPagingReferences={syncPagingReferences}
          pageNumber={refPageNumber}
        ></PagingComponent>
      </div>
    );
  }
};
