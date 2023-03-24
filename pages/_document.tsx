import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="keywords"
          content="Pokemon, TCG, Cards, Set, Expansion, Series, Trading, Card, Game, Search, Browse, Database, Filter"
        />
        <meta name="theme-color" content="#fff" />
        <meta name="author" content="Osama Almas Rahman" />
        <meta name="copyright" content="https://github.com/aidotaosm" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut icon" href="/images/android-chrome-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/images/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
