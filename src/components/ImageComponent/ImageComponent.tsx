import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import { IF } from "../UtilityComponents/IF";
import { DEFAULT_CARD_BACK_RATIO_TO_TWO_DECIMAL } from "../../constants/constants";

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
  const [imageDimensions, setimageDimensions] = useState({ height, width });

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
          // style={{ height: "75vh" }}
          className={className || ""}
          src={imageSource}
          alt={alt || ""}
          width={imageDimensions.width}
          height={imageDimensions.height}
          layout={layout || "responsive"}
          loading="lazy"
          blurDataURL={blurDataURL || "/images/Cardback.webp"}
          placeholder="blur"
          onError={(e) => {
            //console.log(imageSource);
            setImageSource("/images/Cardback.webp");
          }}
          onLoadingComplete={(e) => {
            //  console.log(e, "lowres");
            setimageDimensions({
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
            // style={{ height: "75vh" }}
            className={className || ""}
            src={highQualityImageSource}
            alt={alt || ""}
            width={imageDimensions.width}
            height={imageDimensions.height}
            layout={layout || "responsive"}
            loading="lazy"
            blurDataURL={blurDataURL || "/images/Cardback.webp"}
            placeholder="blur"
            onError={() => {
              if (lowQualityImageLoaded) {
                setHighQualityImageSource(imageSource);
              } else {
                setHighQualityImageSource("/images/Cardback.webp");
              }
            }}
            onLoadingComplete={(e) => {
              // console.log(e, "hires");
              if (
                (e.naturalHeight / e.naturalWidth).toFixed(2) ==
                  DEFAULT_CARD_BACK_RATIO_TO_TWO_DECIMAL &&
                lowQualityImageLoaded
              ) {
                setHighQualityImageSource(imageSource);
              }
              setimageDimensions({
                width: e.naturalWidth,
                height: e.naturalHeight,
              });
              setHighQualityImageLoaded(true);
            }}
          />
        </div>
      </IF>
      {/* <style jsx>{`
        .card-width {
          h-75: 25px;
        }
      `}</style> */}
    </>
  );
};
