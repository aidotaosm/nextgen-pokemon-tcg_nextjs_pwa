import { Fragment } from "react";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
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
  return (
    <AppProvider>
      <AppWrapper>
        <Fragment>
          <Head>
            <title>Pokemon TCG by OSM</title>
            <meta
              name="description"
              content="Browse Pokemon cards. Build your deck (coming soon). Play TCG with your friends (coming later)!"
              key="description"
            />
            <meta property="og:type" content="games.plays" />
            <meta
              property="og:title"
              content="Pokemon TCG by OSM"
              key="og:title"
            />
            <meta
              property="og:description"
              content="Browse Pokemon cards. Build your deck (coming soon). Play TCG with your friends (coming later)!"
              key="og:description"
            />
            <meta
              property="og:image"
              content="/images/pokemon_tcg_base_image.webp"
              key="og:image"
            />
            <meta
              property="og:image:width"
              content="1200"
              key="og:image:width"
            />
            <meta
              property="og:image:height"
              content="627"
              key="og:image:height"
            />

            <meta
              property="og:url"
              content={Helper.getBaseDomainServerSide()}
              key="og:url"
            />
            <meta property="og:site_name" content="Pokemon TCG by OSM" />

            <meta
              name="twitter:title"
              content="Pokemon TCG by OSM"
              key="twitter:title"
            />
            <meta
              name="twitter:description"
              content="Browse Pokemon cards. Build your deck (coming soon). Play TCG with your friends (coming later)!"
              key="twitter:description"
            />
            <meta
              name="twitter:image"
              content="/images/pokemon_tcg_base_image.webp"
              key="twitter:image"
            />
          </Head>
          <Component {...pageProps} />
        </Fragment>
      </AppWrapper>
    </AppProvider>
  );
}
