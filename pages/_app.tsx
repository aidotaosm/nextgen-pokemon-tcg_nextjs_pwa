import { useEffect } from "react";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
//import reportWebVitals from './reportWebVitals';
import "../src/css/global.css";
import "../src/css/dark-mode.css";
import { AppWrapper } from "../src/components/AppWrapper/AppWrapper";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AppProvider } from "../src/contexts/AppContext";
//import { initServiceWorker } from "../public/initServiceWorker";
config.autoAddCss = false;

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("bootstrap"); //this is needed for accordion toggle etc
    // initServiceWorker();
  }, []);
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  //reportWebVitals();
  return (
    <AppProvider>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </AppProvider>
  );
}
