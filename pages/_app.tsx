import { Fragment, useCallback, useEffect, useMemo } from "react";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
//import reportWebVitals from './reportWebVitals';
import "../src/css/default.css";
import "../src/css/dark-mode.css";
import "../src/css/global.css";
import { AppWrapper } from "../src/components/AppWrapper/AppWrapper";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AppProvider } from "../src/contexts/AppContext";
import Head from "next/head";
import { Helper } from "../src/utils/helper";
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
  const baseURL = useMemo(() => Helper.getBaseDomainServerSide(), []);
  return (
    <AppProvider>
      <AppWrapper>
        <Fragment>
          <Head>
            <title>Pokemon TCG by OSM</title>
            <meta
              name="description"
              content="Browse cards from all of the Pokemon expansions!"
            />
            <meta property="og:type" content="games.plays" />
            <meta property="og:title" content="Pokemon TCG by OSM" />
            <meta
              property="og:description"
              content="Browse cards from all of the Pokemon expansions!"
            />
            <meta
              property="og:image"
              content="/images/pokemon_tcg_base_image.webp"
            />
            <meta property="og:url" content={baseURL} />
            <meta property="og:site_name" content="Pokemon TCG by OSM" />

            <meta name="twitter:title" content="Pokemon TCG by OSM" />
            <meta
              name="twitter:description"
              content="Browse cards from all of the Pokemon expansions!"
            />
            <meta
              name="twitter:image"
              content="/images/pokemon_tcg_base_image.webp"
            />
          </Head>
          <Component {...pageProps} />
        </Fragment>
      </AppWrapper>
    </AppProvider>
  );
}
