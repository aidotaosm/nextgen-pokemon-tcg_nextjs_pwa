import { useEffect } from "react";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
//import reportWebVitals from './reportWebVitals';
import "../src/css/global.css";
import { AppWrapper } from "../src/components/AppWrapper/AppWrapper";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("bootstrap"); //this is needed for accordion toggle etc
  }, []);
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  //reportWebVitals();
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}