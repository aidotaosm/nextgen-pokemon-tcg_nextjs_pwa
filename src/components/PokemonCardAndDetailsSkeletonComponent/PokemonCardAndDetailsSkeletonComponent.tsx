import { Fragment, FunctionComponent, useContext } from "react";
import { defaultBlurImage } from "../../../base64Images/base64Images";
import { AppContext } from "../../contexts/AppContext";
import { PokemonDetailProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
import { IF } from "../UtilityComponents/IF";

export const PokemonCardAndDetailsSkeletonComponent: FunctionComponent<
  PokemonDetailProps
> = ({
  detailsClasses = "mt-5 mt-lg-0 ms-lg-5 flex-grow-1",
  imageClasses = "",
}) => {
    const { appState } = useContext(AppContext);
    return (
      <Fragment>
        <IF condition={!appState.offLineMode}>
          <div
            className={"pokemon-card-image " + imageClasses}
          >
            <div className="special-card-wrapper p-0">
              <div
                className={
                  "special-card-border "
                }
              >
                <ImageComponent
                  src={defaultBlurImage}
                  alt={'card-image-skeleton'}
                  width={245}
                  blurDataURL={defaultBlurImage}
                  height={342}
                  className={
                    "special-card position-relative h-100 w-100 rounded blurred"
                  }
                />
              </div>
            </div>
          </div>
        </IF>
        <div className={"pokemon-details-wrapper skeleton-animation " + detailsClasses} style={{ maxWidth: '500px', height: '550px' }}>
        </div>
      </Fragment>
    );
  };
