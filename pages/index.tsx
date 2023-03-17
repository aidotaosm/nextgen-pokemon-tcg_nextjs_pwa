import { ImageComponent } from "../src/components/ImageComponent/ImageComponent";
//import PokemonTCGCardsLaidOut from "../images/Pokemon-TCG-Cards-Laid-Out.webp";
//import codeRedemption from "../images/code-redemption-169.jpg";
//import buildPokemonTcgDecks from "../images/build-pokemon-tcg-decks-169-en.jpg";
import swsh125 from "../images/swsh125-preview-cards-1-169-en.jpg";

import Link from "next/link";
import { defaultBlurImage } from "../base64Images/base64Images";
import { GetStaticProps } from "next";
import { CarouselComponent } from "../src/components/UtilityComponents/CarouselComponent";
import { Fragment, useContext, useState } from "react";
import { Helper } from "../src/utils/helper";
import { useRouter } from "next/router";
import { AppContext } from "../src/contexts/AppContext";
import { LocalSearchComponent } from "../src/components/LocalSearchComponent/LocalSearchComponent";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import CarouselSlider from "../src/components/CaouselSlider/CarouselSlider";

export const getStaticProps: GetStaticProps = async (context) => {
  const dynamicallyImportedJson: any = (
    await import("../public/Jsons/AllCards.json")
  ).default;

  let parsedAllCards = dynamicallyImportedJson;
  let fiveRandomCards = [];
  for (let i = 0; i < 5; i++) {
    let randomIndex = Helper.randDelay(0, parsedAllCards.length - 1);
    fiveRandomCards.push(parsedAllCards[randomIndex]);
  }

  return { props: { setCards: fiveRandomCards }, revalidate: 60 * 60 }; // 60 minutes
};

const Index = ({ setCards }: any) => {
  const [searchValue, setSearchValue] = useState("");
  const [slideCount, setSlideCount] = useState(2);
  const [currentSlide, setCurrentSlide] = useState(0);

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
      <div className="mb-4 search-wrapper">
        <LocalSearchComponent
          setSearchValueFunction={setSearchValueFunction}
          initialPlaceHolder={"Global search e.g. "}
          defaultSearchTerm={searchValue}
        />
      </div>
      <div className="">
        <div className="">
          <Link href="/series" className="un-styled-anchor ">
            <div className=" cursor-pointer">
              <h4 className=" text-decoration-none mb-0 text-center">
                Browse Cards
              </h4>
              <div className="flex-grow-1 flex-column justify-content-center d-flex">
                <ImageComponent
                  src={swsh125}
                  alt={"Browse cards"}
                  className=""
                  lqImageUnOptimize={true}
                />
              </div>
            </div>
          </Link>
        </div>
        <div className="">
          <h4 className=" mb-0 text-center">Today's Featured Cards!</h4>
          <div className="carousel-container">
            <CarouselProvider
              visibleSlides={slideCount}
              totalSlides={6}
              step={1}
              currentSlide={currentSlide}
              naturalSlideWidth={100}
              naturalSlideHeight={125}
              isIntrinsicHeight={true}
            >
              <CarouselSlider
                setSlideCount={setSlideCount}
                setCurrentSlide={setCurrentSlide}
                setCards={setCards}
              />
              <ButtonBack>Back</ButtonBack>
              <ButtonNext>Next</ButtonNext>
            </CarouselProvider>
          </div>
        </div>
      </div>
      <style jsx>{`
        .carousel-container {
          margin: 12px auto;
          max-width: 272px;
          filter: drop-shadow(0px 12px 30px rgba(50, 50, 50, 0.2));

          /* Total-width (including margin) + 1 additional margin */
        }
        @media (min-width: 832px) {
          .carousel-container {
            max-width: 704px;
          }
        }

        @media (min-width: 1088px) {
          .carousel-container {
            max-width: 960px;
          }
        }

        @media (min-width: 1272px) {
          .carousel-container {
            max-width: 1152px;
          }
        }

        @media (min-width: 1504px) {
          .carousel-container {
            max-width: 1344px;
          }
        }
        .carousel__inner-slide {
          /* width: 100% - margin */
          width: calc(100% - 16px);
          /* margin-left: margin/2 */
          /* margin is required to adjust positioning as the width is diminished*/
          margin-left: 8px;
        }
        @media (min-width: 1272px) {
          .carousel__inner-slide {
            width: calc(100% - 24px);
            margin-left: 12px;
          }
        }

        @media (min-width: 1272px) {
          .carousel__inner-slide {
            width: calc(100% - 32px);
            margin-left: 16px;
          }
        }
      `}</style>
    </div>
  );
};
export default Index;
