import {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { IF } from "../UtilityComponents/IF";
import { DEFAULT_CARD_BACK_RATIO } from "../../constants/constants";
import { defaultBlurImage } from "../../../base64Images/base64Images";

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
          // unoptimized={{process.env.NETLIFY !== "true"}}
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
            setImageSource("/images/Cardback.webp");
          }}
          onLoadingComplete={(e: any) => {
            // console.log(fallbackImage);
            console.log(e.naturalHeight, "e.naturalHeight lq");
            console.log(e.naturalWidth, "e.naturalWidth lq");
            if (fallBackType === "logo" && e) {
              console.log(e.naturalHeight / e.naturalWidth, "e");
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
            // loading="lazy"
            blurDataURL={blurDataURL || defaultBlurImage}
            placeholder="blur"
            onError={() => {
              console.error("hires error occurred");
              if (lowQualityImageLoaded) {
                setHighQualityImageSource(imageSource);
              } else {
                setHighQualityImageSource("/images/Cardback.webp");
              }
            }}
            onLoadingComplete={(e: any) => {
              console.log(e.naturalHeight, "e.naturalHeight hq");
              console.log(e.naturalWidth, "e.naturalWidth hq");
              if (
                e.naturalHeight / e.naturalWidth == DEFAULT_CARD_BACK_RATIO &&
                lowQualityImageLoaded
              ) {
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
        <IF condition={!highQualityImageLoaded}>
          <img
            className="d-none"
            src={highQualitySrc}
            alt={"hq-image-loader"}
          />
        </IF>
      </IF>
    </>
  );
};
