import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SetCardsProps } from "../../models/GenericModels";
import { Helper } from "../../utils/helper";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";
import { PokemonDetailComponent } from "../PokemonDetailComponent/PokemonDetailComponent";
import { CarouselComponent } from "../UtilityComponents/CarouselComponent";
import { IF } from "../UtilityComponents/IF";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";

export const ListViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [lala, setlala] = useState<any>(0);
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

  return (
    <>
      {setCards?.map((card: any, index: number) => (
        <Fragment key={card.id}>
          <div
            className={
              "list-view align-items-center d-md-flex justify-content-center " +
              (index == 0
                ? "pb-3"
                : index == setCards.length - 1
                ? "pt-3"
                : "py-3")
            }
          >
            <PokemonCardAndDetailsComponent
              cardClicked={cardClicked}
              card={card}
            />
          </div>
          <IF condition={index != setCards.length - 1}>
            <hr onClick={() => setlala(lala + 1)} />
          </IF>
        </Fragment>
      ))}
      <MemoizedModalComponent
        id="list-view-card-modal"
        primaryClasses="modal-xl vertical-align-modal"
        secondaryClasses="transparent-modal"
        handleModalClose={handleModalClose}
        modalCloseButton={modalCloseButton}
      >
        <CarouselComponent>
          {setCards?.map((card: any) => (
            <Fragment key={card.id}>
              <div
                className={
                  "carousel-item " +
                  (selectedCard?.id == card.id ? "active" : "")
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
                    highQualitySrc={card?.images?.large}
                    alt={card.name}
                    width={734}
                    height={1024}
                  />
                </div>
              </div>
            </Fragment>
          ))}
        </CarouselComponent>
      </MemoizedModalComponent>
    </>
  );
};
