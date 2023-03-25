import { GetStaticProps } from "next";
import Head from "next/head";
import { Fragment, FunctionComponent } from "react";
import { ExpansionsComponent } from "../src/components/ExpansionsComponent/ExpansionsComponent";
import { SeriesArrayProps } from "../src/models/GenericModels";
import { Helper } from "../src/utils/helper";
import { getExpansions } from "../src/utils/networkCalls";
export const getStaticProps: GetStaticProps = async () => {
  let { arrayOfSeries, sets } = await getExpansions();
  let totalNumberOfSets = 0;
  if (arrayOfSeries && arrayOfSeries[0]) {
    arrayOfSeries[0].isOpen = true;
    totalNumberOfSets = arrayOfSeries
      .map((series) => (totalNumberOfSets = series.sets.length))
      .reduce((partialSum, a) => partialSum + a, 0);
  }

  return {
    props: { arrayOfSeries, totalNumberOfSets },
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
