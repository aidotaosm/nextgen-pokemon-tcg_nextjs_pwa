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
  detailsClasses?: string;
  showHQImage?: boolean;
  cardClicked?: (e: any) => void;
}
export interface CarouselProps {
  children?: JSX.Element;
  classes?: string;
}
export interface ModalProps {
  primaryClasses?: string;
  children?: JSX.Element;
  secondaryClasses?: string;
  id?: string;
  handleModalClose: (e: any) => void;
  modalCloseButton?: any;
}
