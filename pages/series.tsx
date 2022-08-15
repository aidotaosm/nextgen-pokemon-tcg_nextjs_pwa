import { GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { ExpansionsComponent } from "../src/components/ExpansionsComponent";
import { CardObjectProps, SeriesArrayProps } from "../src/models/GenericModels";
import { getExpansions } from "../src/utils/networkCalls";
export const getStaticProps: GetStaticProps = async () => {
  let arrayOfSeries = await getExpansions();
  return { props: { arrayOfSeries }, revalidate: 60 * 60 };
};
const Series: FunctionComponent<SeriesArrayProps> = ({ arrayOfSeries }) => {
  return <ExpansionsComponent arrayOfSeries={arrayOfSeries} />;
};
export default Series;
