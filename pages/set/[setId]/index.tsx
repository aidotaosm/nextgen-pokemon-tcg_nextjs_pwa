import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { Fragment, FunctionComponent } from "react";
import { SetComponent } from "../../../src/components/SetComponent/SetComponent";
import { SpecialSetNames } from "../../../src/models/Enums";
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
  const dynamicallyImportedAllCards = (
    await import("../../../src/InternalJsons/AllCards.json")
  ).default as any[];
  // const { arrayOfSeries, sets } = await getExpansions();
  let returnPaths: any[] = [];
  let allSetIds: string[] = dynamicallyImportedAllCards.map(
    (x: any) => x.set.id
  );
  let uniqueItems: string[] = Array.from(new Set(allSetIds));
  returnPaths = uniqueItems.map((x) => {
    return {
      params: {
        setId: x,
      },
    };
  });
  // arrayOfSeries.forEach((series) => {
  //   series.sets.forEach((set: any) => {
  //     if (set.id === SpecialSetNames.pop2) {
  //       set.id = SpecialSetNames.poptwo; // this is done because pop2 is blocked by ad blocker
  //     }
  //     returnPaths.push({
  //       params: { setId: set.id },
  //     });
  //   });
  // });
  // if (process.env.APP_ENV == "local") {
  //   returnPaths.splice(1, returnPaths.length - 1);
  // }
  //process.env.NODE_ENV
  //console.log(process.env);
  // console.log(returnPaths);
  return {
    paths: returnPaths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const dynamicallyImportedAllCards = (
    await import("../../../src/InternalJsons/AllCards.json")
  ).default as any[];
  const { setId } = context.params as IParams;
  // this is done because pop2 is blocked by ad blocker
  let correctedSetId =
    setId == SpecialSetNames.poptwo ? SpecialSetNames.pop2 : setId;
  // const cardsObject = await getAllSetCards(correctedSetId);
  const setCards = dynamicallyImportedAllCards.filter((x: any) => {
    if (x.set.id === correctedSetId) {
      return x;
    }
  });
  const cardsObject = {
    data: setCards,
    totalCount: setCards.length,
  };
  if (!cardsObject?.data?.length) {
    return { notFound: true, revalidate: 60 };
  } else {
    return { props: { cardsObject }, revalidate: 60 * 60 * 24 };
  }
};

const SetPage: FunctionComponent<CardsObjectProps> = ({ cardsObject }) => {
  const title = cardsObject?.data[0].set.name;
  const description =
    title + " set from the " + cardsObject?.data[0].set.series + " series";
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
          content={cardsObject?.data[0].set?.images?.logo}
          key="og:image"
        />
        <meta
          property="og:url"
          content={
            Helper.getBaseDomainServerSide() +
            "set/" +
            (cardsObject?.data[0].set.id == SpecialSetNames.pop2
              ? SpecialSetNames.poptwo
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
          content={cardsObject?.data[0].set?.images?.logo}
          key="twitter:image"
        />
      </Head>
      <SetComponent cardsObject={cardsObject} />
    </Fragment>
  );
};
export default SetPage;
