import { useEffect, useState, FunctionComponent } from "react";
import { DEFAULT_PAGE_SIZE } from "../../constants/constants";

interface PagingComponentProps {
  paramPageIndex: number;
  paramPageSize?: number;
  paramNumberOfElements: number;
  pageChanged: (e: number) => void;
}

export const PagingComponent: FunctionComponent<PagingComponentProps> = ({
  paramPageIndex,
  paramPageSize = DEFAULT_PAGE_SIZE,
  paramNumberOfElements,
  pageChanged,
}) => {
  const [pageIndex, setPageIndex] = useState<number>(paramPageIndex);
  const [pageSize, setPageSize] = useState<number>(paramPageSize);
  const [numberOfElements, setNumberOfElements] = useState<number>(
    paramNumberOfElements
  );

  const cardsPagingOnClick = (newPageIndex: number) => {
    console.log(newPageIndex);
    let lastPage = Math.floor(numberOfElements / pageSize);
    if (pageIndex > lastPage) {
      setPageIndex(lastPage);
    }
    pageChanged(newPageIndex);
    setPageIndex(newPageIndex);
  };

  useEffect(() => {
    console.log(pageIndex);
    console.log(pageSize);
    console.log(numberOfElements);
    let lastPage = Math.floor(numberOfElements / pageSize);
    if (pageIndex > lastPage) {
      setPageIndex(lastPage);
    }
  }, [paramPageIndex]);

  const getPagingInfo = () => {
    let lastPage = Math.floor(numberOfElements / pageSize);
    if (numberOfElements < pageSize || pageIndex > lastPage) {
      return "";
    } else {
      let returnVal = "Showing ";
      let from = pageIndex * pageSize + 1;
      let to = (pageIndex + 1) * pageSize;
      if (to > numberOfElements) {
        to = numberOfElements;
      }
      returnVal += from + " to " + to + " of " + numberOfElements;
      return returnVal;
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>{getPagingInfo()}</div>
      <nav aria-label="Page navigation example">
        <ul className="pagination mb-0 justify-content-center">
          <li className="page-item cursor-pointer disabled">
            <span
              className="page-link"
              tabIndex={-1}
              onClick={() => cardsPagingOnClick(pageIndex - 1)}
            >
              Previous
            </span>
          </li>
          <li className="page-item cursor-pointer">
            <span className="page-link" onClick={() => cardsPagingOnClick(1)}>
              1
            </span>
          </li>
          <li className="page-item" style={{ padding: "0.375rem 0.75rem" }}>
            of
          </li>
          <li className="page-item cursor-pointer">
            <span className="page-link" onClick={() => cardsPagingOnClick(3)}>
              3
            </span>
          </li>
          <li className="page-item cursor-pointer">
            <span
              className="page-link"
              onClick={() => cardsPagingOnClick(pageIndex + 1)}
            >
              Next
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};
