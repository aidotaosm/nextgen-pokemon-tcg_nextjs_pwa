import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
// import { Analytics } from "@vercel/analytics/react";
import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment } from "react";
import { AppWrapper } from "../src/components/AppWrapper/AppWrapper";
import { AppProvider } from "../src/contexts/AppContext";
import "../src/css/dark-mode.css";
import "../src/css/default.css";
import "../src/css/fs-breakpoint-n.css";
import "../src/css/global.css";
import "pure-react-carousel/dist/react-carousel.es.css";
import { Helper } from "../src/utils/helper";
config.autoAddCss = false;
// import { StyleProvider } from '@ant-design/cssinjs';
// import '../public/antd.min.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AppWrapper>
        <Fragment>
          <Head>
            <title>NextGen Pokemon TCG</title>
            <meta
              name="description"
              content="The Next Generation Pokemon cards database. With offline support!"
              key="description"
            />
            <meta property="og:type" content="games.plays" />
            <meta
              property="og:title"
              content="NextGen Pokemon TCG"
              key="og:title"
            />
            <meta
              property="og:description"
              content="The Next Generation Pokemon cards database. With offline support!"
              key="og:description"
            />
            <meta
              property="og:image"
              content="/images/pokemon_tcg_base_image.webp"
              key="og:image"
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
            <meta
              property="og:site_name"
              content="The Next Generation Pokemon TCG database"
            />

            <meta
              name="twitter:title"
              content="NextGen Pokemon TCG"
              key="twitter:title"
            />
            <meta
              name="twitter:description"
              content="The Next Generation Pokemon cards database. With offline support!"
              key="twitter:description"
            />
            <meta
              name="twitter:image"
              content="/images/pokemon_tcg_base_image.webp"
              key="twitter:image"
            />
          </Head>
          {/* <StyleProvider hashPriority="high" ssrInline={true}> */}
          <Component {...pageProps} />
          {/* </StyleProvider> */}
          {/* <Analytics /> */}
        </Fragment>
      </AppWrapper>
    </AppProvider>
  );
}
