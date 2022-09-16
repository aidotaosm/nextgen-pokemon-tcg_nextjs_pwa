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
}) => {
  return (
    <Fragment>
      <div
        className="pokemon-card-image mt-4 mt-md-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="special-card-wrapper p-0">
          <div
            className="special-card-border "
            onContextMenu={(e) => e.preventDefault()}
          >
            <ImageComponent
              src={card?.images?.small}
              highQualitySrc={showHQImage ? card?.images?.large : null}
              alt={card.name}
              width={245}
              height={342}
              className="special-card disable-save"
            />
          </div>
        </div>
      </div>
      <PokemonDetailComponent
        card={card}
        cardClicked={cardClicked}
        classes={detailsClasses}
      />
    </Fragment>
  );
};
