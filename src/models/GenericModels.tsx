export class BasicProps {
  children?: JSX.Element;
  qry?: any;
}
export class CardObjectProps {
  children?: JSX.Element;
  cardsObject?: any;
}

export class SetCardsProps {
  children?: JSX.Element;
  setCards?: any;
}

export class SeriesArrayProps {
  children?: JSX.Element;
  arrayOfSeries?: any[];
}
export interface PokemonDetailProps {
  children?: JSX.Element;
  card?: any;
  classes?: string;
  cardClicked?: (e: any) => void;
}
