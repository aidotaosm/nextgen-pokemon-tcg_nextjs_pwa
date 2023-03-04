import { FunctionComponent, useState } from "react";
import { BasicProps } from "../../models/GenericModels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faBoxes } from "@fortawesome/free-solid-svg-icons";
import { IF } from "./IF";

interface ListOrGridViewToggleProps {
  getUpdatedView: (e: boolean) => void;
  isGridView: boolean;
  additionalClasses?: string;
}
export const ListOrGridViewToggle: FunctionComponent<
  ListOrGridViewToggleProps
> = ({ getUpdatedView, isGridView, additionalClasses = "" }) => {
  return (
    <div
      className={
        "d-flex flex-column flex-md-row align-items-center justify-content-center " +
        additionalClasses
      }
    >
      <IF condition={isGridView}>
        <FontAwesomeIcon className="fs-5" icon={faBoxes} />
        <span
          onClick={(e) => {
            getUpdatedView(!isGridView);
          }}
          className="ms-0 ms-md-2 mt-1 mt-md-0 user-select-none cursor-pointer "
          style={{ whiteSpace: "nowrap" }}
        >
          Grid View
        </span>
      </IF>
      <IF condition={!isGridView}>
        <FontAwesomeIcon className="fs-5" icon={faList} />
        <span
          onClick={(e) => {
            getUpdatedView(!isGridView);
          }}
          className="ms-0 ms-md-2 mt-1 mt-md-0 user-select-none cursor-pointer "
          style={{ whiteSpace: "nowrap" }}
        >
          List View
        </span>
      </IF>
    </div>
  );
};
