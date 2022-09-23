import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { Fragment, FunctionComponent, useMemo } from "react";
import { SetComponent } from "../../../src/components/SetComponent/SetComponent";
import {
  BasicProps,
  CardsObjectProps,
} from "../../../src/models/GenericModels";
import { Helper } from "../../../src/utils/helper";
import { getAllSetCards, getExpansions } from "../../../src/utils/networkCalls";
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const qry = context.query;
//   return { props: { qry } };
// };

interface IParams extends ParsedUrlQuery {
  setId: string;
}

export const getStaticPaths: GetStaticPaths = async (qry) => {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const expansions = await getExpansions();
  let returnPaths: any[] = [];
  expansions.forEach((series) => {
    series.sets.forEach((set: any) => {
      if (set.id === "pop2") {
        set.id = "poptwo"; // this is done because pop2 is blocked by ad blocker
      }
      returnPaths.push({
        params: { setId: set.id },
      });
    });
  });
  if (process.env.APP_ENV == "local") {
    returnPaths.splice(1, returnPaths.length - 1);
  }
  //process.env.NODE_ENV
  // console.log(process.env);
  // console.log(returnPaths);
  // Props returned will be passed to the page component
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: returnPaths,
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { setId } = context.params as IParams;
  // this is done because pop2 is blocked by ad blocker
  let correctedSetId = setId == "poptwo" ? "pop2" : setId;
  const cardsObject = await getAllSetCards(correctedSetId);
  console.log(setId);
  console.log(cardsObject?.data?.length);
  if (!cardsObject?.data?.length) {
    return { notFound: true, revalidate: 60 };
  } else {
    return { props: { cardsObject }, revalidate: 60 * 60 * 24 };
  }
};

const Set: FunctionComponent<CardsObjectProps> = ({ cardsObject }) => {
  const baseURL = useMemo(() => Helper.getBaseDomainServerSide(), []);
  const title = cardsObject?.data[0].set.name;
  const description =
    title + " expansion of " + cardsObject?.data[0].set.series;
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} key="description" />
        <meta property="og:title" content={title} key="og:title" />
        <meta
          property="og:description"
          content={description}
          key="og:description"
        />
        <meta
          property="og:image"
          content="/images/expansions_image.jpg"
          key="og:image"
        />
        <meta
          property="og:url"
          content={
            baseURL +
            "set/" +
            (cardsObject?.data[0].set.id == "pop2"
              ? "poptwo"
              : cardsObject?.data[0].set.id)
          }
          key="og:url"
        />
        <meta name="twitter:title" content={title} key="twitter:title" />
        <meta
          name="twitter:description"
          content={description}
          key="twitter:description"
        />
        <meta
          name="twitter:image"
          content="/images/pokemon_tcg_base_image.jpg"
          key="twitter:image"
        />
      </Head>
      <SetComponent cardsObject={cardsObject} />
    </Fragment>
  );
};
export default Set;
