import { FunctionComponent, useState } from "react";
import { SetCardsProps } from "../../models/GenericModels";
import { Helper } from "../../utils/helper";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { IF } from "../UtilityComponents/IF";

export const ListViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>({});
  return (
    <>
      {setCards?.map((card: any) => (
        <div className="d-flex">
          <div className="flex-grow-1">
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
          </div>
          <div className="flex-grow-1 ms-3">
            This is some content from a media component. You can replace this
            with any content and adjust it as needed.
          </div>
        </div>
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
