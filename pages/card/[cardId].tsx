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
        <meta name="description" content={description} key="description" />
        <meta property="og:title" content={title} key="og:title" />
        <meta
          property="og:description"
          content={description}
          key="og:description"
        />
        <meta
          property="og:image"
          content={cardObject.images.small}
          key="og:image"
        />
        <meta
          property="og:url"
          content={baseURL + "card/" + cardObject.id}
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
          content={cardObject.images.small}
          key="twitter:image"
        />
      </Head>
      <CardComponent cardObject={cardObject} />
    </Fragment>
  );
};
export default Set;
