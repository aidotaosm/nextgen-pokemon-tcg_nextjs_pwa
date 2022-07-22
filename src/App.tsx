import "./App.css";
import { Routes, Route } from "react-router-dom";
// import { ExpansionsComponent } from "./components/ExpansionsComponent";
import { Series } from "./pages/series";
import { HomePage } from "./pages/homepage";
import { AppWrapper } from "./pages/AppWrapper";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppWrapper />}>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="series" element={<Series />} />
        {/* <Route path="/series/set" element={<Set />} />
            <Route path="/series/set/card" element={<Card />} /> */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-5 text-danger">
              Page does not exist.
            </h1>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
