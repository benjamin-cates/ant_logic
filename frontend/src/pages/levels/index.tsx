import "../../styles/levels.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import { level_data } from "./level_data";
import { get_self_info } from "../../utils/backend";


function Levels() {
  const [completed, setCompleted] = useState([false]);

  get_self_info().then(user=> {
      if(user != undefined) 
          setCompleted(user.scores.map(score => score != 0));
  });
  return (
    <div id="main">
      <h1>Levels</h1>
      <div className="bounding-box">
        {
            level_data.map((level, idx) => {
                return (
                    <Link key={idx.toString()} to={"/levels/" + idx.toString()}>
                        <button className={`${completed[idx]?"lvl-completed": ""} lvl-btn`}>
                            {level.name}
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
