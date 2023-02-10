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
  const cardsObject = { data: JSON.parse((allCardsJson as any).cards) };
  console.log(cardsObject?.data?.length);
  if (!cardsObject?.data?.length) {
    return { notFound: true, revalidate: 60 };
  } else {
    return { props: { cardsObject }, revalidate: 60 * 60 * 24 };
  }
};

const Set: FunctionComponent<CardsObjectProps> = ({ cardsObject }) => {
  const [state, stState] = useState<any[]>([]);
  console.log(cardsObject);
  const title = cardsObject?.data[0].set.name;
  const description =
    title + " set from the" + cardsObject?.data[0].set.series + " expansion";
  useEffect(() => {
    // getAllCards().then((x) => {
    //   console.log(x);
    //   stState(x);
    // });
  }, []);
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
export default Set;
