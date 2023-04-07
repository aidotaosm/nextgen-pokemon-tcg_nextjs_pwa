import { FunctionComponent, useContext, useEffect, useState } from "react";
import { SidebarFiltersComponentProps } from "../../models/GenericModels";
import energyTypes from "../../InternalJsons/AllTypes.json";
import regulationMarks from "../../InternalJsons/AllRegulationMarks.json";
import superTypes from "../../InternalJsons/AllSuperTypes.json";
import subTypes from "../../InternalJsons/AllSubtypes.json";
import rarities from "../../InternalJsons/AllRarities.json";
import { Checkbox, ConfigProvider, Form, Select, Slider, theme } from "antd";
import { EnergyComponent } from "../UtilityComponents/EnergyComponent";
import { AppContext } from "../../contexts/AppContext";
import { FilterFieldNames, ValidHPRange } from "../../models/Enums";
import type { SliderMarks } from "antd/es/slider";
const { defaultAlgorithm, darkAlgorithm } = theme;

export const SidebarFiltersComponent: FunctionComponent<
  SidebarFiltersComponentProps
> = ({ formInstance, triggerFilter }) => {
  const { appState } = useContext(AppContext);
  const [antComponentLoaded, setAntComponentLoaded] = useState(false);
  const marks: SliderMarks = {
    [ValidHPRange.min.toString()]: {
      style: {
        color: 'var(--bs-success)',
      },
      label: ValidHPRange.min.toString(),
    },
    [ValidHPRange.max.toString()]: {
      style: {
        color: 'var(--bs-danger)',
      },
      label: ValidHPRange.max.toString(),
    },
  };
  useEffect(() => {
    setAntComponentLoaded(true);
  });
  return (
    <div className="d-flex flex-column rounded card">
      <ConfigProvider
        theme={{
          algorithm: appState.darkMode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <div className={(antComponentLoaded ? '' : 'skeleton-animation')}>
          <Form
            name="sidebar-filter"
            layout="vertical"
            className={"card-body " + (antComponentLoaded ? '' : 'invisible')}
            form={formInstance}
            initialValues={{ [FilterFieldNames.hpRange]: [10, 360] }}
            style={{ padding: 'var(--bs-card-spacer-y) var(--bs-card-spacer-x)' }}
          >
            <Form.Item
              name={FilterFieldNames.energyType}
              label="Energy Type"
              className="energy-checkbox-group"
            >
              <Checkbox.Group onChange={triggerFilter}>
                <div className="row row-cols-3">
                  {energyTypes.map((type: string, index: number) => {
                    return (
                      <div key={type} className="col ">
                        <Checkbox
                          //  title={type}
                          aria-label={type}
                          value={type}
                          className=""
                        >
                          <EnergyComponent type={type} toolTipId={type + index} />
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name={FilterFieldNames.regulationMarks}
              label="Regulation Marks"
              className="energy-checkbox-group"
            >
              <Checkbox.Group onChange={triggerFilter}>
                <div className="row row-cols-4">
                  {regulationMarks.map((regulationMark: string, index: number) => {
                    return (
                      <div key={regulationMark} className="col ">
                        <Checkbox
                          //  title={type}
                          aria-label={regulationMark}
                          value={regulationMark}
                          className=""
                        >
                          {regulationMark}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item name={FilterFieldNames.subType} label="Sub Type">
              <Select
                mode="multiple"
                placeholder="Select sub type e.g. ex."
                onChange={triggerFilter}
              >
                {subTypes.map((subType: string, index: number) => {
                  return (
                    <Select.Option key={subType} value={subType}>
                      {subType}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name={FilterFieldNames.rarity} label="Rarity">
              <Select
                mode="multiple"
                placeholder="Select rarity e.g. Rare"
                onChange={triggerFilter}
              >
                {rarities.map((rarity: string, index: number) => {
                  return (
                    <Select.Option key={rarity} value={rarity}>
                      {rarity}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name={FilterFieldNames.hpRange} label="HP Range">
              <Slider range marks={marks} min={ValidHPRange.min} max={ValidHPRange.max} className="mb-0" step={10} onAfterChange={triggerFilter} />
            </Form.Item>
            <Form.Item name={FilterFieldNames.cardType} label="Card Type">
              <Select
                mode="multiple"
                placeholder="Select card type"
                onChange={triggerFilter}
              >
                {superTypes.map((cardType: string, index: number) => {
                  return (
                    <Select.Option key={cardType} value={cardType}>
                      {cardType}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </ConfigProvider>
    </div>
  );
};
