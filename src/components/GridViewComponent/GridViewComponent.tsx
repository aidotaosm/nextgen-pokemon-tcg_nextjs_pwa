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
import energyTypes from "../../InternalJsons/AllTypes.json";
import superTypes from "../../InternalJsons/AllSuperTypes.json";
import subTypes from "../../InternalJsons/AllSubtypes.json";
import rarities from "../../InternalJsons/AllRarities.json";
import {
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Layout,
  Row,
  Select,
  theme,
} from "antd";
import { EnergyComponent } from "../UtilityComponents/ExternalLinkComponent";
const { defaultAlgorithm, darkAlgorithm } = theme;

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
    <div className="d-flex">
      <Layout.Sider trigger={null} collapsible collapsed={false}>
        <div className="d-flex flex-column me-3">
          <ConfigProvider
            theme={{
              algorithm: appState.darkMode ? darkAlgorithm : defaultAlgorithm,
            }}
          >
            <Form name="sidebar-filter" layout="vertical">
              <Form.Item
                name="energy-types"
                label="Energy Type"
                className="energy-checkbox-group"
              >
                <Checkbox.Group>
                  <Row>
                    {energyTypes.map((type: string, index: number) => {
                      return (
                        <Col span={8}>
                          <Checkbox
                            value={type}
                            style={{ lineHeight: "32px" }}
                            className=""
                          >
                            <EnergyComponent
                              type={type}
                              toolTipId={type + index}
                            />
                          </Checkbox>
                        </Col>
                      );
                    })}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="card-type" label="Card Type">
                <Select mode="multiple" placeholder="Select card type">
                  {superTypes.map((superType: string, index: number) => {
                    return (
                      <Select.Option value={superType}>
                        {superType}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="sub-type" label="Sub Type">
                <Select mode="multiple" placeholder="Select sub type e.g. ex.">
                  {subTypes.map((superType: string, index: number) => {
                    return (
                      <Select.Option value={superType}>
                        {superType}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="rarity" label="Rarity">
                <Select mode="multiple" placeholder="Select rarity e.g. Rare">
                  {rarities.map((rarity: string, index: number) => {
                    return (
                      <Select.Option value={rarity}>{rarity}</Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Form>
          </ConfigProvider>
        </div>
      </Layout.Sider>
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
    </div>
  );
};
