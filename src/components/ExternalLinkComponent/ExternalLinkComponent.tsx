import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { FunctionComponent } from "react";
import { ExternalLinkProps } from "../../models/GenericModels";

export const ExternalLinkComponent: FunctionComponent<ExternalLinkProps> = ({
  card,
  classes,
}) => {
  //" fs-5"
  return (
    <Link href={"/card/" + card.id} className={classes} target="_blank">
      <FontAwesomeIcon
        className="cursor-pointer user-select-none"
        icon={faExternalLink}
      />
    </Link>
  );
};
