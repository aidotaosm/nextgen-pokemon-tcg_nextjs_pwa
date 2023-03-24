import {
  Fragment,
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { defaultBlurImage } from "../../../base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { SetCardsProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";
import { CarouselComponent } from "../UtilityComponents/CarouselComponent";
import { IF } from "../UtilityComponents/IF";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";

export const ListViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const { appState } = useContext(AppContext);
  const modalCloseButton = useRef<any>();
  const cardClicked = (card: any) => {
    setSelectedCard(card);
  };

  const handleModalClose = useCallback((e: Event) => {
    let arrayOFCarouselItems = [
      ...(document.getElementsByClassName("carousel-item") as any),
    ];
    arrayOFCarouselItems.forEach((carouselItem) => {
      carouselItem.classList.remove("active");
    });
    setSelectedCard(null);
  }, []);
  const MemoizedCarouselComponent = useMemo(() => {
    return (
      <CarouselComponent>
        {setCards?.map((card: any) => (
          <Fragment key={card.id}>
            <div
              className={
                "carousel-item " + (selectedCard?.id == card.id ? "active" : "")
              }
              onClick={() => {
                if (modalCloseButton.current) {
                  modalCloseButton.current.click();
                }
              }}
            >
              <div
                className="pokemon-card-image"
                style={{ margin: "auto" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ImageComponent
                  src={card?.images?.small}
                  highQualitySrc={selectedCard ? card?.images?.large : ""}
                  alt={card.name}
                  width={734}
                  height={1024}
                  blurDataURL={defaultBlurImage}
                  className="position-relative h-auto w-100"
                />
              </div>
            </div>
          </Fragment>
        ))}
      </CarouselComponent>
    );
  }, [selectedCard]);
  return (
    <Fragment>
      <div className="list-view-wrapper">
        {setCards?.map((card: any, index: number) => (
          <div
            key={card.id}
            className={
              "align-items-center mb-5 " +
              (appState.sidebarCollapsed
                ? "full-screen-view d-md-flex"
                : "d-lg-flex list-view")
            }
          >
            <PokemonCardAndDetailsComponent
              cardClicked={cardClicked}
              card={card}
              detailsClasses={
                appState.sidebarCollapsed
                  ? "mt-5 mt-md-0 ms-md-5 flex-grow-1"
                  : "mt-5 mt-lg-0 ms-lg-5 flex-grow-1"
              }
            />
          </div>
        ))}
      </div>
      <IF condition={!setCards.length}>
        <div className="d-flex justify-content-center flex-grow-1">
          <h2 className="align-self-center mb-0">No cards found.</h2>
        </div>
      </IF>
      <MemoizedModalComponent
        id="list-view-card-modal"
        primaryClasses="modal-xl vertical-align-modal"
        secondaryClasses="transparent-modal"
        handleModalClose={handleModalClose}
        modalCloseButton={modalCloseButton}
      >
        {MemoizedCarouselComponent}
      </MemoizedModalComponent>
    </Fragment>
  );
};
