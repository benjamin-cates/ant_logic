import "../styles/home.css";

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div id="main">
      <h1>404 Not Found</h1>
      <p>
        How did you get here? You must have taken a wrong turn somewhere. Do
        better next time or I'm giving you "not yet" on this outcome.
      </p>
      <div className="main-btns">
        <Link to={"/"}>
          <button className="btn-green main-btn" id="main-btn-play">
            GO BACK HOME.
          </button>
        </Link>
      </div>
      <img
        src="https://cdn.discordapp.com/emojis/1093046908576088114.webp?size=240&quality=lossless"
        width={250}
      ></img>
    </div>
  );
}

export default NotFound;
