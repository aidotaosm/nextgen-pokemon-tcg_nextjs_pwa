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
import { defaultBlurImage } from "../../../public/base64Images/base64Images";

export const ImageComponent: FunctionComponent<any> = ({
  src,
  blurDataURL,
  width,
  height,
  className,
  alt,
  layout,
  highQualitySrc,
}) => {
  const [imageSource, setImageSource] = useState(src);
  const [highQualityImageSource, setHighQualityImageSource] =
    useState(highQualitySrc);
  const [highQualityImageLoaded, setHighQualityImageLoaded] = useState(false);
  const [lowQualityImageLoaded, setLowQualityImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ height, width });
  const rawHighQualityImageRef = useRef<any>();

  useEffect(() => {
    setImageSource(src);
    setHighQualityImageSource(highQualitySrc);
    setHighQualityImageLoaded(false);
    //console.log(highQualitySrc);
  }, [src, highQualitySrc]);

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
            //console.log(imageSource);
            setImageSource("/images/Cardback.webp");
          }}
          onLoadingComplete={(e: any) => {
            //  console.log(e, "lowres");
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
            unoptimized={process.env.NETLIFY !== "true"}
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
              if (rawHighQualityImageRef.current) {
                if (
                  rawHighQualityImageRef.current.naturalHeight /
                    rawHighQualityImageRef.current.naturalWidth ==
                    DEFAULT_CARD_BACK_RATIO &&
                  lowQualityImageLoaded
                ) {
                  console.log(
                    "low quality image rendered in hires since hiquality image cannot be loaded"
                  );
                  setHighQualityImageSource(imageSource);
                }
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
            ref={rawHighQualityImageRef}
            className="d-none"
            src={highQualitySrc}
            alt={"hq-image-loader"}
          />
        </IF>
      </IF>
    </>
  );
};
