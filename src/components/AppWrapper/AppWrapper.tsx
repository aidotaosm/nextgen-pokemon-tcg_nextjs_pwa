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
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";

import { IF } from "../UtilityComponents/IF";
import { AppContext } from "../../contexts/AppContext";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import pokemonLogo from "../../../public/images/International_Pokémon_logo.png";
import { Helper } from "../../utils/helper";
import Link from "next/link";
import { ToastComponent } from "../UtilityComponents/ToastComponent";
import { Tooltip } from "bootstrap";
import ProgressComponent from "../LoaderComponent/ProgressComponent";
//declare let self: ServiceWorkerGlobalScope;

interface LocalAppInterface {
  darkMode: boolean;
  gridView: boolean;
  offLineMode: boolean;
  sidebarCollapsed: boolean;
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
  const [scrollTop, setScrollTop] = useState(0);
  const [serviceWorkerStatus, setServiceWorkerStatus] =
    useState<string>("loading");
  const [isNavigationAnimating, setIsNavigationAnimating] = useState(false);
  const swLoaderToastId = "swLoaderToast";
  const backButtonTooltipId = "backButtonTooltipId";
  const darkModeButtonTooltipId = "darkModeButtonTooltipId";
  const offlineButtonTooltipId = "offlineButtonTooltipId";
  const globalSearchButtonTooltipId = "globalSearchButtonTooltipId";
  const githubTooltipId = "githubTooltipId";

  useEffect(() => {
    let bootStrapMasterClass = appState?.bootstrap;
    let backTooltipInstance: Tooltip,
      offLineTooltipInstance: Tooltip,
      darkModeTooltipInstance: Tooltip,
      globalSearchTooltipInstance: Tooltip,
      githubTooltipInstance: Tooltip;
    if (bootStrapMasterClass) {
      const backButtonTrigger = document.getElementById(
        backButtonTooltipId
      ) as any;
      if (backButtonTrigger) {
        backTooltipInstance = new bootStrapMasterClass.Tooltip(
          backButtonTrigger
        );
      }
      const offlineButtonTrigger = document.getElementById(
        offlineButtonTooltipId
      ) as any;
      if (offlineButtonTrigger) {
        offLineTooltipInstance = new bootStrapMasterClass.Tooltip(
          offlineButtonTrigger
        );
      }
      const darkModeButtonTrigger = document.getElementById(
        darkModeButtonTooltipId
      ) as any;
      if (darkModeButtonTrigger) {
        darkModeTooltipInstance = new bootStrapMasterClass.Tooltip(
          darkModeButtonTrigger
        );
      }
      const globalSearchButtonTrigger = document.getElementById(
        globalSearchButtonTooltipId
      ) as any;
      if (globalSearchButtonTrigger) {
        globalSearchTooltipInstance = new bootStrapMasterClass.Tooltip(
          globalSearchButtonTrigger
        );
      }
      const githubTrigger = document.getElementById(githubTooltipId) as any;
      if (githubTrigger) {
        githubTooltipInstance = new bootStrapMasterClass.Tooltip(githubTrigger);
      }
    }
    return () => {
      backTooltipInstance?.dispose();
      offLineTooltipInstance?.dispose();
      darkModeTooltipInstance?.dispose();
      globalSearchTooltipInstance?.dispose();
      githubTooltipInstance?.dispose();
    };
  }, [appState?.bootstrap, router.pathname]);

  useEffect(() => {
    if (router.isReady) {
      if (router.asPath.includes("/series") || router.pathname === "/") {
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
          setPathToRedirect("/");
        }
      }
    }
  }, [router.asPath]);
  useEffect(() => {
    const handleStart = () => {
      setIsNavigationAnimating(true);
    };
    const handleStop = () => {
      setIsNavigationAnimating(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router.events]);
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
    let sidebarCollapsedValue =
      localAppState?.hasOwnProperty("sidebarCollapsed") &&
      typeof localAppState.sidebarCollapsed === "boolean"
        ? localAppState.sidebarCollapsed
        : window.innerWidth > 576
        ? false
        : true;
    let offLineModeValue =
      localAppState?.hasOwnProperty("offLineMode") &&
      typeof localAppState.offLineMode === "boolean"
        ? localAppState.offLineMode
        : false;
    multiUpdate?.({
      darkMode: darkModeValue,
      gridView: gridViewValue,
      offLineMode: offLineModeValue,
      sidebarCollapsed: sidebarCollapsedValue,
    });
    //this is needed for accordion toggle etc
    import("bootstrap").then((bootstrap) => {
      saveBootstrap?.(bootstrap);
      if (navigator.serviceWorker) {
        if (!navigator.serviceWorker.controller) {
          showToast(bootstrap);
        } else {
          //console.log("sw already found");
        }
        navigator.serviceWorker.oncontrollerchange = () => {
          showToast(bootstrap);
        };

        navigator.serviceWorker.ready
          .then((x) => {
            // console.log(x);
            //x.pushManager.
            setServiceWorkerStatus("done");
          })
          .catch((e) => {
            setServiceWorkerStatus("error");
          });
      }
    });
    const handleScroll = (event: any) => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const hideAllTollTips = () => {
    let bootStrapMasterClass = appState?.bootstrap;
    if (bootStrapMasterClass) {
      const darkModeButtonTooltipInstance: Tooltip =
        bootStrapMasterClass.Tooltip.getInstance("#" + darkModeButtonTooltipId);
      darkModeButtonTooltipInstance?.hide();
      const backButtonTooltipInstance: Tooltip =
        bootStrapMasterClass.Tooltip.getInstance("#" + backButtonTooltipId);
      backButtonTooltipInstance?.hide();
      const offlineButtonTooltipInstance: Tooltip =
        bootStrapMasterClass.Tooltip.getInstance("#" + offlineButtonTooltipId);
      offlineButtonTooltipInstance?.hide();
      const globalSearchButtonTooltipInstance: Tooltip =
        bootStrapMasterClass.Tooltip.getInstance(
          "#" + globalSearchButtonTooltipId
        );
      globalSearchButtonTooltipInstance?.hide();
      const githubTooltipInstance: Tooltip =
        bootStrapMasterClass.Tooltip.getInstance("#" + githubTooltipId);
      githubTooltipInstance?.hide();
    }
  };

  return (
    <div
      onClick={hideAllTollTips}
      className={
        "d-flex flex-column " +
        (appState.darkMode ? "dark-mode " : "") +
        (appState.offLineMode ? "offline-mode " : "")
      }
      style={{ minHeight: "100vh" }}
    >
      <ProgressComponent
        isAnimating={isNavigationAnimating}
      ></ProgressComponent>
      <header className="container py-4">
        <div className={"d-flex align-items-center row"}>
          <div className="col d-flex align-items-center">
            <IF condition={pathToRedirect || router.pathname != "/"}>
              <Link
                aria-label={"Back to last visited page"}
                href={
                  typeof window === "undefined"
                    ? "/"
                    : navigator.onLine
                    ? pathToRedirect || "/"
                    : pathToRedirect
                    ? pathToRedirect.split("?")[0]
                    : "/"
                }
                data-bs-title={"Go back to last page."}
                data-bs-toggle="tooltip"
                data-bs-trigger="hover"
                id={backButtonTooltipId}
                style={{ color: "unset" }}
                // prefetch={
                //   typeof window === "undefined" ? false : navigator.onLine
                // }
              >
                <FontAwesomeIcon
                  className="cursor-pointer user-select-none me-3 fs-3"
                  icon={faArrowLeftLong}
                />
              </Link>
            </IF>
            <IF
              condition={
                // router.pathname != "/" &&router.pathname != "/series" &&
                router.pathname != "/search"
              }
            >
              <Link href="/search" aria-label={"Search page"}>
                <span
                  // onClick={(e) => e.stopPropagation()}
                  //it is causing sw to not send offline files
                  data-bs-title={"Go to Global Search page."}
                  data-bs-toggle="tooltip"
                  data-bs-trigger="hover"
                  id={globalSearchButtonTooltipId}
                >
                  <FontAwesomeIcon
                    className="cursor-pointer user-select-none fs-4"
                    icon={faSearch}
                  />
                </span>
              </Link>
            </IF>
          </div>
          <div className="col d-flex justify-content-center">
            <Link href="/" className="d-block main-logo">
              <ImageComponent
                src={pokemonLogo}
                alt={"Pokemon logo"}
                className="w-100 h-100"
                lqImageUnOptimize={false}
              />
            </Link>
          </div>
          <div className="col d-flex col align-items-center justify-content-end">
            <div
              className="cursor-pointer user-select-none me-sm-3 me-2"
              onClick={(e) => {
                e.stopPropagation();
                updateOfflineMode?.(!appState.offLineMode);
              }}
              data-bs-title={
                "Trigger offline mode. This allows you to hide/show redundant default card images when you are using the app offline."
              }
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              id={offlineButtonTooltipId}
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
                  className="fs-3"
                  style={{ width: "2rem" }}
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
                  className="fs-3"
                  style={{ width: "2rem" }}
                />
              </IF>
            </div>
            <div
              className="cursor-pointer user-select-none"
              onClick={(e) => {
                e.stopPropagation();
                updateDarkMode?.(!appState.darkMode);
              }}
              data-bs-title={"Trigger dark mode on/off."}
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              id={darkModeButtonTooltipId}
            >
              <IF condition={appState.darkMode}>
                <FontAwesomeIcon icon={faToggleOn} className="fs-3" />
              </IF>
              <IF condition={!appState.darkMode}>
                <FontAwesomeIcon icon={faToggleOff} className="fs-3" />
              </IF>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow-1 d-flex">{children}</main>

      <footer className="container py-4">
        <p
          className="d-flex flex-column mb-0 align-items-center justify-content-around"
          style={{ minHeight: "59px" }}
        >
          <span className="text-center">
            The Next Generation Pokemon TCG database. By{" "}
            <Link
              href="https://github.com/aidotaosm"
              target="_blank"
              data-bs-title={
                "Click to visit this project in Github! And maybe give it a Start?"
              }
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              id={githubTooltipId}
              // prefetch={
              //   typeof window === "undefined" ? false : navigator.onLine
              // }
            >
              Osama
            </Link>
            .
          </span>
          <span className="text-center mt-1 mt-lg-0">
            This website is not produced, endorsed, supported, or affiliated
            with Nintendo or The Pokémon Company.
          </span>
        </p>
      </footer>

      <span
        className={
          "back-to-top-wrapper span-link" + (scrollTop > 0 ? "" : " d-none")
        }
      >
        <FontAwesomeIcon
          icon={faAnglesUp}
          className=" fs-2 cursor-pointer"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        />
      </span>

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
                />
              ) : serviceWorkerStatus === "done" ? (
                <FontAwesomeIcon icon={faCheck} className="text-success" />
              ) : (
                <FontAwesomeIcon icon={faXmark} className="text-danger" />
              )}
            </div>
          </div>
        }
        id={swLoaderToastId}
      >
        <div>
          {serviceWorkerStatus === "loading"
            ? "This feature allows you to use offline features and enhances the user experience. Give us a moment while it does it's thing!"
            : serviceWorkerStatus === "done"
            ? "Service worker is successfully running. You can now enjoy an enhanced experience and benefit from supported offline features."
            : "Service worker couldn't be installed. You can continue to use the site normally. But offline features have been turned off. You may try refreshing the page or using a different (newer) browser."}
        </div>
      </ToastComponent>
    </div>
  );
};
