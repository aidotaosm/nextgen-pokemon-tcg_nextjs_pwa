import { useRouter } from "next/router";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { BasicProps } from "../../models/GenericModels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faToggleOn,
  faToggleOff,
  faSignalPerfect,
  faWaveSquare,
  faSpinner,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { IF } from "../UtilityComponents/IF";
import { AppContext } from "../../contexts/AppContext";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import pokemonLogo from "../../../public/images/International_Pokémon_logo.svg";
import { Helper } from "../../utils/helper";
import Link from "next/link";
import { logoBlurImage } from "../../../base64Images/base64Images";
import { ToastComponent } from "../UtilityComponents/ToastComponent";
//declare let self: ServiceWorkerGlobalScope;

interface LocalAppInterface {
  darkMode: boolean;
  gridView: boolean;
  offLineMode: boolean;
}
export const AppWrapper: FunctionComponent<BasicProps> = ({ children }) => {
  const {
    multiUpdate,
    saveBootstrap,
    appState,
    updateOfflineMode,
    updateDarkMode,
  } = useContext(AppContext);
  let router = useRouter();
  const [pathToRedirect, setPathToRedirect] = useState<string>("");
  const [listOfPaths, setListOfPaths] = useState<string[]>([]);
  const [serviceWorkerStatus, setServiceWorkerStatus] =
    useState<string>("loading");
  const swLoaderToastId = "swLoaderToast";

  useEffect(() => {
    if (router.isReady) {
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
          setPathToRedirect(listOfPaths[listOfPaths.length - 1]);
        } else {
          setPathToRedirect("/series");
        }
      }
    }
  }, [router.asPath]);
  const showToast = (bootstrap: any) => {
    const toastLiveExample = document.getElementById(swLoaderToastId);
    if (toastLiveExample && bootstrap) {
      new bootstrap.Toast(toastLiveExample).show();
    }
  };
  useEffect(() => {
    let localAppState: LocalAppInterface =
      Helper.getLocalStorageItem("appState");
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
    let offLineModeValue =
      localAppState?.hasOwnProperty("offLineMode") &&
      typeof localAppState.offLineMode === "boolean"
        ? localAppState.offLineMode
        : false;
    multiUpdate?.({
      darkMode: darkModeValue,
      gridView: gridViewValue,
      offLineMode: offLineModeValue,
    });
    //this is needed for accordion toggle etc
    import("bootstrap").then((bootstrap) => {
      saveBootstrap?.(bootstrap);
      if (navigator.serviceWorker) {
        if (!navigator.serviceWorker.controller) {
          showToast(bootstrap);
        } else {
          console.log("sw already found");
        }
        navigator.serviceWorker.oncontrollerchange = () => {
          "new sw ver added";
          showToast(bootstrap);
        };

        navigator.serviceWorker.ready
          .then((x) => {
            console.log(x);
            //x.pushManager.
            setServiceWorkerStatus("done");
          })
          .catch((e) => {
            setServiceWorkerStatus("error");
          });
      }
    });
  }, []);

  return (
    <div
      className={"d-flex flex-column " + (appState.darkMode ? "dark-mode" : "")}
      style={{ minHeight: "100vh" }}
    >
      <header className="container pt-3 pb-4">
        <div className={"d-flex align-items-center justify-content-between"}>
          <div
            className=" icon-min-width "
            onClick={(e) => {
              e.preventDefault();
              router.push(
                navigator.onLine
                  ? pathToRedirect || "/"
                  : pathToRedirect
                  ? pathToRedirect.split("?")[0]
                  : "/"
              );
            }}
          >
            <IF condition={pathToRedirect || router.pathname != "/"}>
              <FontAwesomeIcon
                className="cursor-pointer user-select-none"
                icon={faArrowLeftLong}
                size="2x"
              />
            </IF>
          </div>
          <div style={{ width: "180px", marginLeft: "calc(31.5px + 1rem)" }}>
            <Link href="/">
              <ImageComponent
                src={pokemonLogo}
                //  src={"/images/International_Pokémon_logo.svg"}
                alt={"Pokemon"}
                blurDataURL={logoBlurImage}
                className="w-100 h-auto"
                lqImageUnOptimize={true}
              />
            </Link>
          </div>
          <div className="d-flex">
            <div
              className="cursor-pointer user-select-none me-sm-3 me-2"
              title="Offline mode toggle"
              onClick={() => {
                updateOfflineMode?.(!appState.offLineMode);
              }}
            >
              <IF condition={!appState.offLineMode}>
                <FontAwesomeIcon
                  icon={faSignalPerfect}
                  size="2x"
                  style={{ width: "2.1rem" }}
                />
              </IF>
              <IF condition={appState.offLineMode}>
                <FontAwesomeIcon
                  icon={faWaveSquare}
                  size="2x"
                  style={{ width: "2.1rem" }}
                />
              </IF>
            </div>
            <div
              title="Dark mode toggle"
              className="cursor-pointer user-select-none"
              onClick={() => {
                updateDarkMode?.(!appState.darkMode);
              }}
            >
              <IF condition={appState.darkMode}>
                <FontAwesomeIcon icon={faToggleOn} size="2x" />
              </IF>
              <IF condition={!appState.darkMode}>
                <FontAwesomeIcon icon={faToggleOff} size="2x" />
              </IF>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow-1">{children}</main>

      <footer className="container pt-4 pb-3">
        <div className="text-center  fs-6">
          <small>
            Pokemon TCG by{" "}
            <Link href="https://github.com/aidotaosm" target="_blank">
              OSM
            </Link>{" "}
            ©2022
          </small>
        </div>
      </footer>
      <ToastComponent
        autoHide={false}
        toastTitle={
          <div className="d-flex">
            <span className="me-2">Service worker status</span>
            <div className="text-center">
              {serviceWorkerStatus === "loading" ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin={true}
                  className="text-primary"
                  // size="2x"
                />
              ) : serviceWorkerStatus === "done" ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-success"
                  // size="2x"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-danger"
                  // size="2x"
                />
              )}
            </div>
          </div>
        }
        id={swLoaderToastId}
      >
        <div>
          {serviceWorkerStatus === "loading"
            ? "This feature allows you to use most of the site while offline and enhances the user experience. Give us a moment while it installs."
            : serviceWorkerStatus === "done"
            ? "Service worker is successfully running in the background. You can now benefit from supported offline features."
            : "Service worker couldn't be installed. Offline features have been turned off. Try refreshing the page or using a different (newer) browser."}
        </div>
      </ToastComponent>
    </div>
  );
};
