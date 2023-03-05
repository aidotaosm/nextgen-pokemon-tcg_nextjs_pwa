import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
} from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { Fragment, FunctionComponent } from "react";
import { SetComponent } from "../src/components/SetComponent/SetComponent";
import { CardsObjectProps } from "../src/models/GenericModels";
import { Helper } from "../src/utils/helper";
import importedFirstPageOfCardsWithTotalCount from "../src/InternalJsons/firstPageOfCardsWithTotalCount.json";
interface IParams extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps = async (context) => {
  // const dynamicallyImportedJson: any = (
  //   await import("../public/Jsons/AllCards.json")
  // ).default;

  // let parsedAllCards = dynamicallyImportedJson;
  // let firstPageOfCards = parsedAllCards.slice(0, DEFAULT_PAGE_SIZE);
  //console.log(firstPageOfCards);
  const cardsObject = {
    data: importedFirstPageOfCardsWithTotalCount.firstPageOfCards,
    totalCount: importedFirstPageOfCardsWithTotalCount.totalCount,
  };
  //const cardsObject = { data: await getAllCards() };

  if (!cardsObject?.data?.length) {
    return { notFound: true, revalidate: 60 };
  } else {
    return { props: { cardsObject }, revalidate: 60 * 60 * 24 * 2 }; // 2 days
  }
};
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const dynamicallyImportedJson: any = (
//     await import("../public/Jsons/AllCards.json")
//   ).default;
//   let parsedAllCards = JSON.parse(dynamicallyImportedJson.cards);
//   let requestedPageIndex = context.query.page;
//   let requestedSearchValue = context.query.search as string;
//   let returnedPageOfCards: any[] = [];
//   if (requestedSearchValue && typeof requestedSearchValue === "string") {
//     parsedAllCards = parsedAllCards.filter((item: any) => {
//       return item.name
//         .toLowerCase()
//         .includes(requestedSearchValue.toLowerCase());
//     });
//   }
//   if (
//     requestedPageIndex &&
//     !isNaN(+requestedPageIndex) &&
//     !isNaN(parseFloat(requestedPageIndex.toString())) &&
//     parsedAllCards.length
//   ) {
//     let from = +requestedPageIndex * DEFAULT_PAGE_SIZE;
//     let to = (+requestedPageIndex + 1) * DEFAULT_PAGE_SIZE;
//     returnedPageOfCards = parsedAllCards.slice(from, to);
//   } else {
//     returnedPageOfCards = parsedAllCards.slice(0, DEFAULT_PAGE_SIZE);
//   }
//   const cardsObject = {
//     data: returnedPageOfCards,
//     totalCount: parsedAllCards.length,
//   };
//   if (!cardsObject.data) {
//     return { notFound: true };
//   } else {
//     return { props: { cardsObject } };
//   }
// };

const SearchPage: FunctionComponent<CardsObjectProps> = ({ cardsObject }) => {
  // console.log(cardsObject);
  return (
    <Fragment>
      <Head>
        <title>Fastest Pokemon card search!</title>
        <meta
          name="description"
          content="Search through all Pokemon cards ever printed, fast!"
          key="description"
        />
        <meta
          property="og:title"
          content="Fastest Pokemon card search!"
          key="og:title"
        />
        <meta
          property="og:description"
          content="Search through all Pokemon cards ever printed, fast!"
          key="og:description"
        />
        <meta
          property="og:image"
          content="/images/pokemon_tcg_base_image.webp"
          key="og:image"
        />
        <meta
          property="og:url"
          content={Helper.getBaseDomainServerSide() + "search"}
          key="og:url"
        />
        <meta
          name="twitter:title"
          content="Fastest Pokemon card search!"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="Search through all Pokemon cards ever printed, fast!"
          key="twitter:description"
        />
        <meta
          name="twitter:image"
          content="/images/pokemon_tcg_base_image.webp"
          key="twitter:image"
        />
      </Head>
      <SetComponent cardsObject={cardsObject} isSearchPage={true} />
    </Fragment>
  );
};
export default SearchPage;
