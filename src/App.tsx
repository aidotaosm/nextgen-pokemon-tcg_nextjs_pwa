import "./App.css";
import { ExpansionsComponent } from "./components/ExpansionsComponent";
import { DEV_POKEMONTCG_IO_API_KEY } from "./constants/constants";
//Pokemon SDK initialization
const pokemon = require("pokemontcgsdk");
let pokemonSDKVariable = pokemon.default;
pokemonSDKVariable.configure({ apiKey: DEV_POKEMONTCG_IO_API_KEY });

function App() {
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <header className="h3 text-center">Header</header>
      <main className="flex-grow-1">
        <ExpansionsComponent pokemon={pokemonSDKVariable} />
      </main>
      <footer className="h5 text-center">Footer</footer>
    </div>
  );
}

export default App;
