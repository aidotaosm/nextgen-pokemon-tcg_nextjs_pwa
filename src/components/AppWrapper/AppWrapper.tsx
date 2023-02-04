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
}
export const AppWrapper: FunctionComponent<BasicProps> = ({ children }) => {
  const appContextValues = useContext(AppContext);
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
    appContextValues?.multiUpdate({
      darkMode: darkModeValue,
      gridView: gridViewValue,
    });
    //this is needed for accordion toggle etc
    import("bootstrap").then((bootstrap) => {
      appContextValues?.saveBootstrap(bootstrap);
      if (navigator.serviceWorker) {
        showToast(bootstrap);
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
              className="cursor-pointer user-select-none me-3"
              title="Offline mode toggle"
              onClick={() => {
                appContextValues?.updateOfflineMode(
                  !appContextValues?.appState.offLineMode
                );
              }}
            >
              <IF condition={appContextValues?.appState.offLineMode}>
                <FontAwesomeIcon
                  icon={faSignalPerfect}
                  size="2x"
                  style={{ width: "31.5px" }}
                />
              </IF>
              <IF condition={!appContextValues?.appState.offLineMode}>
                <FontAwesomeIcon
                  icon={faWaveSquare}
                  size="2x"
                  style={{ width: "31.5px" }}
                />
              </IF>
            </div>
            <div
              title="Dark mode toggle"
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
            <span className="me-2">Service worker status:</span>
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
            ? "This feature allows you to use most of the site while offline. Please wait while the it installs."
            : serviceWorkerStatus === "done"
            ? "Service worker is successfully running in the background. You can now benefit from supported offline features."
            : "Service worker couldn't be installed. Offline features have been turned off. Try refreshing the page or using a different (newer) browser."}
        </div>
      </ToastComponent>
    </div>
  );
};
