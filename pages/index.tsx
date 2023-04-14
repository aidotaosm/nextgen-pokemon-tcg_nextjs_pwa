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
import dynamicallyImportedJson from "../src/InternalJsons/AllCards.json";
//import dynamicallyImportedJson from "../src/InternalJsons/CardsOfTheDay.json";
export const getStaticProps: GetStaticProps = async (context) => {
  // let tenRandomCards = dynamicallyImportedJson;
  let tenRandomCards = [];
  for (let i = 0; i < 10; i++) {
    let randomIndex = Helper.randDelay(0, dynamicallyImportedJson.length - 1);
    tenRandomCards.push(dynamicallyImportedJson[randomIndex]);
  }
  return { props: { setCards: tenRandomCards }, revalidate: 60 * 60 * 24 }; // 60 minutes
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
    <div className="container mt-4">
      <h1 className="text-center h3">NextGen Pokemon TCG</h1>
      <h2 className="text-center mb-5 text-muted h5">
        The Next Generation Pokemon cards database. Fastest Pokemon card search experience out there! And with offline support!
      </h2>
      <div className="row row-cols-1 row-cols-sm-2 mb-5">
        <div className=" d-flex align-items-center col mb-5 mb-sm-0">
          <div className="w-100 me-0 me-lg-4">
            <LocalSearchComponent
              setSearchValueFunction={setSearchValueFunction}
              initialPlaceHolder={"Global search e.g. "}
              defaultSearchTerm={searchValue}
            />
          </div>
        </div>
        <Link
          href="/series"
          className="un-styled-anchor cursor-pointer col d-block"
        >
          <div className="special-card-border smaller-radius">
            <div className=" d-lg-flex align-items-center flex-column flex-lg-row justify-content-center border-light-gray rounded special-card position-relative bg-default">
              <div className="flex-grow-1 ms-lg-3 text-decoration-none d-block d-lg-none mb-lg-0 p-2">
                <h3 className="text-center h5">Browse Sets</h3>
                <p className="mb-0 text-center text-muted">
                  Browse all expansions of the Pokemon TCG, search and filter
                  through your desired cards and more!
                </p>
              </div>
              <div className="flex-shrink-0 media-image">
                <ImageComponent
                  src={swsh125}
                  alt={"Browse cards"}
                  className=" w-100 h-100 rounded"
                  lqImageUnOptimize={false}
                />
              </div>
              <div className="flex-grow-1 ms-lg-3 text-decoration-none d-none d-lg-block py-2 pe-2">
                <h3 className="h5">Browse Sets</h3>
                <p className="mb-0 text-muted">
                  Browse all expansions of the Pokemon TCG, search and filter
                  through your desired cards and more!
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="">
        <h3 className="mb-3 text-center h5">Today's Featured Cards!</h3>
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
            step={1}
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
