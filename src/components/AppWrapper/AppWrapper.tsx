import { useRouter } from "next/router";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { BasicProps } from "../../models/GenericModels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { IF } from "../UtilityComponents/IF";
import { AppContext } from "../../contexts/AppContext";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import pokemonLogo from "../../../public/svgs/International_Pokémon_logo.svg";
import { Helper } from "../../utils/helper";
interface LocalAppInterface {
  darkMode: boolean;
  gridView: boolean;
}
export const AppWrapper: FunctionComponent<BasicProps> = ({ children }) => {
  const appContextValues = useContext(AppContext);
  let router = useRouter();
  const [pathToRedirect, setPathToRedirect] = useState("");
  useEffect(() => {
    let splitPath = router.pathname.split("/")[1];
    if (!splitPath) {
      setPathToRedirect("");
    } else if (splitPath === "series") {
      setPathToRedirect("/");
    } else if (splitPath === "set") {
      setPathToRedirect("/series");
    }
  }, [router.pathname]);

  useEffect(() => {
    let localAppState: LocalAppInterface =
      Helper.getLocalStorageItem("appState");
    console.log(localAppState);
    let darkModeValue =
      localAppState?.hasOwnProperty("darkMode") &&
      typeof localAppState.darkMode === "boolean"
        ? localAppState.darkMode
        : true;
    let gridViewValue =
      localAppState?.hasOwnProperty("gridView") &&
      typeof localAppState.gridView === "boolean"
        ? localAppState.gridView
        : false;
    appContextValues?.multiUpdate({
      darkMode: darkModeValue,
      gridView: gridViewValue,
    });
  }, []);

  return (
    <div
      className={
        "d-flex flex-column " +
        (appContextValues?.appState.darkMode ? "dark-mode" : "")
      }
      style={{ minHeight: "100vh" }}
    >
      <header className="container py-3">
        <div className={"d-flex align-items-center justify-content-between"}>
          <div
            className=" icon-min-width "
            onClick={(e) => {
              e.preventDefault();
              router.push(pathToRedirect);
            }}
          >
            <IF condition={pathToRedirect}>
              <FontAwesomeIcon
                className="cursor-pointer user-select-none"
                icon={faArrowLeftLong}
                size="2x"
              />
            </IF>
          </div>
          <div className="" style={{ width: "200px" }}>
            <ImageComponent
              src={pokemonLogo}
              alt={"Pokemon"}
              blurDataURL={"/images/Cardback-sideways.webp"}
            />
          </div>

          <div
            className="cursor-pointer user-select-none"
            onClick={() => {
              appContextValues?.updateDarkMode(
                !appContextValues?.appState.darkMode
              );
            }}
          >
            <IF condition={appContextValues?.appState.darkMode}>
              <FontAwesomeIcon icon={faToggleOn} size="2x" />
            </IF>
            <IF condition={!appContextValues?.appState.darkMode}>
              <FontAwesomeIcon icon={faToggleOff} size="2x" />
            </IF>
          </div>
        </div>
      </header>

      <main className="flex-grow-1">{children}</main>

      <footer className="container py-3 ">
        <h6 className="text-center  mb-0">Pokemon TCG by OSM ©2022</h6>
      </footer>
    </div>
  );
};
