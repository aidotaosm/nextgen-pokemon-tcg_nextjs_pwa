import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="mx-5">
      <div className="row row-cols-1 row-cols-md-3 g-4 ">
        <div className="col">
          <Link to="/series" className="un-styled-anchor">
            <div className="card h-100">
              <img
                src=".\images\Pokemon-TCG-Cards-Laid-Out.webp"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title text-decoration-none">
                  Browse Cards
                </h5>
                <p className="card-text">
                  This is a wider card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </p>
              </div>
              <div className="card-footer">
                <small className="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col">
          <div className="card h-100">
            <img
              src=".\images\code-redemption-169.jpg"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">Deck Manager</h5>
              <p className="card-text">
                This card has supporting text below as a natural lead-in to
                additional content.
              </p>
            </div>
            <div className="card-footer">
              <small className="text-muted">Last updated 3 mins ago</small>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <img
              src=".\images\build-pokemon-tcg-decks-169-en.jpg"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">Play Pokemon TCG</h5>
              <p className="card-text">
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
              </p>
            </div>
            <div className="card-footer">
              <small className="text-muted">Last updated 3 mins ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
