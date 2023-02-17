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
  faSearch,
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
      } else if (
        splitPath === "set" ||
        splitPath === "card" ||
        splitPath === "search"
      ) {
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
      className={
        "d-flex flex-column " +
        (appState.darkMode ? "dark-mode " : "") +
        (appState.offLineMode ? "offline-mode " : "")
      }
      style={{ minHeight: "100vh" }}
    >
      <header className="container pt-3 pb-4">
        <div className={"d-flex align-items-center row"}>
          <div className="col d-flex align-items-center">
            <IF condition={pathToRedirect || router.pathname != "/"}>
              <FontAwesomeIcon
                className="cursor-pointer user-select-none"
                icon={faArrowLeftLong}
                size="2x"
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
              />
            </IF>
            <Link href="/search">
              <FontAwesomeIcon
                className="cursor-pointer user-select-none ms-3 fs-2"
                icon={faSearch}
                // size="2x"
              />
            </Link>
          </div>
          <div className="col d-flex justify-content-center">
            <Link href="/" className="d-block main-logo">
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
          <div className="col d-flex col align-items-center justify-content-end">
            <div
              className="cursor-pointer user-select-none me-sm-3 me-2"
              title="Offline mode toggle"
              onClick={() => {
                updateOfflineMode?.(!appState.offLineMode);
              }}
            >
              <IF
                condition={
                  !appState.offLineMode &&
                  router.pathname != "/" &&
                  router.pathname != "/series"
                }
              >
                <FontAwesomeIcon
                  icon={faSignalPerfect}
                  size="2x"
                  style={{ width: "2.1rem" }}
                />
              </IF>
              <IF
                condition={
                  appState.offLineMode &&
                  router.pathname != "/" &&
                  router.pathname != "/series"
                }
              >
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

      <main className="flex-grow-1 d-flex">{children}</main>

      <footer className="container pt-4 pb-3">
        <div className="text-center  fs-6">
          <small>
            Pokemon TCG by{" "}
            <Link href="https://github.com/aidotaosm" target="_blank">
              Osama (GitHub)
            </Link>{" "}
            ©2023
          </small>
        </div>
      </footer>
      <ToastComponent
        autoHide={true}
        delay={30000}
        toastTitle={
          <div className="d-flex">
            <span className="me-2">Optimized User Experience</span>
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
            ? "This feature allows you to use offline features and enhances the user experience. Give us a moment while it installs."
            : serviceWorkerStatus === "done"
            ? "Service worker is successfully running. You can now enjoy an enhanced experience and benefit from supported offline features."
            : "Service worker couldn't be installed. You can continue to use the site normally. But offline features have been turned off. You may try refreshing the page or using a different (newer) browser."}
        </div>
      </ToastComponent>
    </div>
  );
};
