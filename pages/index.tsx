import { ImageComponent } from "../src/components/ImageComponent/ImageComponent";
import Link from "../src/components/UtilityComponents/Link";
import PokemonTCGCardsLaidOut from "../public/images/Pokemon-TCG-Cards-Laid-Out.webp";
import codeRedemption from "../public/images/code-redemption-169.jpg";
import buildPokemonTcgDecks from "../public/images/build-pokemon-tcg-decks-169-en.jpg";

const Index = () => {
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-3">
        <div className="col">
          <Link href="/series" className="un-styled-anchor ">
            <div className="card h-100 cursor-pointer">
              <div className="card-img-top">
                <ImageComponent
                  src={PokemonTCGCardsLaidOut}
                  alt={"Browse cards"}
                  blurDataURL={"/images/Cardback-sideways.webp"}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title text-decoration-none">
                  Browse Cards
                </h5>
                <p className="card-text">
                  Browse all sets of Pokemon TCG, search and your desired cards
                  and more!
                </p>
              </div>
              <div className="card-footer">
                <small className="text-muted">
                  Check it out! New features coming every week!
                </small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-img-top">
              <ImageComponent
                src={codeRedemption}
                alt={"Browse cards"}
                blurDataURL={"/images/Cardback-sideways.webp"}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">Deck Manager</h5>
              <p className="card-text">
                Pokemon TCG Deck builder. Build your deck from all the
                expansions, from Base set to the latest one!
              </p>
            </div>
            <div className="card-footer">
              <small className="text-muted">Upcoming.</small>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-img-top">
              <ImageComponent
                src={buildPokemonTcgDecks}
                alt={"Browse cards"}
                blurDataURL={"/images/Cardback-sideways.webp"}
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
        </div>
      </div>
    </div>
  );
};
export default Index;
