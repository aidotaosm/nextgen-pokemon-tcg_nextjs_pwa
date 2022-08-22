import React, { useState, createContext, FunctionComponent } from "react";
import { BasicProps } from "../models/GenericModels";

interface AppContextInterface {
  appState: any;
  setAppState: any;
  updateDarkMode: any;
}
interface LocalAppInterface {
  darkMode: boolean;
}
export const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider: FunctionComponent<BasicProps> = (props) => {
  const setLocalStorageItem = (itemName: string, value: any) => {
    console.log(itemName, value);
    let returnVal = false;
    if (typeof window !== "undefined") {
      console.log(itemName, value);
      localStorage.setItem(itemName, value);
      returnVal = true;
    }
    return returnVal;
  };
  const getLocalStorageItem = (itemName: any) => {
    let parsedItem = null;
    if (typeof window !== "undefined") {
      parsedItem = JSON.parse(localStorage.getItem(itemName) || "{}");
    }
    return parsedItem;
  };
  let localAppState: LocalAppInterface = getLocalStorageItem("appState");
  let darkModeValue =
    localAppState?.hasOwnProperty("darkMode") &&
    typeof localAppState.darkMode === "boolean"
      ? localAppState.darkMode
      : true;
  console.log(darkModeValue);
  const [appState, setAppState] = useState({
    darkMode: darkModeValue,
  });
  const updateDarkMode = (value: boolean) => {
    setLocalStorageItem("darkMode", value);
    setAppState((e) => {
      console.log(value);
      return { ...e, darkMode: value };
    });
  };
  return (
    <AppContext.Provider value={{ appState, setAppState, updateDarkMode }}>
      {props.children}
    </AppContext.Provider>
  );
};
