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
  return (
    <div
      className={
        "d-flex flex-column " +
        (appContextValues?.appState.darkMode ? "dark-mode" : "")
      }
      style={{ minHeight: "100vh" }}
    >
      <header className="container py-2">
        <div className={"d-flex align-items-center justify-content-between"}>
          <div
            className=" icon-min-width"
            onClick={() => {
              router.push(pathToRedirect);
            }}
          >
            <IF condition={pathToRedirect}>
              <FontAwesomeIcon className="cursor-pointer" icon={faArrowLeftLong} size="2x" />
            </IF>
          </div>

          <h3 className="mb-0 align-self-center">Header</h3>
          <div
            className="cursor-pointer"
            onClick={() => {
              console.log(appContextValues);
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

      <footer className="container py-2 ">
        <h5 className="text-center  mb-0">Footer</h5>
      </footer>
    </div>
  );
};
