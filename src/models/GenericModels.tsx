export class BasicProps {
  children?: JSX.Element;
  qry?: any;
}
export class CardsObjectProps {
  children?: JSX.Element;
  cardsObject?: any;
}
export class CardObjectProps {
  children?: JSX.Element;
  cardObject?: any;
}

export class SetCardsProps {
  children?: JSX.Element;
  setCards?: any;
}

export interface SeriesArrayProps {
  children?: JSX.Element;
  arrayOfSeries?: any[];
  totalNumberOfSets: number;
}
export interface PokemonDetailProps {
  children?: JSX.Element;
  card?: any;
  classes?: string;
  detailsClasses?: string;
  showHQImage?: boolean;
  showCardOpenToNewTab?: boolean;
  cardClicked?: (e: any) => void;
  imageClasses?: string;
}
export interface CarouselProps {
  children?: JSX.Element;
  classes?: string;
}
export interface ExternalLinkProps {
  card?: any;
  classes?: string;
}
export interface ModalProps {
  primaryClasses?: string;
  children?: JSX.Element;
  secondaryClasses?: string;
  id?: string;
  handleModalClose?: (e: any) => void;
  modalCloseButton?: any;
  hideFooter?: boolean;
  modalTitle?: string;
  hideHeader?: boolean;
  showOkButton?: boolean;
  okButtonText?: string;
  handleOkButtonPress?: (e: any) => void;
}
