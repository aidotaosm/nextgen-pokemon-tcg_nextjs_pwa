import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AutoComplete, ConfigProvider, Input, theme } from "antd";
import { FunctionComponent, useContext, useEffect, useMemo, useState } from "react";
import { random_pokemon_names } from "../../constants/constants";
import { AppContext } from "../../contexts/AppContext";

interface LocalSearchComponentProps {
  setSearchValueFunction: (
    searchParam: string,
    eventType: "onChange" | "submit"
  ) => void;
  initialPlaceHolder?: string;
  defaultSearchTerm?: string;
  disabled?: boolean;
  setCards?: any[];
}

export const LocalSearchComponent: FunctionComponent<
  LocalSearchComponentProps
> = ({
  setSearchValueFunction,
  initialPlaceHolder = "Search cards e.g. ",
  defaultSearchTerm = "",
  disabled = false,
  setCards = null
}) => {
    const [searchOptions, setSearchOptions] = useState<{ value: string }[]>([]);
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const { appState } = useContext(AppContext);
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
      if (setCards) {
        let listOfCardsWithUniqueNames = Array.from(new Set(setCards.map(card => card.name)));
        setSearchOptions(listOfCardsWithUniqueNames.map(x => { return { value: x } }));
      } else {
        import("../../InternalJsons/AllCardsWithUniqueNames.json").then(
          (allCardsWithUniqueNamesModule) => {
            if (allCardsWithUniqueNamesModule.default) {
              setSearchOptions(allCardsWithUniqueNamesModule.default.map(x => { return { value: x } }));
            }
          })
      }


      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }, []);
    const triggerSearch = (value: string) => {
      console.log(value);
      if (!disabled) {
        setSearchValueFunction(value, "submit");
      }
    }

    return (
      <ConfigProvider
        theme={{
          algorithm: appState.darkMode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <AutoComplete

          style={{ width: 200 }}
          options={searchOptions}
          className="search"
          id="search"
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={triggerSearch}
          defaultValue={defaultSearchTerm}
          onChange={(e) => { setSearchValueFunction(e, "onChange"); }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              console.log(e);
              triggerSearch((e.target as HTMLInputElement).value);
            }
          }}
        >
          <Input.Search size="large" placeholder={initialPlaceHolder} enterButton />
        </AutoComplete>
      </ConfigProvider>
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