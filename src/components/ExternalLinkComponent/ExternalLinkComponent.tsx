import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "bootstrap";
import Link from "next/link";
import { FunctionComponent, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { ExternalLinkProps } from "../../models/GenericModels";

export const ExternalLinkComponent: FunctionComponent<ExternalLinkProps> = ({
  card,
  classes,
  toolTipId,
}) => {
  //" fs-5"
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
    <Link
      aria-label={"Open external link to " + card.name}
      href={"/card/" + card.id}
      className={classes}
      target="_blank"
      data-bs-toggle="tooltip"
      data-bs-trigger="hover"
      id={toolTipId}
      data-bs-title={"Open external link to " + card.name}
    >
      <FontAwesomeIcon
        className="cursor-pointer user-select-none"
        icon={faExternalLink}
      />
    </Link>
  );
};
