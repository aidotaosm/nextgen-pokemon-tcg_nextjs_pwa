import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";
import { SetComponent } from "../../../src/components/SetComponent";
import { BasicProps, CardObjectProps } from "../../../src/models/GenericModels";
import { getAllSetCards, getExpansions } from "../../../src/utils/networkCalls";
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const qry = context.query;
//   return { props: { qry } };
// };

interface IParams extends ParsedUrlQuery {
  setId: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const expansions = await getExpansions();
  let returnPaths: any[] = [];
  expansions.forEach((series) => {
    series.sets.forEach((set: any) => {
      console.log(set.id);
      returnPaths.push({
        params: { setId: set.id },
      });
    });
  });
  // returnPaths.splice(10, returnPaths.length - 11);
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
  const cardsObject = await getAllSetCards(setId);
  return { props: { cardsObject }, revalidate: 60 * 60 * 24 * 30 };
};

const Set: FunctionComponent<CardObjectProps> = ({ cardsObject }) => {
  return <SetComponent cardsObject={cardsObject} />;
};
export default Set;
