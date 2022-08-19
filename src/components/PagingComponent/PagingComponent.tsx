import { useEffect, useState, FunctionComponent, useRef } from "react";
import { DEFAULT_PAGE_SIZE } from "../../constants/constants";
import styles from "./PagingComponent.module.css";
import { IF } from "../UtilityComponents/IF";

interface PagingComponentProps {
  paramPageIndex: number;
  paramPageSize?: number;
  paramNumberOfElements: number;
  pageChanged: (e: number) => void;
  syncPagingReferences: (e: number) => void;
  pageNumber: number;
}

export const PagingComponent: FunctionComponent<PagingComponentProps> = ({
  paramPageIndex,
  paramPageSize = DEFAULT_PAGE_SIZE,
  paramNumberOfElements,
  pageChanged,
  syncPagingReferences,
  pageNumber,
}) => {
  const [pageIndex, setPageIndex] = useState<number>(paramPageIndex);
  const [pageSize, setPageSize] = useState<number>(paramPageSize);
  const [numberOfElements, setNumberOfElements] = useState<number>(
    paramNumberOfElements
  );
  const inputElementRef = useRef<any>();

  const cardsPagingOnClick = (newPageIndex: number) => {
    console.log(pageIndex);
    console.log(newPageIndex);
    if (newPageIndex != pageIndex) {
      if (newPageIndex >= 0) {
        let lastPage = Math.floor(numberOfElements / pageSize);
        if (newPageIndex > lastPage) {
          setPageIndex(lastPage);
          inputElementRef.current.value = lastPage + 1;
          refUpdated();
          if (pageIndex !== lastPage) {
            pageChanged(lastPage);
          }
        } else {
          pageChanged(newPageIndex);
          inputElementRef.current.value = newPageIndex + 1;
          refUpdated();
        }
      } else if (newPageIndex < 0) {
        inputElementRef.current.value = 1;
        refUpdated();
        if (pageIndex !== 0) {
          pageChanged(0);
        }
      }
    }
  };
  const refUpdated = () => {
    syncPagingReferences(inputElementRef?.current?.value || 1);
  };
  useEffect(() => {
    setPageIndex(paramPageIndex);
    setNumberOfElements(paramNumberOfElements);
    setPageSize(paramPageSize);
    console.log(pageNumber);
    if (inputElementRef?.current?.value) {
      inputElementRef.current.value = pageNumber || 1;
    }
  }, [paramPageIndex, paramNumberOfElements, paramPageSize, pageNumber]);

  const getPagingInfo = () => {
    let returnVal = "Showing ";
    let from = pageIndex * pageSize + 1;
    let to = (pageIndex + 1) * pageSize;
    if (to > numberOfElements) {
      to = numberOfElements;
    }
    returnVal += from + " to " + to + " of " + numberOfElements;
    return returnVal;
  };

  return (
    <IF condition={numberOfElements > pageSize}>
      <div className="d-flex justify-content-between align-items-center">
        <div>{getPagingInfo()}</div>
        <nav aria-label="Page navigation example">
          <ul className="pagination mb-0 justify-content-center">
            <li className="page-item cursor-pointer">
              <span
                className="page-link user-select-none border-0"
                onClick={() => cardsPagingOnClick(pageIndex - 1)}
              >
                Previous
              </span>
            </li>
            <li
              className={
                "page-item cursor-pointer border " +
                styles["without-child-page-link"]
              }
            >
              <input
                className={styles["style-less-input"] + " cursor-pointer"}
                type="number"
                onBlur={(e) => cardsPagingOnClick(+e.target.value - 1)}
                // value={pageIndex + 1}
                defaultValue={pageIndex + 1}
                onFocus={(e) => e.target.select()}
                ref={inputElementRef}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    e.target.blur();
                  }
                }}
                style={{ width: "1.6rem" }}
              />
            </li>
            <li className={"page-item " + styles["without-child-page-link"]}>
              of
            </li>
            <li className={"page-item " + styles["without-child-page-link"]}>
              {Math.ceil(numberOfElements / pageSize)}
            </li>
            <li className="page-item cursor-pointer user-select-none">
              <span
                className="page-link border-0"
                onClick={() => cardsPagingOnClick(pageIndex + 1)}
              >
                Next
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </IF>
  );
};
