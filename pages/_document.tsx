import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Pokemon TCG by OSM</title>
        <meta
          name="description"
          content="Browse cards from all of the Pokemon expansions!"
        />
        <meta charSet="utf-8" />
        {/* <meta name="viewport" content="width=device-width,initial-scale=1.0" /> */}
        <meta name="keywords" content="Pokemon, TCG" />
        <meta name="theme-color" content="#fff" />
        <meta name="author" content="Osama Almas Rahman" />
        <meta name="copyright" content="Osama Almas Rahman" />

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
        <meta property="og:url" content="https://pkmn-tcg-osm.vercel.app/" />
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

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo192png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
