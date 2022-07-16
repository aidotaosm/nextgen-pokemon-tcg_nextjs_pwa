import { useEffect } from "react";

export const ExpansionsComponent = (pokemonSDKVariable: any) => {
  useEffect(() => {
    if (pokemonSDKVariable) {
      console.log(pokemonSDKVariable);
      pokemonSDKVariable.pokemon.set
        .all({ q: "series:base" })
        .then((cards: any[]) => {
          console.log(cards); // "Base"
        });
    }
  }, [pokemonSDKVariable]);

  return <div className=""></div>;
};
