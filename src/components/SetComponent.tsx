import {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Helper } from "../utils/helper";
import { PagingComponent } from "./PagingComponent/PagingComponent";
import { DEFAULT_PAGE_SIZE } from "../constants/constants";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { BasicProps } from "../models/GenericModels";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const qry = context.query;
  return { props: { qry } };
};

export const SetComponent: FunctionComponent<BasicProps> = ({ qry }) => {
  let router = useRouter();

  const [setCards, setSetCards] = useState<any>({});
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>({});
  const getSetCards = (paramPageIndex: number) => {
    setIsLoading(true);
    let pokemonSDKVariable = Helper.initializePokemonSDK();
    pokemonSDKVariable.card
      .where({
        q: "set.id:" + qry.setId,
        pageSize: DEFAULT_PAGE_SIZE,
        page: paramPageIndex + 1,
      })
      .then((response: any) => {
        console.log(response);
        setSetCards(response);
        setPageIndex(paramPageIndex);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    console.log(qry);
    if (!qry.setId) {
      router.push("/");
    } else {
      getSetCards(pageIndex);
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
    }
  }, []);

  const pageChanged = (newPageIndex: number) => {
    console.log(newPageIndex);
    if (!isLoading) {
      getSetCards(newPageIndex);
    }
  };
  const syncPagingReferences = (pageNumber: number) => {
    setRefPageNumber(pageNumber);
  };
  return (
    <div className="container">
      <PagingComponent
        pageChanged={pageChanged}
        paramPageSize={DEFAULT_PAGE_SIZE}
        paramNumberOfElements={setCards.totalCount}
        paramPageIndex={pageIndex}
        syncPagingReferences={syncPagingReferences}
        pageNumber={refPageNumber}
      ></PagingComponent>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 my-3">
        {setCards.data?.map((card: any) => {
          return (
            <div className="col mb-2" key={card.id}>
              <div
                className="card cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target="#full-screen-card-modal"
                onClick={(c) => {
                  setSelectedCard(card);
                }}
              >
                <div className="card-body">
                  <h5 className="card-title mb-0">{card.name}</h5>
                </div>
                <img
                  src={card?.images?.small}
                  className="card-img-top"
                  alt="..."
                  // style={{ maxHeight: "3rem" }}
                />
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
        paramNumberOfElements={setCards.totalCount}
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
        <div className="modal-dialog modal-xl">
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
            <div className="modal-body d-flex justify-content-center">
              <img
                style={{ height: "75vh" }}
                src={selectedCard?.images?.large}
                alt="..."
              />
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
};
