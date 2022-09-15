import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";
import { SetComponent } from "../../../src/components/SetComponent/SetComponent";
import { BasicProps, CardObjectProps } from "../../../src/models/GenericModels";
import { getAllSetCards, getExpansions } from "../../../src/utils/networkCalls";
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const qry = context.query;
//   return { props: { qry } };
// };

interface IParams extends ParsedUrlQuery {
  setId: string;
  page?: string;
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
  console.log(process.env);
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
    return { notFound: true };
  } else {
    return { props: { cardsObject }, revalidate: 60 * 60 * 24 * 30 };
  }
};

const Set: FunctionComponent<CardObjectProps> = ({ cardsObject }) => {
  return <SetComponent cardsObject={cardsObject} />;
};
export default Set;
