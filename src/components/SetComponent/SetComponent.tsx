import { FunctionComponent, useEffect, useState } from "react";
import { Helper } from "../../utils/helper";
import { PagingComponent } from "../PagingComponent/PagingComponent";
import { DEFAULT_PAGE_SIZE } from "../../constants/constants";
import { useRouter } from "next/router";
import { CardObjectProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { IF } from "../UtilityComponents/IF";

export const SetComponent: FunctionComponent<CardObjectProps> = ({
  cardsObject,
}) => {
  // console.log(cardsObject);
  let router = useRouter();

  const [setCards, setSetCards] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>({});
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

  useEffect(() => {
    // console.log(cardsObject);
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
    console.log(from, to, changedSetOfCards);
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
        <h1>New Set Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="d-flex justify-content-end">
          <h4 className=" pb-2">
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
        ></PagingComponent>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 my-3">
          {setCards?.map((card: any) => {
            return (
              <div className="col mb-2" key={card.id}>
                <div
                  className="card cursor-pointer position-static"
                  data-bs-toggle="modal"
                  data-bs-target="#full-screen-card-modal"
                  onClick={(c) => {
                    setSelectedCard(card);
                  }}
                >
                  <div className="card-body">
                    <h6 className="card-title mb-0">{card.name}</h6>
                  </div>
                  <div className="special-card-wrapper">
                    <div className="special-card-border">
                      <ImageComponent
                        src={card?.images?.small}
                        alt={card.name}
                        width={245}
                        height={342}
                        className="card-img-top special-card"
                        style={{ zIndex: 3 }}
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <small className="text-muted">
                      {card.supertype + Helper.populateSubtype(card)}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <PagingComponent
          pageChanged={pageChanged}
          paramPageSize={DEFAULT_PAGE_SIZE}
          paramNumberOfElements={cardsObject?.totalCount}
          paramPageIndex={pageIndex}
          syncPagingReferences={syncPagingReferences}
          pageNumber={refPageNumber}
        ></PagingComponent>

        <div
          className="modal fade"
          id="full-screen-card-modal"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCard?.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <IF condition={selectedCard?.images}>
                  <ImageComponent
                    src={selectedCard?.images?.small}
                    highQualitySrc={selectedCard?.images?.large}
                    alt={selectedCard.name}
                    width={734}
                    height={1024}
                    //layout="fill"
                  />
                </IF>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                {/* <button type="button" className="btn btn-primary">
                  Save changes
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
