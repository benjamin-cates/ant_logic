import "../../styles/levels.css";

import { Link } from "react-router-dom";
import { level_data } from "./level_data";

function Levels() {
  return (
    <div id="main">
      <h1>Levels</h1>
      <p>
        This is the levels page. Levels colored green are completed, levels colored yellow are completed but not optimized, and levels colored gray are not completed.
      </p>
      <div className="bounding-box">
        {
            level_data.map((level, idx) => {
                return (
                    <Link key={idx.toString()} to={"/levels/" + idx.toString()}>
                        <button className="lvl-btn">{"Level " + idx.toString() + ": " + level.name}</button>
                    </Link>
                )
            })
        }
      </div>
    </div>
  );
}

export default Levels;
