import { FunctionComponent, useState } from "react";
import { BasicProps } from "../../models/GenericModels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faBoxes } from "@fortawesome/free-solid-svg-icons";
import { IF } from "./IF";

interface ListOrGridViewProps {
  getUpdatedView: (e: boolean) => void;
  isGridView: boolean;
}
export const ListOrGridView: FunctionComponent<ListOrGridViewProps> = ({
  getUpdatedView,
  isGridView,
}) => {
  return (
    <div
      className=" icon-min-width user-select-none col-1 text-center"
      onClick={(e) => {
        getUpdatedView(!isGridView);
      }}
    >
      <IF condition={isGridView}>
        <FontAwesomeIcon className="cursor-pointer" icon={faBoxes} size="2x" />
      </IF>
      <IF condition={!isGridView}>
        <FontAwesomeIcon className="cursor-pointer" icon={faList} size="2x" />
      </IF>
    </div>
  );
};
