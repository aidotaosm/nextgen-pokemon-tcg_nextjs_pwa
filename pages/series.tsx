import { GetStaticProps } from "next";
import Head from "next/head";
import { Fragment, FunctionComponent } from "react";
import { ExpansionsComponent } from "../src/components/ExpansionsComponent/ExpansionsComponent";
import { SeriesArrayProps } from "../src/models/GenericModels";
import { Helper } from "../src/utils/helper";
import seriesNetworkCall from "../src/utils/series-netwrokcall";
export const getStaticProps: GetStaticProps = async () => {
  const response = await seriesNetworkCall();
  return {
    props: response,
    revalidate: 60 * 60,
  };
};
const Series: FunctionComponent<SeriesArrayProps> = ({
  arrayOfSeries,
  totalNumberOfSets,
}) => {
  return (
    <Fragment>
      <Head>
        <title>Pokemon TCG Expansions</title>
        <link
          rel="canonical"
          href={Helper.getBaseDomainServerSide() + "series"}
          key="canonical"
        />
        <meta
          name="description"
          content="Browse through all the Pokemon TCG expansions!"
          key="description"
        />
        <meta
          property="og:title"
          content="Pokemon TCG Expansions"
          key="og:title"
        />
        <meta
          property="og:description"
          content="Browse through all the Pokemon TCG expansions!"
          key="og:description"
        />
        <meta
          property="og:image"
          content="/images/expansions_image.jpg"
          key="og:image"
        />

        <meta
          property="og:url"
          content={Helper.getBaseDomainServerSide() + "series"}
          key="og:url"
        />
        <meta
          name="twitter:title"
          content="Pokemon TCG Expansions"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="Browse through all the Pokemon TCG expansions!"
          key="twitter:description"
        />
        <meta
          name="twitter:image"
          content="/images/expansions_image.jpg"
          key="twitter:image"
        />
      </Head>
      <ExpansionsComponent
        arrayOfSeries={arrayOfSeries}
        totalNumberOfSets={totalNumberOfSets}
      />
    </Fragment>
  );
};
export default Series;
