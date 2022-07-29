import { useEffect, useMemo, useState, useTransition } from "react";
import { Helper } from "../utils/helper";
import "./ExpansionsComponent.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PagingComponent } from "./PagingComponent/PagingComponent";
import { DEFAULT_PAGE_SIZE } from "../constants/constants";

export const SetComponent = () => {
  let params = useParams();
  let navigate = useNavigate();

  const [setCards, setSetCards] = useState<any>({});
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [refPageNumber, setRefPageNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const getSetCards = (paramPageIndex: number) => {
    setIsLoading(true);
    let pokemonSDKVariable = Helper.initializePokemonSDK();
    pokemonSDKVariable.card
      .where({
        q: "set.id:" + params.setId,
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
    console.log(params);
    if (!params.setId) {
      navigate("/dashboard");
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
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
        {setCards.data?.map((card: any) => {
          return (
            <div className="col" key={card.id}>
              <Link to="/series" className="un-styled-anchor">
                <div className="card">
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
              </Link>
            </div>
          );
        })}
      </div>
      asasas
      <PagingComponent
        pageChanged={pageChanged}
        paramPageSize={DEFAULT_PAGE_SIZE}
        paramNumberOfElements={setCards.totalCount}
        paramPageIndex={pageIndex}
        syncPagingReferences={syncPagingReferences}
        pageNumber={refPageNumber}
      ></PagingComponent>
    </div>
  );
};
