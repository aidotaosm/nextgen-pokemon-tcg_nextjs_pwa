import { Fragment, FunctionComponent, useState } from "react";
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
      {setCards?.map((card: any, index: number) => (
        <div
          className={
            "list-view align-items-center d-md-flex pt-5" +
            (!index ? "pt-5" : "")
          }
          key={card.id}
        >
          <div className="pokemon-card-image">
            <div className="special-card-wrapper p-0">
              <div className="special-card-border ">
                <ImageComponent
                  src={card?.images?.small}
                  alt={card.name}
                  width={245}
                  height={342}
                  className="special-card disable-save"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 mt-md-0 ms-md-5 flex-grow-1">
            <div className="pokemon-category" style={{ maxWidth: "35rem" }}>
              <div className="name fs-1 bg-secondary p-2 rounded-top">
                {card.name}
              </div>
              <div className="pokemon-header bg-grey fs-4 p-2 text-dark text-dark">
                <div className="subtype-hp d-flex justify-content-between align-items-center flex-grow-1">
                  <div className="subtype">
                    {card.subtypes.map(
                      (subType: string, subtypesIndex: number) => (
                        <span key={subtypesIndex} className="fw-bold">
                          {(subtypesIndex ? " - " : "") + subType}
                        </span>
                      )
                    )}
                  </div>
                  <div className=" hp-and-type d-flex align-items-center">
                    <div className="mr-2 fw-bold">
                      <span className="fs-5">HP</span>
                      <span className="fs-3 ms-1">{card.hp}</span>
                    </div>
                    {card.types.map((type: string, typeIndex: number) => (
                      <Fragment key={typeIndex}>
                        <div
                          title={type + " Type"}
                          className={"energy-type ms-1 " + type}
                        ></div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div
                  className={"evolution " + (card.evolvesFrom ? "" : "d-none")}
                >
                  Evolves From: {card.evolvesFrom}
                </div>
              </div>
              <div className="pokemon-body">
                <div className="rules"></div>
                <div className="abilities"></div>
                <div className="attacks"></div>
              </div>

              <div className="pokemon-footer">
                <div className="weakness-resistance-retreat"></div>
                <div className="set-details"></div>
              </div>
            </div>
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
