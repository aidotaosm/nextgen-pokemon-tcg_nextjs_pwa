import { FunctionComponent, useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";
import { CardObjectProps } from "../../models/GenericModels";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";

export const CardComponent: FunctionComponent<CardObjectProps> = ({
  cardObject,
}) => {
  let router = useRouter();
  if (router.isFallback) {
    return (
      <div className="container d-flex h-100 align-items-center justify-content-center">
        <h1>Card Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="container align-self-center negative-margin-min-768">
        <div className="full-screen-view align-items-center d-md-flex justify-content-center">
          <PokemonCardAndDetailsComponent
            card={cardObject}
            showHQImage={true}
            showCardOpenToNewTab={false}
            detailsClasses="mt-5 mt-md-0 ms-md-5 flex-grow-1"
          />
        </div>
      </div>
    );
  }
};
