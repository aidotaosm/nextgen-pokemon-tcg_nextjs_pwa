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
      className="user-select-none col-1 cursor-pointer d-flex flex-column flex-sm-row align-items-center justify-content-center"
      onClick={(e) => {
        getUpdatedView(!isGridView);
      }}
    >
      <IF condition={isGridView}>
        <FontAwesomeIcon className="fs-5" icon={faBoxes} />
        <span className="ms-sm-2 mt-1 mt-sm-0" style={{ whiteSpace: "nowrap" }}>
          Grid View
        </span>
      </IF>
      <IF condition={!isGridView}>
        <FontAwesomeIcon className="fs-5" icon={faList} />
        <span className="ms-sm-2 mt-1 mt-sm-0" style={{ whiteSpace: "nowrap" }}>
          List View
        </span>
      </IF>
    </div>
  );
};
