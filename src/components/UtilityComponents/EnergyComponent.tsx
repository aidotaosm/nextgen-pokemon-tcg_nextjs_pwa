import { Tooltip } from "bootstrap";
import { FunctionComponent, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { EnergyComponentProps } from "../../models/GenericModels";

export const EnergyComponent: FunctionComponent<EnergyComponentProps> = ({
  type,
  toolTipId,
}) => {
  const appContextValues = useContext(AppContext);
  useEffect(() => {
    let tooltipTriggerInstance: Tooltip;
    let bootStrapMasterClass = appContextValues?.appState?.bootstrap;
    const tooltipTrigger = document.getElementById(toolTipId) as any;
    if (bootStrapMasterClass && tooltipTrigger) {
      tooltipTriggerInstance = new bootStrapMasterClass.Tooltip(tooltipTrigger);
    }
    return () => {
      tooltipTriggerInstance?.dispose();
    };
  }, [appContextValues?.appState?.bootstrap]);
  return (
    <div
      style={{ scale: "0.8" }}
      data-bs-toggle="tooltip"
      data-bs-trigger="hover"
      id={toolTipId}
      data-bs-title={type + " type"}
      className={"energy-type " + type}
    ></div>
  );
};
