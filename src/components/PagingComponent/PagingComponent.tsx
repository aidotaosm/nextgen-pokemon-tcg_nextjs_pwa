import {
  useEffect,
  useState,
  FunctionComponent,
  useRef,
  ReactNode,
} from "react";
import {
  DEFAULT_PAGE_SIZE,
  random_pokemon_names,
} from "../../constants/constants";
import styles from "./PagingComponent.module.css";
import { IF } from "../UtilityComponents/IF";
import { faL, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PagingComponentProps {
  paramPageIndex: number;
  paramPageSize?: number;
  paramNumberOfElements: number;
  pageChanged: (e: number) => void;
  syncPagingReferences: (e: number) => void;
  pageNumber: number;
  children?: any;
  showSearchField: boolean;
  showToggleButton: boolean;
  setSearchValueFunction?: Function;
}

export const PagingComponent: FunctionComponent<PagingComponentProps> = ({
  paramPageIndex,
  paramPageSize = DEFAULT_PAGE_SIZE,
  paramNumberOfElements,
  pageChanged,
  syncPagingReferences,
  pageNumber,
  children,
  showSearchField = false,
  showToggleButton = false,
  setSearchValueFunction,
}) => {
  const [pageIndex, setPageIndex] = useState<number>(paramPageIndex);
  const [pageSize, setPageSize] = useState<number>(paramPageSize);
  const [numberOfElements, setNumberOfElements] = useState<number>(
    paramNumberOfElements
  );
  const [triggerPlaceholderAutoTyping, setTriggerPlaceholderAutoTyping] =
    useState<boolean>(false);
  const inputElementRef = useRef<any>();

  const cardsPagingOnClick = (newPageIndex: number) => {
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
    if (inputElementRef?.current?.value) {
      inputElementRef.current.value = pageNumber || 1;
    }
  }, [paramPageIndex, paramNumberOfElements, paramPageSize, pageNumber]);

  const getPagingInfo = () => {
    let returnVal = "";
    let from = pageIndex * pageSize + 1;
    let to = (pageIndex + 1) * pageSize;
    if (to > numberOfElements) {
      to = numberOfElements;
    }
    returnVal += from + " to " + to + " of " + numberOfElements;
    return returnVal;
  };

  useEffect(() => {
    if (showSearchField) {
      let timeout: any = null;
      const animate = (phParam: string, randomIndex: number) => {
        console.log(randomIndex, random_pokemon_names[randomIndex]);
        let ph = (phParam += random_pokemon_names[randomIndex]);
        let searchBar = document.getElementById("search") as HTMLInputElement;
        // placeholder loop counter
        let phCount = 0;

        // function to return random number between
        // with min/max range
        const randDelay = (min: number, max: number) => {
          let delayValue = Math.floor(Math.random() * (max - min + 1) + min);
          console.log(delayValue);
          return delayValue;
        };

        // function to print placeholder text in a
        // 'typing' effect
        const printLetter = (string: string, el: HTMLInputElement) => {
          // split string into character seperated array
          let arr = string.split(""),
            input = el,
            // store full placeholder
            origString = string,
            // get current placeholder value
            curPlace = input.placeholder,
            // append next letter to current placeholder
            placeholder = curPlace + arr[phCount];

          timeout = setTimeout(() => {
            // print placeholder text
            input.placeholder = placeholder;
            // increase loop count
            phCount++;
            // run loop until placeholder is fully printed
            if (phCount < arr.length) {
              //clearTimeout(timeout);
              //timeout = printLetter(origString, input);
              printLetter(origString, input);
            }
            // use random speed to simulate
            // 'human' typing
          }, randDelay(30, 130));
        };

        // function to init animation
        const placeholder = () => {
          searchBar.placeholder = "";
          printLetter(ph, searchBar);
        };
        placeholder();
      };
      let interval = setInterval(() => {
        clearTimeout(timeout);
        let ph = "Search e.g. ";
        let randomIndex = Math.floor(
          Math.random() * random_pokemon_names.length
        );
        animate(ph, randomIndex);
      }, 4000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, []);
  return (
    <>
      {/* <IF condition={numberOfElements > pageSize}> */}
      <div className="row align-items-center small ">
        <IF condition={showSearchField}>
          <div className="col">
            <div className="input-group flex-nowrap">
              <span className="input-group-text">
                <FontAwesomeIcon className="fs-5" icon={faSearch} width={12} />
              </span>
              <input
                type="text"
                id="search"
                className="form-control search"
                placeholder="Search your Pokemon"
                onChange={(e) => {
                  //
                  console.log(e.target.value);
                  // if (!e.target.value) {
                  //   setTriggerPlaceholderAutoTyping((l) => !l);
                  // }
                  setSearchValueFunction?.(e.target.value);
                }}
              />
            </div>
          </div>
        </IF>
        <IF condition={showToggleButton}>{children}</IF>
        <IF condition={numberOfElements > pageSize}>
          <nav className="col text-right" aria-label="Page navigation example">
            <ul className="pagination mb-0 justify-content-end">
              <li className="page-item cursor-pointer">
                <span
                  className="page-link user-select-none border-0"
                  style={{ padding: "0.2rem 0.5rem" }}
                  onClick={() => cardsPagingOnClick(pageIndex - 1)}
                >
                  Previous
                </span>
              </li>
              <li
                className={
                  "page-item cursor-pointer border ms-1 " +
                  styles["without-child-page-link"]
                }
                style={{ borderRadius: "0.25rem" }}
              >
                <input
                  className={styles["style-less-input"] + " cursor-pointer"}
                  type="number"
                  onBlur={(e) => cardsPagingOnClick(+e.target.value - 1)}
                  defaultValue={pageIndex + 1}
                  onFocus={(e) => e.target.select()}
                  ref={inputElementRef}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      e.currentTarget.blur();
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
                  className="page-link border-0 ms-1"
                  onClick={() => cardsPagingOnClick(pageIndex + 1)}
                  style={{ padding: "0.2rem 0.5rem" }}
                >
                  Next
                </span>
              </li>
            </ul>
            <div className="pagination mb-0 justify-content-end">
              {getPagingInfo()}
            </div>
          </nav>
        </IF>
      </div>
      {/* </IF> */}
      {/* <IF condition={children && numberOfElements <= pageSize}>
        <div className="d-flex justify-content-center">{children}</div>
      </IF> */}
    </>
  );
};
