import { FunctionComponent } from "react";

export const IF: FunctionComponent<any> = ({ condition, children }) => {
  return <>{condition ? children : <></>}</>;
};
