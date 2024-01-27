import "../../styles/levels.css";

import { Link } from "react-router-dom";

const levels = [
    {id: 1, name: "Level 1"},
    {id: 2, name: "Level 2"},
    {id: 3, name: "Level 3"},
    {id: 4, name: "Level 4"},
    {id: 5, name: "Level 5"},
    {id: 6, name: "Level 6"},
    {id: 7, name: "Level 7"},
    {id: 8, name: "Level 8"},
    {id: 9, name: "Level 9"},
    {id: 10, name: "Level 10"},
]

function Levels() {
  return (
    <div id="main">
      <h1>Levels</h1>
      <p>
        This is the levels page. Levels colored green are completed, levels colored yellow are completed but not optimized, and levels colored gray are not completed.
      </p>
      <div className="bounding-box">
        {
            levels.map((level) => {
                return (
                    <Link key={level.id} to={"/levels/" + level.id}>
                        <button className="lvl-btn">{level.name}</button>
                    </Link>
                )
            })
        }
      </div>
    </div>
  );
}

export default Levels;
