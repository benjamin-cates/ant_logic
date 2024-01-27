import "../../styles/levels.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import { level_data } from "./level_data";
import { get_self_info } from "../../utils/backend";


const levels = [
    {id: 0, name: "Tutorial"},
    {id: 1, name: "AND"},
    {id: 2, name: "OR"},
    {id: 3, name: "NOT"},
    {id: 4, name: "Levl 4"},
    {id: 5, name: "Level 5"},
    {id: 6, name: "Level 6"},
    {id: 7, name: "Level 7"},
    {id: 8, name: "Level 8"},
    {id: 9, name: "Level 9"},
    {id: 10, name: "Level 10"},
]

function Levels() {
  const [completed, setCompleted] = useState([false]);

  get_self_info().then(user=> {
      if(user != undefined) 
          setCompleted(user.scores.map(score => score != 0));
  });
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
                        <button className={`${completed[idx]?"lvl-completed": ""} lvl-btn`}>
                            {"Level " + idx.toString() + ": " + level.name}
                        </button>
                    </Link>
                )
            })
        }
      </div>
    </div>
  );
}

export default Levels;
