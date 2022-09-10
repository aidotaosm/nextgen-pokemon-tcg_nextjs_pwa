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
            "list-view align-items-center d-md-flex justify-content-center " +
            (index ? "pt-5" : "")
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
          <div
            className="mt-5 mt-md-0 ms-md-5 ps-xl-4 flex-grow-1"
            style={{ maxWidth: "35rem" }}
          >
            <div className="name fs-2 bg-secondary p-2 rounded-top text-lightgray">
              {card.name}
            </div>
            <div className="pokemon-header bg-grey fs-4 p-2 text-dark text-dark">
              <div className="subtype-hp d-flex justify-content-between align-items-center flex-grow-1">
                <IF condition={card.subtypes}>
                  <div className="subtype">
                    {card.subtypes?.map(
                      (subType: string, subtypesIndex: number) => (
                        <span key={subtypesIndex} className="fw-bold">
                          {(subtypesIndex ? " - " : "") +
                            subType +
                            (card.supertype == "Energy" ? " Energy" : "")}
                        </span>
                      )
                    )}
                  </div>
                </IF>
                <IF condition={!card.subtypes}>
                  <span className="fw-bold">{card.supertype}</span>
                </IF>
                <div className=" hp-and-type d-flex align-items-center">
                  <IF condition={card.hp}>
                    <div className="fw-bold">
                      <span className="fs-5">HP</span>
                      <span className="fs-3 ms-1">{card.hp}</span>
                    </div>
                  </IF>

                  {card.types?.map((type: string, typeIndex: number) => (
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
              <IF condition={card.rules}>
                <div className="rules p-3">
                  {card.rules?.map((rule: string, ruleIndex: number) => (
                    <div
                      key={ruleIndex}
                      className={
                        card.rules.length != 1
                          ? ruleIndex !== card.rules.length - 1
                            ? ruleIndex == 0
                              ? ""
                              : "my-2"
                            : "mt-2"
                          : ""
                      }
                    >
                      {
                        <Fragment>
                          <IF condition={rule.split(":").length > 1}>
                            <div className="text-capitalize text-warning">
                              {rule.split(":")[0]}
                            </div>
                            <div>{rule.split(":")[1]}</div>
                          </IF>
                          <IF condition={rule.split(":").length == 1}>
                            <div>{rule}</div>
                          </IF>
                        </Fragment>
                      }
                    </div>
                  ))}
                </div>
              </IF>
              <IF condition={card.abilities}>
                <div className="abilities p-3">
                  {card.abilities?.map((ability: any, abilityIndex: number) => (
                    <div key={abilityIndex}>
                      <span className="text-danger">{ability.type}</span>
                      <span className="fs-4 ms-2">{ability.name}</span>
                      <div
                        className={
                          abilityIndex !== card.abilities.length - 1
                            ? "my-2"
                            : "mt-2"
                        }
                      >
                        {ability.text}
                      </div>
                    </div>
                  ))}
                </div>
              </IF>
              <IF condition={card.attacks}>
                <div className="attacks p-3">
                  {card.attacks?.map((attack: any, attackIndex: number) => (
                    <Fragment key={attackIndex}>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="d-flex">
                            {attack.cost.map(
                              (type: string, costIndex: number) => (
                                <div
                                  key={costIndex}
                                  title={type + " Type"}
                                  className={"energy-type me-1 " + type}
                                ></div>
                              )
                            )}
                          </div>
                          <span className="fs-4 ms-2">{attack.name}</span>
                        </div>
                        <span className="fs-4 ms-2">{attack.damage}</span>
                      </div>
                      <IF condition={attack.text}></IF>
                      <div
                        className={
                          attackIndex !== card.attacks.length - 1
                            ? "mt-2 mb-3"
                            : "mt-2"
                        }
                      >
                        {attack.text}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </IF>
            </div>

            <div className="pokemon-footer">
              <div className="weakness-resistance-retreat"></div>
              <div className="set-details"></div>
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
