import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
// import { ExpansionsComponent } from "./components/ExpansionsComponent";
import { Series } from "./pages/series";
import { HomePage } from "./pages/homepage";
import { AppWrapper } from "./pages/AppWrapper";
import { Set } from "./pages/set";
import { PageNotFound } from "./pages/PageNotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppWrapper />}>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="series" element={<Series />} />
        <Route path="set" element={<Set />}>
          <Route path=":setId" element={<Set />} />
        </Route>
        {/* <Route path="/series/set/card" element={<Card />} /> */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
