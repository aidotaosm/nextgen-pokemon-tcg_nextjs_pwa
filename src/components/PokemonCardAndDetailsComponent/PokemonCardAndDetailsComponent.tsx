import { Fragment, FunctionComponent, useState } from "react";
import { PokemonDetailProps } from "../../models/GenericModels";
import { Helper } from "../../utils/helper";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonDetailComponent } from "../PokemonDetailComponent/PokemonDetailComponent";
import { IF } from "../UtilityComponents/IF";

export const PokemonCardAndDetailsComponent: FunctionComponent<
  PokemonDetailProps
> = ({
  card,
  cardClicked = () => {},
  detailsClasses = "mt-5 mt-md-0 ms-md-5 ps-xl-4 flex-grow-1",
  showHQImage = false,
  showCardOpenToNewTab = true,
}) => {
  return (
    <Fragment>
      <div
        className="pokemon-card-image mt-4 mt-md-0"
        onClick={(e) => {
          // e.stopPropagation();
          cardClicked(card);
        }}
      >
        <div className="special-card-wrapper p-0">
          <div
            className={
              "special-card-border " + (!showHQImage ? "cursor-pointer" : "")
            }
            onContextMenu={(e) => {
              if (!showHQImage) {
                e.preventDefault();
              }
            }}
            data-bs-toggle={!showHQImage ? "modal" : undefined}
            data-bs-target={!showHQImage ? "#list-view-card-modal" : undefined}
          >
            <ImageComponent
              src={card?.images?.small}
              highQualitySrc={showHQImage ? card?.images?.large : null}
              alt={card.name}
              width={245}
              height={342}
              className={"special-card " + (showHQImage ? "" : "disable-save")}
            />
          </div>
        </div>
      </div>
      <PokemonDetailComponent
        card={card}
        classes={detailsClasses}
        showCardOpenToNewTab={showCardOpenToNewTab}
      />
    </Fragment>
  );
};
