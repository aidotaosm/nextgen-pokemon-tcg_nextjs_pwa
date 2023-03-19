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
    <div className="container">
      <div className="d-flex align-items-center justify-content-center">
        <div className="mb-4 search-wrapper">
          <LocalSearchComponent
            setSearchValueFunction={setSearchValueFunction}
            initialPlaceHolder={"Global search e.g. "}
            defaultSearchTerm={searchValue}
          />
        </div>
        <div style={{ width: "15rem" }}>
          <h4 className=" text-decoration-none mb-3 text-center">
            Browse Cards
          </h4>
          <Link href="/series" className="un-styled-anchor cursor-pointer ">
            <div className="flex-grow-1 flex-column justify-content-center d-flex">
              <ImageComponent
                src={swsh125}
                alt={"Browse cards"}
                className="w-100 h-auto"
                lqImageUnOptimize={true}
              />
            </div>
          </Link>
        </div>
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
