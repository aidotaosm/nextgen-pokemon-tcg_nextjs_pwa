import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import { IF } from "../UtilityComponents/IF";

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

  useEffect(() => {
    setImageSource(src);
    setHighQualityImageSource(highQualitySrc);
    setHighQualityImageLoaded(false);
    console.log(highQualitySrc);
  }, [src, highQualitySrc]);

  return (
    <>
      <div className={highQualityImageLoaded ? "out-of-view" : ""}>
        <Image
          // style={{ height: "75vh" }}
          className={className || ""}
          src={imageSource}
          alt={alt || ""}
          width={width}
          height={height}
          layout={layout || "responsive"}
          loading="lazy"
          blurDataURL={blurDataURL || "/images/Cardback.webp"}
          placeholder="blur"
          onError={() => setImageSource("/images/Cardback.webp")}
        />
      </div>
      <IF condition={highQualityImageSource}>
        <div className={highQualityImageLoaded ? "" : "out-of-view"}>
          <Image
            // style={{ height: "75vh" }}
            className={className || ""}
            src={highQualityImageSource}
            alt={alt || ""}
            width={width}
            height={height}
            layout={layout || "responsive"}
            loading="lazy"
            blurDataURL={blurDataURL || "/images/Cardback.webp"}
            placeholder="blur"
            onError={() => setHighQualityImageSource("/images/Cardback.webp")}
            onLoadingComplete={(e) => {
              console.log(e);
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
