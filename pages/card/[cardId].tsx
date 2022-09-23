import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { Fragment, FunctionComponent, useMemo } from "react";
import { CardComponent } from "../../src/components/CardComponent/CardComponent";
import { CardObjectProps } from "../../src/models/GenericModels";
import { Helper } from "../../src/utils/helper";
import { getCardById } from "../../src/utils/networkCalls";

interface IParams extends ParsedUrlQuery {
  cardId: string;
}
//export const getStaticProps: GetStaticProps = async (context) => {
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cardId } = context.params as IParams;
  const cardObject = await getCardById(cardId);
  console.log(cardObject);
  if (!cardObject?.id) {
    return { notFound: true };
  } else {
    return { props: { cardObject } };
  }
};

const Set: FunctionComponent<CardObjectProps> = ({ cardObject }) => {
  const title = cardObject.name + " from " + cardObject.set.name;
  const description = title + ", expansion of " + cardObject.set.series;
  const baseURL = useMemo(() => Helper.getBaseDomainServerSide(), []);
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={cardObject.images.small} />
        <meta property="og:url" content={baseURL + "card/" + cardObject.id} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={cardObject.images.small} />
      </Head>
      <CardComponent cardObject={cardObject} />
    </Fragment>
  );
};
export default Set;
