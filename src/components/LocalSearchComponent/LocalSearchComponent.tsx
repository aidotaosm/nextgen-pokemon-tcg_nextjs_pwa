import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AutoComplete } from "antd";
import { FunctionComponent, useEffect } from "react";
import { random_pokemon_names } from "../../constants/constants";
import allCardsWithUniqueNames from "../../InternalJsons/AllCardsWithUniqueNames.json";

interface LocalSearchComponentProps {
  setSearchValueFunction: (
    searchParam: string,
    eventType: "onChange" | "submit"
  ) => void;
  initialPlaceHolder?: string;
  defaultSearchTerm?: string;
  disabled?: boolean;
}
export const LocalSearchComponent: FunctionComponent<
  LocalSearchComponentProps
> = ({
  setSearchValueFunction,
  initialPlaceHolder = "Search cards e.g. ",
  defaultSearchTerm = "",
  disabled = false
}) => {
    useEffect(() => {
      let timeout: any = null;
      const animate = (randomIndex: number) => {
        let ph = random_pokemon_names[randomIndex];
        let searchBar = document.getElementById("search") as HTMLInputElement;
        // placeholder loop counter
        let phCount = 0;

        // function to return random number between
        // with min/max range
        const randDelay = (min: number, max: number) => {
          let delayValue = Math.floor(Math.random() * (max - min + 1) + min);
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
          }, randDelay(30, 199));
        };

        // function to init animation
        const placeholder = () => {
          searchBar.placeholder = initialPlaceHolder;
          printLetter(ph, searchBar);
        };
        placeholder();
      };
      let interval = setInterval(() => {
        clearTimeout(timeout);
        let randomIndex = Math.floor(Math.random() * random_pokemon_names.length);
        animate(randomIndex);
      }, 2000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }, []);
    const triggerSearch = () => {
      if (!disabled) {
        let fieldValue = (
          document.getElementById("search") as HTMLInputElement
        ).value;
        setSearchValueFunction(fieldValue, "submit");
      }
    }
    return (
      <AutoComplete
        style={{ width: 200 }}
        options={allCardsWithUniqueNames.map(x => { return { value: x } })}
        placeholder="try to type `b`"
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />

    );
  };
{/* <div className="input-group flex-nowrap">
        <input
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              triggerSearch();
            }
          }}
          disabled={disabled}
          title="Search"
          value={defaultSearchTerm}
          type="text"
          id="search"
          className="form-control search"
          placeholder={initialPlaceHolder}
          onChange={(e) => {
            setSearchValueFunction(e.target.value, "onChange");
          }}
        />
        <span
          className="input-group-text cursor-pointer"
          onClick={() => {
            triggerSearch();
          }}
        >
          <FontAwesomeIcon className="fs-5" icon={faSearch} />
        </span>
      </div> */}