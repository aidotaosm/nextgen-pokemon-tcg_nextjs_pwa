import { FunctionComponent, useState } from "react";
import { SetCardsProps } from "../../models/GenericModels";
import { Helper } from "../../utils/helper";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { IF } from "../UtilityComponents/IF";

export const GridViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>({});
  return (
    <>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 my-4">
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
                onContextMenu={(e) => e.preventDefault()}
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
                      className="card-img-top special-card disable-save"
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
    </>
  );
};
