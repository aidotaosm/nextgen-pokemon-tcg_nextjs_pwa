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
      <div className="container">
        {/* <div className="d-flex justify-content-end mb-4">
          <h4 className="mb-0">
          </h4>
        </div> */}
        <div className="list-view align-items-center d-md-flex justify-content-center">
          <PokemonCardAndDetailsComponent
            card={cardObject}
            showHQImage={true}
          />
        </div>
      </div>
    );
  }
};
