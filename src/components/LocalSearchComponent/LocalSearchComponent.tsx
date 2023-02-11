import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useEffect } from "react";
import { random_pokemon_names } from "../../constants/constants";

interface LocalSearchComponentProps {
  setSearchValueFunction: Function;
}
export const LocalSearchComponent: FunctionComponent<
  LocalSearchComponentProps
> = ({ setSearchValueFunction }) => {
  useEffect(() => {
    let timeout: any = null;
    const animate = (phParam: string, randomIndex: number) => {
      let ph = (phParam += random_pokemon_names[randomIndex]);
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
      let randomIndex = Math.floor(Math.random() * random_pokemon_names.length);
      animate(ph, randomIndex);
    }, 4000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="input-group flex-nowrap">
      <span className="input-group-text">
        <FontAwesomeIcon className="fs-5" icon={faSearch} />
      </span>
      <input
        type="text"
        id="search"
        className="form-control search"
        placeholder="Search your Pokemon"
        onChange={(e) => {
          setSearchValueFunction?.(e.target.value);
        }}
      />
    </div>
  );
};
