import React, {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
} from "react";

import {
  ButtonBack,
  ButtonNext,
  DotGroup,
  Slide,
  Slider,
} from "pure-react-carousel";

import { CarouselContext } from "pure-react-carousel";

import useWindowSize from "../../hooks/windowSize";
import Link from "next/link";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { defaultBlurImage } from "../../../base64Images/base64Images";
interface CarouselSliderProps {
  setSlideCount: (num: number) => void;
  setCurrentSlide: (num: number) => void;
  setCards: any[];
}

const CarouselSlider: FunctionComponent<CarouselSliderProps> = ({
  setSlideCount,
  setCurrentSlide,
  setCards,
}) => {
  const screenWidth = useWindowSize();

  //pure-react-carousel context
  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    const updateCarouselSlide = (slideToBeVisible: number) => {
      const { currentSlide, totalSlides, visibleSlides } =
        carouselContext.state;

      setSlideCount(slideToBeVisible);

      //this is a fix to reset currentSlide when screen resizes
      if (
        currentSlide >= totalSlides - visibleSlides ||
        currentSlide >= totalSlides - slideToBeVisible
      ) {
        setCurrentSlide(totalSlides - slideToBeVisible);
      }
    };

    if (screenWidth <= 575) {
      updateCarouselSlide(1);
    } else if (screenWidth <= 767) {
      updateCarouselSlide(2);
    } else if (screenWidth <= 991) {
      updateCarouselSlide(3);
    } else if (screenWidth <= 1199) {
      updateCarouselSlide(4);
    } else {
      updateCarouselSlide(5);
    }
  }, [screenWidth, setSlideCount, setCurrentSlide, carouselContext]);

  return (
    <Fragment>
      <div>
        <Slider>
          {setCards?.map((card: any, index: number) => (
            <Slide index={index} key={card.id} className={"slide px-3"}>
              <Link
                href={"/card/" + card.id}
                style={{ margin: "auto", maxWidth: "25rem" }}
              >
                <ImageComponent
                  src={card?.images?.large}
                  //highQualitySrc={card?.images?.large}
                  alt={card.name}
                  width={734}
                  height={1024}
                  blurDataURL={defaultBlurImage}
                  className="h-auto w-100"
                />
              </Link>
            </Slide>
          ))}
        </Slider>
        <div className="controls">
          <ButtonBack className="btn-arrow reverse-arrow">left</ButtonBack>
          <DotGroup className="dot-group" />
          <ButtonNext className="btn-arrow">right</ButtonNext>
        </div>
      </div>
    </Fragment>
  );
};

export default CarouselSlider;
