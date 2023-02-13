//import { getAllCards } from "../../../src/utils/networkCalls";
//import allCardsJson from "../../../src/Jsons/AllCards.json";
export default async function handler(req: any, res: any) {
  let allCards = {}; //JSON.parse((allCardsJson as any).cards);
  // console.log(selectedMeta, "selectedMeta");
  if (allCards) {
    res.status(200).json(allCards);
  } else {
    res.status(404).json({ message: "error" });
  }
}
