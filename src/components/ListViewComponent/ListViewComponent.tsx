import { Fragment, FunctionComponent, useState } from "react";
import { SetCardsProps } from "../../models/GenericModels";
import { Helper } from "../../utils/helper";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";
import { PokemonDetailComponent } from "../PokemonDetailComponent/PokemonDetailComponent";
import { IF } from "../UtilityComponents/IF";

export const ListViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>({});
  const cardClicked = (card: any) => {
    console.log(card);
    setSelectedCard(card);
  };
  return (
    <>
      {setCards?.map((card: any, index: number) => (
        <Fragment key={card.id}>
          <div
            className={
              "list-view align-items-center d-md-flex justify-content-center " +
              (index == 0
                ? "pb-3"
                : index == setCards.length - 1
                ? "pt-3"
                : "py-3")
            }
          >
            <PokemonCardAndDetailsComponent
              cardClicked={cardClicked}
              card={card}
            />
          </div>
          <IF condition={index != setCards.length - 1}>
            <hr />
          </IF>
        </Fragment>
      ))}
      modal close with ref and stop propagate and multiple active fix
      <div
        className="modal fade"
        id="list-view-card-modal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl vertical-align-modal">
          <div className="modal-content transparent-modal">
            {/* <div className="modal-header">
              <h5 className="modal-title">{selectedCard?.name}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div className="modal-body">
              <div
                id="carouselExampleControls"
                className="carousel slide"
                data-bs-ride="false"
                data-bs-interval="false"
              >
                <div className="carousel-inner">
                  {setCards?.map((card: any) => (
                    <Fragment key={card.id}>
                      <div
                        className={
                          "carousel-item " +
                          (selectedCard.id == card.id ? "active" : "")
                        }
                      >
                        <div
                          className="pokemon-card-image"
                          style={{ margin: "auto" }}
                        >
                          <ImageComponent
                            src={card?.images?.small}
                            highQualitySrc={card?.images?.large}
                            alt={card.name}
                            width={734}
                            height={1024}
                          />
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
