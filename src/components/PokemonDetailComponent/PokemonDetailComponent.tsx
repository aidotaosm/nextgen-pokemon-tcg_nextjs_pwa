import { Fragment, FunctionComponent, useState } from "react";
import { SuperTypes } from "../../constants/constants";
import { PokemonDetailProps } from "../../models/GenericModels";
import { Helper } from "../../utils/helper";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { IF } from "../UtilityComponents/IF";

export const PokemonDetailComponent: FunctionComponent<PokemonDetailProps> = ({
  card,
  cardClicked,
  classes = "",
}) => {
  return (
    <div className={classes} style={{ maxWidth: "35rem" }}>
      <div className="name fs-2 bg-secondary p-2 rounded-top text-lightgray">
        {card.name}
      </div>
      <div className="pokemon-header bg-grey fs-4 p-2 text-dark">
        <div className="subtype-hp d-flex justify-content-between align-items-center flex-grow-1">
          <IF condition={card.subtypes}>
            <div className="subtype">
              {card.subtypes?.map((subType: string, subtypesIndex: number) => (
                <span key={subtypesIndex} className="fw-bold">
                  {(subtypesIndex ? " - " : "") +
                    subType +
                    (card.supertype == "Energy" ? " Energy" : "")}
                </span>
              ))}
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
        <div className={"evolution " + (card.evolvesFrom ? "" : "d-none")}>
          Evolves From: {card.evolvesFrom}
        </div>
        <div
          className={
            "pokemon-height-weight fs-6 d-flex justify-content-end mt-1 " +
            (card.supertype === SuperTypes.Pokemon ? "" : "d-none")
          }
        >
          <small>
            <IF condition={card.evolvesTo}>
              <span>
                Evolves To:
                {card.evolvesTo?.map(
                  (evolvesInto: string, evolvesIntoIndex: number) => (
                    <b key={evolvesIntoIndex} className={"ms-1"}>
                      {evolvesInto}
                    </b>
                  )
                )}
              </span>
            </IF>
            <IF condition={card.nationalPokedexNumbers}>
              <span className="ms-2">
                Pokédex No.
                {card.nationalPokedexNumbers?.map(
                  (
                    nationalPokedexNumber: string,
                    nationalPokedexNumberIndex: number
                  ) => (
                    <b
                      key={nationalPokedexNumberIndex}
                      className={
                        "ms-1" +
                        (nationalPokedexNumberIndex !==
                        card.nationalPokedexNumbers.length - 1
                          ? "mr-1"
                          : "")
                      }
                    >
                      {nationalPokedexNumber}
                    </b>
                  )
                )}
              </span>
            </IF>
          </small>
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
                    abilityIndex !== card.abilities.length - 1 ? "my-2" : "mt-2"
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
                      <IF condition={attack.cost?.length}>
                        {attack.cost.map((type: string, costIndex: number) => (
                          <div
                            key={costIndex}
                            title={type == "[-]" ? "Free" : type + " Type"}
                            className={
                              "energy-type me-1 " +
                              (type == "[-]" ? "Free" : type)
                            }
                          ></div>
                        ))}
                      </IF>
                      <IF condition={!attack.cost?.length}>
                        <div
                          title={"Free"}
                          className="energy-type me-1 Free"
                        ></div>
                      </IF>
                    </div>
                    <span className="fs-4 ms-2">{attack.name}</span>
                  </div>
                  <span className="fs-4 ms-2">{attack.damage}</span>
                </div>
                <IF condition={attack.text}></IF>
                <div
                  className={
                    attackIndex !== card.attacks.length - 1
                      ? "mt-1 mb-3"
                      : "mt-1"
                  }
                >
                  {attack.text}
                </div>
              </Fragment>
            ))}
          </div>
        </IF>
      </div>

      <div className="pokemon-footer bg-grey fs-5 p-2 text-dark rounded-bottom">
        <IF condition={card.supertype === SuperTypes.Pokemon}>
          <div className="weakness-resistance-retreat d-flex justify-content-between">
            <div className="weakness">
              Weakness
              <IF condition={card.weaknesses}>
                <div className={"d-flex justify-content-center mt-1"}>
                  {card.weaknesses?.map(
                    (weakness: any, weaknessIndex: number) => (
                      <div
                        className={
                          "d-flex align-items-center " +
                          (weaknessIndex == 0 ? "" : "ms-1")
                        }
                        key={weaknessIndex}
                      >
                        <div
                          title={weakness.type + " Type"}
                          className={"energy-type me-1 " + weakness.type}
                        ></div>{" "}
                        {weakness.value}
                      </div>
                    )
                  )}
                </div>
              </IF>
            </div>
            <div className="resistance">
              Resistance
              <IF condition={card.resistances}>
                <div className={"d-flex justify-content-center mt-1"}>
                  {card.resistances?.map(
                    (resistance: any, resistanceIndex: number) => (
                      <div
                        className={
                          "d-flex align-items-center " +
                          (resistanceIndex == 0 ? "" : "ms-1")
                        }
                        key={resistanceIndex}
                      >
                        <div
                          title={resistance.type + " Type"}
                          className={"energy-type me-1 " + resistance.type}
                        ></div>{" "}
                        {resistance.value}
                      </div>
                    )
                  )}
                </div>
              </IF>
            </div>
            <div className="retreat">
              Retreat Cost
              <IF condition={card.retreatCost}>
                <div className="d-flex justify-content-center mt-1">
                  {card.retreatCost?.map((type: string, costIndex: number) => (
                    <div
                      key={costIndex}
                      title={type + " Type"}
                      className={"energy-type me-1 " + type}
                    ></div>
                  ))}
                </div>
              </IF>
            </div>
          </div>
        </IF>
        <div
          className={
            "set-details fs-6 " +
            (card.supertype === SuperTypes.Pokemon ? "mt-2" : "")
          }
        >
          <div className="d-flex justify-content-between align-items-center flex-grow-1">
            <div className="d-flex align-items-center fw-bold">
              <img
                src={card.set?.images?.symbol}
                alt={card.set?.name}
                width="25"
                height="25"
                className="disable-save set-symbol"
                title={card.set?.name}
              />
              <span className="ms-2">{card.regulationMark}</span>
              <small className=" ms-2">
                {card.number + "/" + card.set?.total}
              </small>
              <small className="ms-2">{card.rarity}</small>
            </div>
            <small className="">
              <i>{"Illus. " + (card.artist || "unknown")}</i>
            </small>
          </div>
          <IF condition={card.flavorText}>
            <small className="mt-2 d-block">
              <i>{card.flavorText}</i>
            </small>
          </IF>
        </div>
      </div>
    </div>
  );
};
