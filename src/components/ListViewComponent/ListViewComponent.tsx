import {
  Fragment,
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { defaultBlurImage } from "../../../base64Images/base64Images";
import { SetCardsProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";
import { CarouselComponent } from "../UtilityComponents/CarouselComponent";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";

export const ListViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const modalCloseButton = useRef<any>();
  const cardClicked = (card: any) => {
    console.log(card);
    setSelectedCard(card);
  };

  const handleModalClose = useCallback((e: Event) => {
    let arrayOFCarouselItems = [
      ...(document.getElementsByClassName("carousel-item") as any),
    ];
    arrayOFCarouselItems.forEach((carouselItem) => {
      carouselItem.classList.remove("active");
    });
    console.log(arrayOFCarouselItems);
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
                console.log(modalCloseButton);
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
              "list-view align-items-center d-md-flex justify-content-center mb-5"
            }
          >
            <PokemonCardAndDetailsComponent
              cardClicked={cardClicked}
              card={card}
            />
          </div>
        ))}
      </div>
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
