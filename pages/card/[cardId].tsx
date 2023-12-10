import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { Fragment, FunctionComponent } from "react";
import { CardComponent } from "../../src/components/CardComponent/CardComponent";
import { CardObjectProps } from "../../src/models/GenericModels";
import { Helper } from "../../src/utils/helper";
import { getCardById } from "../../src/utils/networkCalls";

interface IParams extends ParsedUrlQuery {
  cardId: string;
}
export const getStaticPaths: GetStaticPaths = async (qry) => {
  // might render some cards on build time
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { cardId } = context.params as IParams;
  console.log(cardId, "omg");
  const cardObject = await getCardById(cardId);
  if (!cardObject?.id) {
    return { notFound: true, revalidate: 60 * 60 * 24 };
  } else {
    return { props: { cardObject }, revalidate: 60 * 60 * 24 };
  }
};
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { cardId } = context.params as IParams;
//   const cardObject = await getCardById(cardId);
//   if (!cardObject?.id) {
//     return { notFound: true };
//   } else {
//     return { props: { cardObject } };
//   }
// };

const Card: FunctionComponent<CardObjectProps> = (props) => {
  console.log(props, "props");
  let { cardObject } = props;
  if (cardObject) {
    const title = cardObject.name + " - " + cardObject.set.name;
    const description =
      title + ", from the " + cardObject.set.series + " series.";

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
            content={cardObject.images.large}
            key="og:image"
          />
          <meta property="og:image:width" content="734" key="og:image:width" />
          <meta
            property="og:image:height"
            content="1024"
            key="og:image:height"
          />
          <meta
            property="og:url"
            content={Helper.getBaseDomainServerSide() + "card/" + cardObject.id}
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
            content={cardObject.images.large}
            key="twitter:image"
          />
        </Head>
        <CardComponent cardObject={cardObject} />
      </Fragment>
    );
  }
  return <>wtf</>;
};
export default Card;
