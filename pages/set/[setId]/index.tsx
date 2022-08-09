import { GetServerSideProps } from "next";
import { FunctionComponent } from "react";
import { SetComponent } from "../../../src/components/SetComponent";
import { BasicProps } from "../../../src/models/GenericModels";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const qry = context.query;
  console.log(qry);
  return { props: { qry } };
};
const Set: FunctionComponent<BasicProps> = ({ qry }) => {
  return <SetComponent qry={qry} />;
};
export default Set;
