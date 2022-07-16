import "./App.css";
import { ExpansionsComponent } from "./components/ExpansionsComponent";
import { DEV_POKEMONTCG_IO_API_KEY } from "./constants/constants";
const pokemon = require("pokemontcgsdk");
console.log(pokemon);
let pokemonSDKVariable = pokemon.default;
console.log(pokemonSDKVariable);
pokemonSDKVariable.configure({ apiKey: DEV_POKEMONTCG_IO_API_KEY });

function App() {
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <header>Header</header>
      <div className="h-100">
        <ExpansionsComponent pokemon={pokemonSDKVariable} />
      </div>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
