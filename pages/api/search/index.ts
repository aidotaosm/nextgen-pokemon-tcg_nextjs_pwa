//import { getAllCards } from "../../../src/utils/networkCalls";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PAGE_SIZE } from "../../../src/constants/constants";
import allCardsJson from "../../../src/Jsons/AllCards.json";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let parsedAllCards = JSON.parse((allCardsJson as any).cards);
  let requestedPageIndex = req.query.page;
  let returnedPageOfCards: any[] = [];
  if (
    requestedPageIndex &&
    !isNaN(+requestedPageIndex) &&
    !isNaN(parseFloat(requestedPageIndex.toString()))
  ) {
    let from = +requestedPageIndex * DEFAULT_PAGE_SIZE;
    let to = (+requestedPageIndex + 1) * DEFAULT_PAGE_SIZE;
    returnedPageOfCards = parsedAllCards.slice(from, to);
  } else {
    returnedPageOfCards = parsedAllCards.slice(0, DEFAULT_PAGE_SIZE);
  }

  const cardsObject = {
    data: returnedPageOfCards,
    totalCount: parsedAllCards.length,
  };
  // console.log(selectedMeta, "selectedMeta");
  if (cardsObject) {
    res.status(200).json(cardsObject);
  } else {
    res.status(404).json({ message: "error" });
  }
}
