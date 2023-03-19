import { ImageComponent } from "../src/components/ImageComponent/ImageComponent";
//import PokemonTCGCardsLaidOut from "../images/Pokemon-TCG-Cards-Laid-Out.webp";
//import codeRedemption from "../images/code-redemption-169.jpg";
//import buildPokemonTcgDecks from "../images/build-pokemon-tcg-decks-169-en.jpg";
import swsh125 from "../images/swsh125-preview-cards-1-169-en.jpg";

import Link from "next/link";
import { GetStaticProps } from "next";
import { Fragment, useContext, useEffect, useState } from "react";
import { Helper } from "../src/utils/helper";
import { useRouter } from "next/router";
import { AppContext } from "../src/contexts/AppContext";
import { LocalSearchComponent } from "../src/components/LocalSearchComponent/LocalSearchComponent";
import { CarouselProvider } from "pure-react-carousel";
import CarouselSlider from "../src/components/CaouselSlider/CarouselSlider";

export const getStaticProps: GetStaticProps = async (context) => {
  const dynamicallyImportedJson: any = (
    await import("../public/Jsons/AllCards.json")
  ).default;

  let parsedAllCards = dynamicallyImportedJson;
  let fiveRandomCards = [];
  for (let i = 0; i < 10; i++) {
    let randomIndex = Helper.randDelay(0, parsedAllCards.length - 1);
    fiveRandomCards.push(parsedAllCards[randomIndex]);
  }

  return { props: { setCards: fiveRandomCards }, revalidate: 60 * 60 }; // 60 minutes
};

const Index = ({ setCards }: any) => {
  const [searchValue, setSearchValue] = useState("");
  const [slideCount, setSlideCount] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselLoadingDone, setCarouselLoadingDone] = useState(true);
  const { appState, updateGlobalSearchTerm } = useContext(AppContext);
  let router = useRouter();
  const setSearchValueFunction = (
    value: string,
    eventType: "onChange" | "submit"
  ) => {
    if (eventType === "submit") {
      updateGlobalSearchTerm?.(value || "");
      router.push("/search");
    }
    setSearchValue(value);
  };

  return (
    <div className="container d-flex flex-column justify-content-center">
      <h2 className="text-center mb-3">Next generation Pokemon TCG</h2>
      <div className="row row-cols-1 row-cols-sm-2 mb-3">
        <div className=" d-flex align-items-center col mb-3 mb-sm-0">
          <div className="p-4 w-100  rounded border-light-gray">
            <LocalSearchComponent
              setSearchValueFunction={setSearchValueFunction}
              initialPlaceHolder={"Global search e.g. "}
              defaultSearchTerm={searchValue}
            />
          </div>
        </div>
        <Link href="/series" className="un-styled-anchor cursor-pointer col ">
          <div className=" d-lg-flex align-items-center flex-column flex-lg-row justify-content-center">
            <div className="flex-grow-1 ms-lg-3 text-decoration-none d-block d-lg-none mb-3 mb-lg-0 ">
              <h4 className="text-center">Browse Cards</h4>
              <p className="mb-0 text-center">
                Browse all expansions of Pokemon TCG, search and filter through
                your desired cards and more!
              </p>
            </div>
            <div className="flex-shrink-0 media-image">
              <ImageComponent
                src={swsh125}
                alt={"Browse cards"}
                className="w-100 h-auto rounded"
                lqImageUnOptimize={true}
              />
            </div>
            <div className="flex-grow-1 ms-lg-3 text-decoration-none d-none d-lg-block">
              <h4>Browse Cards</h4>
              <p className="mb-0">
                Browse all expansions of Pokemon TCG, search and filter through
                your desired cards and more!
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="">
        <h4 className="mb-3 text-center">Today's Featured Cards!</h4>
        <div
          className={
            "carousel-container " +
            (carouselLoadingDone ? "carousel-loading" : "")
          }
        >
          <CarouselProvider
            hasMasterSpinner={carouselLoadingDone}
            visibleSlides={slideCount}
            totalSlides={setCards.length}
            step={2}
            currentSlide={currentSlide}
            naturalSlideWidth={100}
            naturalSlideHeight={125}
            isIntrinsicHeight={true}
            isPlaying={true}
            infinite={true}
          >
            <CarouselSlider
              setCarouselLoadingDone={setCarouselLoadingDone}
              carouselLoadingDone={carouselLoadingDone}
              setSlideCount={setSlideCount}
              setCurrentSlide={setCurrentSlide}
              setCards={setCards}
            />
          </CarouselProvider>
        </div>
      </div>
    </div>
  );
};
export default Index;
