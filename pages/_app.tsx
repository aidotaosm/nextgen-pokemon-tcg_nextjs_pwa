import { StrictMode, useEffect } from "react";
import type { AppProps } from "next/app";
//enabling bootstrap from node_modules
import "bootstrap/dist/css/bootstrap.css";
//import reportWebVitals from './reportWebVitals';
import "../src/css/global.css";
import { AppWrapper } from "../src/components/AppWrapper/AppWrapper";
// import("@fortawesome/fontawesome-free/js/all.min.js");
import "@fortawesome/fontawesome-free/js/all.min.js";
export default function MyApp({ Component, pageProps }: AppProps) {
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA

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
