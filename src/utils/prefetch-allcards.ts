import { Dispatch, SetStateAction } from "react";
import { IPFS_ALLCARDS_JSON_URL } from "./../constants/constants";
import { getAllCardsJSONFromFileBaseIPFS } from "./networkCalls";
import { SpecialSetNames } from "../models/Enums";
export const triggerAllCardsPreCache = async (
  callbackSuccess?: Function,
  callbackFailed?: Function
) => {
  let openedCache = await caches.open("cross-origin");
  let cacheKEys = await openedCache.keys();
  const cachedResponse = cacheKEys.find((x) => {
    if (x.url === IPFS_ALLCARDS_JSON_URL) {
      return x;
    }
  });
  if (!cachedResponse) {
    //console.log("all cards cache not found - preloading");
    getAllCardsJSONFromFileBaseIPFS()
      .then((x) => {
        //precache all cards for maxAgeSeconds: 24 * 60 * 60 * 30, // 1 month
        if (typeof callbackSuccess === "function") {
          callbackSuccess();
        }
      })
      .catch((x) => {
        if (typeof callbackFailed === "function") {
          callbackFailed();
        }
      });
  } else {
    if (typeof callbackSuccess === "function") {
      callbackSuccess();
    }
  }
};
export const checkIfUrlsAreCached = async (
  cacheName: string,
  urls:
    | string[]
    | {
        url: string;
        seriesIndex: number;
        setIndex: number;
      }[],
  type: "stringArray" | "objectArray",
  callbackSuccess?: Function
) => {
  let openedCache = await caches.open(cacheName);
  let cacheKEys = await openedCache.keys();
  let returnVals: { url: string; isCached: boolean }[] = [];
  if (cacheKEys.length) {
    if (type === "stringArray") {
      let typedUrls = urls as string[];
      typedUrls.forEach((x) => {
        const cachedResponse = cacheKEys.find((y) => {
          if (y.url === x) {
            return x;
          }
        });
        if (cachedResponse) {
          returnVals.push({ url: x, isCached: true });
          if (typeof callbackSuccess === "function") {
            callbackSuccess();
          }
        } else {
          returnVals.push({ url: x, isCached: false });
        }
      });
    } else {
      let typedUrls = urls as {
        url: string;
        seriesIndex: number;
        setIndex: number;
      }[];
      console.log(typedUrls, "typedUrls");
      console.log(cacheKEys, "cacheKEys");
      typedUrls.forEach((x) => {
        const cachedResponse = cacheKEys.find((y) => {
          if (y.url.includes(x.url)) {
            return x;
          }
        });
        if (cachedResponse) {
          returnVals.push({ url: x.url, isCached: true });
          if (typeof callbackSuccess === "function") {
            callbackSuccess(x.seriesIndex, x.setIndex);
          }
        } else {
          returnVals.push({ url: x.url, isCached: false });
        }
      });
    }
  }
  return returnVals;
};
export const chechSetAndSearchPreCacheStatus = async (
  setsBySeries: any[],
  setSearchPageDownloaded: Dispatch<SetStateAction<"no" | "loading" | "yes">>,
  setTotalNumberOfSetsDone: Dispatch<SetStateAction<number>>,
  setSetsBySeries: Dispatch<SetStateAction<any[]>>
) => {
  //search Check
  const searchCacheCheckResult = await checkIfUrlsAreCached(
    "cross-origin",
    [IPFS_ALLCARDS_JSON_URL],
    "stringArray"
  );
  if (searchCacheCheckResult[0]?.isCached) {
    setSearchPageDownloaded("yes");
  } else {
    setSearchPageDownloaded("no");
  }
  // set check
  const setUrlsWithSeriesAndSetIndex: {
    url: string;
    seriesIndex: number;
    setIndex: number;
  }[] = [];
  seriesLoop: for (
    let seriesIndex = 0;
    seriesIndex < setsBySeries.length;
    seriesIndex++
  ) {
    setLoop: for (
      let setIndex = 0;
      setIndex < setsBySeries[seriesIndex].sets.length;
      setIndex++
    ) {
      setUrlsWithSeriesAndSetIndex.push({
        url:
          "/set/" +
          (setsBySeries[seriesIndex].sets[setIndex].id == SpecialSetNames.pop2
            ? SpecialSetNames.poptwo + ".json?setId=" + SpecialSetNames.poptwo
            : setsBySeries[seriesIndex].sets[setIndex].id +
              ".json?setId=" +
              setsBySeries[seriesIndex].sets[setIndex].id),
        seriesIndex,
        setIndex,
      });
    }
  }

  const setCacheCheckResult = await checkIfUrlsAreCached(
    "next-data",
    setUrlsWithSeriesAndSetIndex,
    "objectArray",
    (seriesIndex: number, setIndex: number) => {
      setsBySeries[seriesIndex].sets[setIndex].done = true;
      //console.log(seriesIndex, setIndex, "is matching");
    }
  );
  let tempNumberOfDoneSets = 0;
  seriesLoop: for (
    let seriesIndex = 0;
    seriesIndex < setsBySeries.length;
    seriesIndex++
  ) {
    const listOfCachedSetsOfThisSeries = setsBySeries[seriesIndex].sets.filter(
      (s: any) => s.done
    );
    if (
      listOfCachedSetsOfThisSeries.length ===
      setsBySeries[seriesIndex].sets.length
    ) {
      setsBySeries[seriesIndex].prefetchStatus = "done";
      tempNumberOfDoneSets += listOfCachedSetsOfThisSeries.length;
    }
  }
  setTotalNumberOfSetsDone(tempNumberOfDoneSets);
  //console.log(setsBySeries, "setsBySeries");
  setSetsBySeries([...setsBySeries]);
};
