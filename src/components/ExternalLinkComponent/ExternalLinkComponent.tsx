import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent } from "react";
import { ExternalLinkProps } from "../../models/GenericModels";
import Link from "../UtilityComponents/Link";

export const ExternalLinkComponent: FunctionComponent<ExternalLinkProps> = ({
  card,
  classes,
}) => {
  //" fs-5"
  return (
    <Link href={"/card/" + card.id}>
      <a target="_blank" className={classes}>
        <FontAwesomeIcon
          className="cursor-pointer user-select-none"
          icon={faExternalLink}
        />
      </a>
    </Link>
  );
};
