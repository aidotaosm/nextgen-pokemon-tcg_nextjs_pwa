import { FunctionComponent, useContext } from "react";
import { SidebarFiltersComponentProps } from "../../models/GenericModels";
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
import { EnergyComponent } from "../UtilityComponents/EnergyComponent";
import { AppContext } from "../../contexts/AppContext";
const { defaultAlgorithm, darkAlgorithm } = theme;

export const SidebarFiltersComponent: FunctionComponent<
  SidebarFiltersComponentProps
> = ({}) => {
  const { appState } = useContext(AppContext);
  return (
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
                <div className="row row-cols-3">
                  {energyTypes.map((type: string, index: number) => {
                    return (
                      <div key={type} className="col ">
                        <Checkbox
                          value={type}
                          style={{ lineHeight: "2.3rem" }}
                          className=""
                        >
                          <EnergyComponent
                            type={type}
                            toolTipId={type + index}
                          />
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item name="card-type" label="Card Type">
              <Select mode="multiple" placeholder="Select card type">
                {superTypes.map((cardType: string, index: number) => {
                  return (
                    <Select.Option key={cardType} value={cardType}>
                      {cardType}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="sub-type" label="Sub Type">
              <Select mode="multiple" placeholder="Select sub type e.g. ex.">
                {subTypes.map((subType: string, index: number) => {
                  return (
                    <Select.Option key={subType} value={subType}>
                      {subType}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="rarity" label="Rarity">
              <Select mode="multiple" placeholder="Select rarity e.g. Rare">
                {rarities.map((rarity: string, index: number) => {
                  return (
                    <Select.Option key={rarity} value={rarity}>
                      {rarity}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </Layout.Sider>
  );
};
