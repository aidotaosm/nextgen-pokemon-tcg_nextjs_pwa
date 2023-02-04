import { FunctionComponent, useState } from "react";
import Image from "next/image";
import { IF } from "../UtilityComponents/IF";
import { DEFAULT_CARD_BACK_RATIO } from "../../constants/constants";
import { defaultBlurImage } from "../../../base64Images/base64Images";
// import CardBack from "../../../public/images/Cardback.webp";

export const ImageComponent: FunctionComponent<any> = ({
  src,
  blurDataURL,
  width,
  height,
  className,
  alt,
  layout,
  highQualitySrc,
  fallBackType,
  fallbackImage,
  lqImageUnOptimize = false,
}) => {
  const [imageSource, setImageSource] = useState(src);
  const [highQualityImageSource, setHighQualityImageSource] =
    useState(highQualitySrc);
  const [highQualityImageLoaded, setHighQualityImageLoaded] = useState(false);
  const [lowQualityImageLoaded, setLowQualityImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ height, width });

  return (
    <>
      <div className={highQualityImageLoaded ? "out-of-view" : ""}>
        <Image
          unoptimized={lqImageUnOptimize}
          className={className || ""}
          src={imageSource}
          alt={alt || ""}
          width={imageDimensions.width}
          height={imageDimensions.height}
          //loading="eager"
          blurDataURL={blurDataURL || defaultBlurImage}
          placeholder="blur"
          onError={(e: any) => {
            console.log(imageSource, "lq image failed");
            if (fallBackType === "logo") {
              setImageSource(fallbackImage);
            } else {
              // setImageSource(CardBack);
              setImageSource("/images/Cardback.webp");
            }
          }}
          onLoadingComplete={(e: any) => {
            if (fallBackType === "logo" || fallBackType === "symbol") {
              console.log(
                e.naturalHeight / e.naturalWidth,
                DEFAULT_CARD_BACK_RATIO,
                "lq"
              );
              if (e.naturalHeight / e.naturalWidth == DEFAULT_CARD_BACK_RATIO) {
                console.log("default logo gotten in low quality view");
                setImageSource(fallbackImage);
              }
            }
            setImageDimensions({
              width: e.naturalWidth,
              height: e.naturalHeight,
            });
            setLowQualityImageLoaded(true);
          }}
        />
      </div>
      <IF condition={highQualityImageSource}>
        <div className={highQualityImageLoaded ? "" : "out-of-view"}>
          <Image
            unoptimized={true}
            className={className || ""}
            src={highQualityImageSource}
            alt={alt || ""}
            width={imageDimensions.width}
            height={imageDimensions.height}
            loading="eager"
            blurDataURL={blurDataURL || defaultBlurImage}
            placeholder="blur"
            onError={() => {
              console.error("hires error occurred");
              if (lowQualityImageLoaded) {
                setHighQualityImageSource(imageSource);
              } else {
                // setHighQualityImageSource(CardBack);
                setHighQualityImageSource("/images/Cardback.webp");
              }
            }}
            onLoadingComplete={(e: any) => {
              console.log(
                e.naturalHeight / e.naturalWidth,
                DEFAULT_CARD_BACK_RATIO,
                "hq"
              );
              if (e.naturalHeight / e.naturalWidth == DEFAULT_CARD_BACK_RATIO) {
                console.log(
                  "low quality image rendered in hires since high quality image cannot be loaded"
                );
                //setHighQualityImageSource(imageSource);
                return;
              }

              setImageDimensions({
                width: e.naturalWidth,
                height: e.naturalHeight,
              });
              setHighQualityImageLoaded(true);
            }}
          />
        </div>
      </IF>
    </>
  );
};
