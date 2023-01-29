import React, { useState, createContext, FunctionComponent } from "react";
import { flushSync } from "react-dom";
import { BasicProps } from "../models/GenericModels";
import { Helper } from "../utils/helper";

interface AppContextInterface {
  appState: any;
  setAppState: any;
  updateDarkMode: (e: boolean) => void;
  updateOfflineMode: (e: boolean) => void;
  updateGridView: (e: boolean) => void;
  multiUpdate: (e: any) => void;
  saveBootstrap: (e: any) => void;
}

export const AppContext = createContext<AppContextInterface | null>(null);

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

  const multiUpdate = (object: any) => {
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
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
