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
import Link from "../UtilityComponents/Link";
interface LocalAppInterface {
  darkMode: boolean;
  gridView: boolean;
}
export const AppWrapper: FunctionComponent<BasicProps> = ({ children }) => {
  const appContextValues = useContext(AppContext);
  let router = useRouter();
  const [pathToRedirect, setPathToRedirect] = useState<string>("");
  const [listOfPaths, setListOfPaths] = useState<string[]>([]);
  useEffect(() => {
    if (router.isReady) {
      console.log(router);
      if (router.asPath.includes("/series")) {
        setListOfPaths((l) => [...l, router.asPath]);
      }
      let splitPath = router.pathname.split("/")[1];
      if (!splitPath) {
        setPathToRedirect("");
      } else if (splitPath === "series") {
        setPathToRedirect("/");
      } else if (splitPath === "set" || splitPath === "card") {
        if (
          listOfPaths.length &&
          listOfPaths[listOfPaths.length - 1] != router.asPath
        ) {
          console.log(listOfPaths);

          setPathToRedirect(listOfPaths[listOfPaths.length - 1]);
        } else {
          setPathToRedirect("/series");
        }
      }
    }
  }, [router.asPath]);

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

    //this is needed for accordion toggle etc
    import("bootstrap").then((bootstrap) => {
      appContextValues?.saveBootstrap(bootstrap);
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
      <header className="container pt-3 pb-4">
        <div className={"d-flex align-items-center justify-content-between"}>
          <div
            className=" icon-min-width "
            onClick={(e) => {
              e.preventDefault();
              console.log(pathToRedirect);
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
            <Link href="/">
              <a>
                <ImageComponent
                  src={pokemonLogo}
                  alt={"Pokemon"}
                  blurDataURL={"/images/Cardback-sideways.webp"}
                />
              </a>
            </Link>
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

      <footer className="container pt-4 pb-3">
        <div className="text-center  fs-6">
          <small>
            Pokemon TCG by{" "}
            <Link href="https://github.com/aidotaosm">
              <a target="_blank">OSM</a>
            </Link>{" "}
            ©2022
          </small>
        </div>
      </footer>
    </div>
  );
};
