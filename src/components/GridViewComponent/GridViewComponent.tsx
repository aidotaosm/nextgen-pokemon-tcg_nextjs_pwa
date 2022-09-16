import bootstrap from "bootstrap";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { SetCardsProps } from "../../models/GenericModels";
import { Helper } from "../../utils/helper";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";
import { IF } from "../UtilityComponents/IF";

export const GridViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>({});
  const modalCloseButton = useRef<any>();
  return (
    <>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
        {setCards?.map((card: any) => {
          return (
            <div className="col mb-4" key={card.id}>
              <div
                className="card cursor-pointer position-static"
                data-bs-toggle="modal"
                data-bs-target="#full-screen-card-modal"
                onClick={(c) => {
                  setSelectedCard(card);
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="card-body">
                  <div className="card-title mb-0 fs-bold fs-5">
                    {card.name}
                  </div>
                </div>
                <div className="special-card-wrapper">
                  <div className="special-card-border">
                    <ImageComponent
                      src={card?.images?.small}
                      alt={card.name}
                      width={245}
                      height={342}
                      className="card-img-top special-card disable-save"
                    />
                  </div>
                </div>
                {/* <div className="card-footer">
                  <small className="text-muted">
                    {card.supertype + Helper.populateSubtype(card)}
                  </small>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="modal fade "
        id="full-screen-card-modal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl vertical-align-modal tall-content">
          <div className="modal-content transparent-modal">
            <div className="modal-body">
              <IF condition={selectedCard?.images}>
                <div
                  className="align-items-center d-md-flex justify-content-center list-view"
                  onClick={() => {
                    if (modalCloseButton.current) {
                      modalCloseButton.current.click();
                    }
                  }}
                >
                  <PokemonCardAndDetailsComponent
                    card={selectedCard}
                    detailsClasses={"mt-5 mt-md-0 ms-md-4 ps-xl-4 flex-grow-1"}
                    showHQImage={true}
                  />
                </div>
              </IF>
            </div>
            <div className="modal-footer p-1 d-none">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
                ref={modalCloseButton}
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
