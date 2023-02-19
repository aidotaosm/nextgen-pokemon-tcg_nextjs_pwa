import { ImageComponent } from "../src/components/ImageComponent/ImageComponent";
import PokemonTCGCardsLaidOut from "../images/Pokemon-TCG-Cards-Laid-Out.webp";
import codeRedemption from "../images/code-redemption-169.jpg";
import Link from "next/link";
import { defaultBlurImage } from "../base64Images/base64Images";
import { GetStaticProps } from "next";
import { CarouselComponent } from "../src/components/UtilityComponents/CarouselComponent";
import { Fragment, useContext } from "react";
import { Helper } from "../src/utils/helper";
import { useRouter } from "next/router";
import { AppContext } from "../src/contexts/AppContext";
import { LocalSearchComponent } from "../src/components/LocalSearchComponent/LocalSearchComponent";
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

  return { props: { setCards: fiveRandomCards }, revalidate: 60 * 5 }; // 5 minutes
};

const Index = ({ setCards }: any) => {
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
  };
  return (
    <div className="container">
      <div className="mb-4 search-wrapper">
        <LocalSearchComponent
          setSearchValueFunction={setSearchValueFunction}
          initialPlaceHolder={"Search all e.g. "}
        />
      </div>
      <div className="row row-cols-1 row-cols-md-2">
        <div className="col">
          <Link href="/series" className="un-styled-anchor ">
            <div className="card h-100 cursor-pointer">
              <div className="card-body">
                <h4 className="card-title text-decoration-none mb-0 text-center">
                  Browse Cards
                </h4>
                <div className="d-flex h-100 align-items-center">
                  <ImageComponent
                    src={PokemonTCGCardsLaidOut}
                    alt={"Browse cards"}
                    blurDataURL={defaultBlurImage}
                    className="w-100 h-auto card-img-top"
                    lqImageUnOptimize={true}
                  />
                </div>
              </div>
              {/* <div className="card-img-top">
         
              </div> */}
              <div className="card-footer p-3">
                <span className="fs-6">
                  Browse all expansions of Pokemon TCG, search and filter
                  through your desired cards and more!
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h4 className="card-title mb-0 text-center">
                Today's Featured Cards!
              </h4>
            </div>
            <div className="card-img-top px-3 pb-3">
              <CarouselComponent isLandingPage={true}>
                {setCards?.map((card: any, index: number) => (
                  <Fragment key={card.id}>
                    <div
                      className={
                        "carousel-item " + (index == 0 ? "active" : "")
                      }
                    >
                      <div
                        className=""
                        style={{ margin: "auto", maxWidth: "25rem" }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Link
                          href={"/card/" + card.id}
                          className="un-styled-anchor "
                        >
                          <ImageComponent
                            src={card?.images?.small}
                            highQualitySrc={card?.images?.large}
                            alt={card.name}
                            width={734}
                            height={1024}
                            className="position-relative h-auto w-100"
                          />
                        </Link>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </CarouselComponent>
            </div>
          </div>
        </div>
        {/* <div className="col opacity-50">
          <div className="card h-100">
            <div className="card-img-top">
              <ImageComponent
                src={buildPokemonTcgDecks}
                alt={"Browse cards"}
                blurDataURL={defaultBlurImage}
                className="w-100 h-auto"
                lqImageUnOptimize={true}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">Play Pokemon TCG</h5>
              <p className="card-text">
                Play Pokemon TCG with your friend with decks built from the deck
                builder!
              </p>
            </div>
            <div className="card-footer">
              <small className="text-muted">Coming later.</small>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default Index;
