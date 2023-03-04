import React, { useState, createContext, FunctionComponent } from "react";
import { flushSync } from "react-dom";
import { BasicProps } from "../models/GenericModels";
import { Helper } from "../utils/helper";

interface AppContextInterface {
  appState: {
    darkMode: boolean;
    gridView: boolean;
    bootstrap: any;
    offLineMode: boolean;
    globalSearchTerm: string;
    sidebarCollapsed: boolean;
  };
  setAppState?: any;
  updateDarkMode?: (e: boolean) => void;
  updateOfflineMode?: (e: boolean) => void;
  updateGridView?: (e: boolean) => void;
  updateSidebarCollapsed?: (e: boolean) => void;
  multiUpdate?: (e: {
    darkMode?: boolean;
    gridView?: boolean;
    bootstrap?: any;
    offLineMode?: boolean;
    sidebarCollapsed?: boolean;
  }) => void;
  saveBootstrap?: (e: any) => void;
  updateGlobalSearchTerm?: (e: string) => void;
}

export const AppContext = createContext<AppContextInterface>({
  appState: {
    darkMode: true,
    gridView: false,
    bootstrap: null,
    offLineMode: false,
    globalSearchTerm: "",
    sidebarCollapsed: true,
  },
});

export const AppProvider: FunctionComponent<BasicProps> = (props) => {
  const setLocalStorageItem = (itemName: string, value: any) => {
    let returnVal = false;
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "appState",
        JSON.stringify({ ...appState, [itemName]: value })
      );
      returnVal = true;
    }
    return returnVal;
  };
  const setMultiLocalStorageItem = (object: any) => {
    let returnVal = false;
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "appState",
        JSON.stringify({ ...appState, ...object })
      );
      returnVal = true;
    }
    return returnVal;
  };

  const [appState, setAppState] = useState({
    darkMode: true,
    gridView: false,
    bootstrap: null,
    offLineMode: false,
    globalSearchTerm: "",
    sidebarCollapsed: false,
  });

  const updateDarkMode = (value: boolean) => {
    setAppState((e) => {
      return { ...e, darkMode: value };
    });
    setLocalStorageItem("darkMode", value);
  };

  const updateOfflineMode = (value: boolean) => {
    setAppState((e) => {
      return { ...e, offLineMode: value };
    });
    setLocalStorageItem("offLineMode", value);
  };
  const updateGridView = (value: boolean) => {
    setAppState((e) => {
      return { ...e, gridView: value };
    });
    setLocalStorageItem("gridView", value);
  };
  const updateSidebarCollapsed = (value: boolean) => {
    setAppState((e) => {
      return { ...e, sidebarCollapsed: value };
    });
    setLocalStorageItem("sidebarCollapsed", value);
  };
  const multiUpdate = (object: {
    darkMode?: boolean;
    gridView?: boolean;
    bootstrap?: any;
    offLineMode?: boolean;
    sidebarCollapsed?: boolean;
  }) => {
    setAppState((e) => {
      return { ...e, ...object };
    });
    setMultiLocalStorageItem(object);
  };

  const saveBootstrap = (object: any) => {
    setAppState((e) => {
      return { ...e, bootstrap: object };
    });
  };
  const updateGlobalSearchTerm = (searchTerm: string) => {
    setAppState((e) => {
      return { ...e, globalSearchTerm: searchTerm };
    });
  };
  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        updateDarkMode,
        updateOfflineMode,
        updateGridView,
        multiUpdate,
        saveBootstrap,
        updateGlobalSearchTerm,
        updateSidebarCollapsed,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
