import { GetStaticProps } from "next";
import Head from "next/head";
import { Fragment, FunctionComponent, useMemo } from "react";
import { ExpansionsComponent } from "../src/components/ExpansionsComponent/ExpansionsComponent";
import { SeriesArrayProps } from "../src/models/GenericModels";
import { Helper } from "../src/utils/helper";
import { getExpansions } from "../src/utils/networkCalls";
export const getStaticProps: GetStaticProps = async () => {
  let arrayOfSeries = await getExpansions();
  return { props: { arrayOfSeries }, revalidate: 60 * 60 };
};
const Series: FunctionComponent<SeriesArrayProps> = ({ arrayOfSeries }) => {
  const baseURL = useMemo(() => Helper.getBaseDomainServerSide(), []);
  return (
    <Fragment>
      <Head>
        <title>Pokemon TCG Expansions</title>
        <meta
          name="description"
          content="Browse cards from all of the Pokemon expansions!"
        />
        <meta property="og:title" content="Pokemon TCG by Expansions" />
        <meta
          property="og:description"
          content="Browse cards from all of the Pokemon expansions!"
        />
        <meta property="og:image" content="/images/expansions_image.jpg" />
        <meta property="og:url" content={baseURL + "series"} />
        <meta name="twitter:title" content="Pokemon TCG Expansions" />
        <meta
          name="twitter:description"
          content="Browse cards from all of the Pokemon expansions!"
        />
        <meta
          name="twitter:image"
          content="/images/pokemon_tcg_base_image.jpg"
        />
      </Head>
      <ExpansionsComponent arrayOfSeries={arrayOfSeries} />
    </Fragment>
  );
};
export default Series;
