import { useEffect, useMemo, useState } from "react";
import { Helper } from "../utils/helper";
import "./ExpansionsComponent.css";
import { Link, useParams, useNavigate } from "react-router-dom";

export const SetComponent = () => {
  let params = useParams();
  let navigate = useNavigate();
  const [setCards, setSetCards] = useState<any[]>([]);

  useEffect(() => {
    console.log(params);
    if (!params.setId) {
      navigate("/dashboard");
    } else {
      let pokemonSDKVariable = Helper.initializePokemonSDK();
      if (pokemonSDKVariable) {
        console.log(pokemonSDKVariable);
        pokemonSDKVariable.card
          .where({ q: "set.id:" + params.setId })
          .then((response: any) => {
            console.log(response);
            setSetCards(response.data);
          });
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
    }
  }, []);
  const populateSubtype = (card: any) => {
    let returnVal = "";
    if (card.subtype || card.subtypes) {
      returnVal = " - ";
      if (card.subtype) {
        returnVal += card.subtype;
      } else {
        returnVal += card.subtypes?.join(" - ");
      }
    }
    return returnVal;
  };
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4 ">
        {setCards.map((card) => {
          return (
            <div className="col">
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
                      {card.supertype + populateSubtype(card)}
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
