import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { SetComponent } from "../src/components/SetComponent/SetComponent";
import { SpecialSetNames } from "../src/models/Enums";
import { CardsObjectProps } from "../src/models/GenericModels";
import { Helper } from "../src/utils/helper";
import { getAllCards } from "../src/utils/networkCalls";
import allCardsJson from "../src/Jsons/AllCards.json";

interface IParams extends ParsedUrlQuery {}

export const getStaticProps: GetStaticProps = async (context) => {
  //  const cardsObject = { data: JSON.parse((allCardsJson as any).cards) };
  const cardsObject = { data: await getAllCards() };
  console.log(cardsObject?.data?.length);
  if (!cardsObject?.data?.length) {
    return { notFound: true, revalidate: 60 };
  } else {
    return { props: { cardsObject }, revalidate: 60 * 60 * 24 * 2 }; // 2 days
  }
};

const SearchPage: FunctionComponent<CardsObjectProps> = ({ cardsObject }) => {
  console.log(cardsObject);
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
          content="/images/pokemon_tcg_base_image.jpg"
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
          content="/images/pokemon_tcg_base_image.jpg"
          key="twitter:image"
        />
      </Head>
      <SetComponent cardsObject={cardsObject} isSearchPage={true} />
    </Fragment>
  );
};
export default SearchPage;
