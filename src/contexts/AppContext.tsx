import React, { useState, createContext, FunctionComponent } from "react";
import { BasicProps } from "../models/GenericModels";

interface AppContextInterface {
  appState: any;
  setAppState: any;
}

export const AppContext = createContext<AppContextInterface | null>(null);

export const UserProvider: FunctionComponent<BasicProps> = (props) => {
  const [appState, setAppState] = useState({});
  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {props.children}
    </AppContext.Provider>
  );
};
