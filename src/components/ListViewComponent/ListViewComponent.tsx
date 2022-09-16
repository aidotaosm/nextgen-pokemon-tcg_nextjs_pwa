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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
