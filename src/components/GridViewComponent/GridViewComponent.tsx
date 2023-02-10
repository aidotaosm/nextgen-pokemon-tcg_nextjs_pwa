import {
  FunctionComponent,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { SetCardsProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { PokemonCardAndDetailsComponent } from "../PokemonCardAndDetailsComponent/PokemonCardAndDetailsComponent";
import { IF } from "../UtilityComponents/IF";
import MemoizedModalComponent from "../UtilityComponents/ModalComponent";
import { ExternalLinkComponent } from "../ExternalLinkComponent/ExternalLinkComponent";
import { Helper } from "../../utils/helper";
import { AppContext } from "../../contexts/AppContext";

export const GridViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>({});
  const modalCloseButton = useRef<any>();
  const { appState } = useContext(AppContext);
  const handleModalClose = useCallback((e: Event) => {
    console.log("custom modal close called");
    setSelectedCard(null);
  }, []);
  return (
    <>
      <div
        className={
          !appState.offLineMode
            ? "g-4 row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5"
            : "g-4 row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4"
        }
      >
        {setCards?.map((card: any) => {
          return (
            <div className="col d-flex" key={card.id}>
              <IF condition={!appState.offLineMode}>
                <div className="card position-static flex-grow-1">
                  <div className="card-body">
                    <div className="card-title mb-0 d-flex align-items-center justify-content-between">
                      <span className="fs-5 fs-bold">{card.name}</span>
                      <ExternalLinkComponent
                        card={card}
                        classes="fs-6 "
                        toolTipId={card.id + "tool-tip"}
                      />
                    </div>
                  </div>

                  <div className="special-card-wrapper">
                    <div
                      className="special-card-border cursor-pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#full-screen-card-modal"
                      onClick={() => {
                        setSelectedCard(card);
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <ImageComponent
                        src={card?.images?.small}
                        alt={card.name}
                        width={245}
                        height={342}
                        className="position-relative card-img-top special-card disable-save h-auto w-100"
                      />
                    </div>
                  </div>

                  <div className="card-footer">
                    <small className="text-muted">
                      {card.supertype + Helper.populateSubtype(card)}
                    </small>
                  </div>
                </div>
              </IF>
              <IF condition={appState.offLineMode}>
                <PokemonCardAndDetailsComponent
                  card={card}
                  detailsClasses={"d-flex"}
                />
              </IF>
            </div>
          );
        })}
      </div>
      <MemoizedModalComponent
        id="full-screen-card-modal"
        primaryClasses="modal-xl vertical-align-modal tall-content"
        secondaryClasses="transparent-modal"
        handleModalClose={handleModalClose}
        modalCloseButton={modalCloseButton}
      >
        <IF condition={selectedCard?.images}>
          <div
            className="align-items-center d-md-flex justify-content-center list-view"
            onClick={() => {
              console.log(modalCloseButton);
              if (modalCloseButton.current) {
                modalCloseButton.current.click();
              }
            }}
          >
            <PokemonCardAndDetailsComponent
              card={selectedCard}
              showHQImage={true}
              imageClasses="mt-4 mt-md-0"
            />
          </div>
        </IF>
      </MemoizedModalComponent>
    </>
  );
};
