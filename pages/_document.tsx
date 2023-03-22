import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* <meta name="viewport" content="width=device-width,initial-scale=1.0" /> */}
        <meta name="keywords" content="Pokemon, TCG" />
        <meta name="theme-color" content="#fff" />
        <meta name="author" content="Osama Almas Rahman" />
        <meta name="copyright" content="Osama Almas Rahman" />

        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut icon" href="/images/android-chrome-192x192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
