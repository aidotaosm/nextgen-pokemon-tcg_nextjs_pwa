import { FunctionComponent, useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";
import { CardObjectProps } from "../../models/GenericModels";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { logoBlurImage } from "../../../base64Images/base64Images";
import Link from "next/link";

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
      <div className="container d-flex justify-content-center flex-column">
        <div
          className="d-flex justify-content-center align-items-center mb-4 mb-md-5 position-relative w-100"
          style={{ height: "6rem", overflow: "hidden" }}
        >
          <Link
            href={"/set/" + cardObject.set.id}
            //prefetch={typeof window === "undefined" ? false : navigator.onLine}
          >
            <ImageComponent
              src={cardObject.set?.images?.logo}
              alt={cardObject.set.name}
              shouldFill={true}
              blurDataURL={logoBlurImage}
              fallBackType="logo"
              fallbackImage={"/images/International_Pokémon_logo.png"}
            />
          </Link>
        </div>
        <h2 className="mb-4 mb-md-5 h4 text-center w-100">
          <Link
            href={"/set/" + cardObject.set.id}
            //prefetch={typeof window === "undefined" ? false : navigator.onLine}
          >
            {cardObject.set.name}
          </Link>
          {" set of "}
          {cardObject.set.series}
          {" series"}
        </h2>
        <div className="full-screen-view align-items-center d-md-flex justify-content-center w-100">
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
