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
import { defaultBlurImage } from "../../../base64Images/base64Images";

export const GridViewComponent: FunctionComponent<SetCardsProps> = ({
  setCards,
}) => {
  const [selectedCard, setSelectedCard] = useState<any>({});
  const modalCloseButton = useRef<any>();
  const { appState } = useContext(AppContext);
  const handleModalClose = useCallback((e: Event) => {
    setSelectedCard(null);
  }, []);
  return (
    <>
      <div
        className={
          "flex-grow-1 " +
          (!appState.offLineMode
            ? "g-4 row row-cols-1 " +
            (appState.sidebarCollapsed
              ? "row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5"
              : "row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-4")
            : "g-4 row row-cols-1 " +
            (appState.sidebarCollapsed
              ? "row-cols-md-2 row-cols-xl-3 row-cols-xxl-4"
              : "row-cols-md-1 row-cols-xl-2 row-cols-xxl-3"))
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
                        toolTipId={card.id + "tool-tip-grid"}
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
                        blurDataURL={defaultBlurImage}
                        className="rounded position-relative card-img-top special-card disable-save h-100 w-100"
                      />
                    </div>
                  </div>

                  <div className="card-footer">
                    <small className="">
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
        <IF condition={setCards?.length === 0}>
          <div className="d-flex justify-content-center flex-grow-1">
            <h2 className="align-self-center mb-0">No cards found.</h2>
          </div>
        </IF>
        <IF condition={setCards === null}>
          {[...Array(20)].map((card: any, index: number) => {
            return (
              <div className="col d-flex" key={index}>

                <div className="card position-static flex-grow-1">
                  <div className="card-body">
                    <div className="card-title mb-0 d-flex align-items-center justify-content-between">
                      <span className="fs-5 fs-bold skeleton-animation d-block w-75" style={{ height: '1.25rem' }}></span>
                    </div>
                  </div>
                  <div className="special-card-wrapper">
                    <div
                      className="special-card-border "
                    >
                      <ImageComponent
                        src={defaultBlurImage}
                        alt={'card-image-skeleton'}
                        width={245}
                        height={342}
                        blurDataURL={defaultBlurImage}
                        className="rounded position-relative card-img-top special-card disable-save h-100 w-100"
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <small className="skeleton-animation d-block w-50" style={{ height: '1rem' }}>
                    </small>
                  </div>
                </div>

              </div>
            );
          })}
        </IF>
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
            className="align-items-center d-md-flex justify-content-center full-screen-view"
            onClick={() => {
              if (modalCloseButton.current) {
                modalCloseButton.current.click();
              }
            }}
          >
            <PokemonCardAndDetailsComponent
              card={selectedCard}
              showHQImage={true}
              imageClasses="mt-4 mt-md-0"
              detailsClasses="mt-5 mt-md-0 ms-md-5 flex-grow-1"
            />
          </div>
        </IF>
      </MemoizedModalComponent>
    </>
  );
};
