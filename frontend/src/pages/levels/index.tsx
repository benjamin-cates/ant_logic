import "../../styles/levels.css";

import { useEffect, useState } from "react";
import { level_data, puzzleOrder } from "./level_data";

import { Link } from "react-router-dom";
import { get_self_info } from "../../utils/backend";

function Levels() {
  const [completed, setCompleted] = useState([false]);

  useEffect(() => {
    get_self_info().then((user) => {
      if (user != undefined)
        setCompleted(user.scores.map((score) => score != 0));
    });
  }, []);
  return (
    <div id="main" className="levels-header">
      <div id="top-bar">
        <Link to={"/"}>
          <svg
            id="home-btn"
            fill="#000000"
            width="70px"
            height="70px"
            viewBox="0 0 495.398 495.398"
          >
            <g>
              <g>
                <g>
                  <path
                    d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391
                    v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158
                    c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747
                    c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"
                  />
                  <path
                    d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401
                    c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79
                    c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </Link>
        <Link to={"/library"}>
          <svg
            width="159"
            height="68"
            viewBox="0 0 159 68"
            fill="none"
            id="library-btn"
          >
            <path
              d="M40.8334 2.9321L76.2989 2.77655L96.8315 11.7985L113.32 30.3089L112.853 39.0198L89.5207 60.1746L58.0995 66.0855C58.0995 66.0855 41.1445 66.0855 41.1445 65.4633C41.1445 64.8411 51.4108 40.1086 51.4108 40.1086V25.3313L40.8334 2.9321Z"
              fill="#EEEEEE"
            />
            <path
              d="M112.869 33.6922H154.984M46.1342 16.8461H3.3692M47.779 50.5383H3.3692"
              stroke="#C0C0C0"
              strokeWidth="3.36922"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M35.7979 62.3305C33.107 66.7853 32.0076 67.3844 32.0076 67.3844H25.8482L29.2174 63.2781C29.2174 63.2781 38.746 51.4858 38.746 33.6922C38.746 15.8986 29.2174 4.10623 29.2174 4.10623L25.8482 0H32.0076C33.3237 1.57932 34.4029 2.79013 35.7453 5.05383C38.9001 10.2758 43.7998 20.2602 43.7998 33.6922C43.7998 47.0859 38.92 57.0736 35.7979 62.3305Z"
              fill="#C0C0C0"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M35.5347 0L38.9039 4.10623C38.9039 4.10623 48.4325 15.8986 48.4325 33.6922C48.4325 51.4858 38.9039 63.2781 38.9039 63.2781L35.5347 67.3844H64.4363C68.493 67.3844 77.3904 67.4257 87.3891 63.3308C97.3878 59.2359 108.508 50.9602 117.186 34.903L114.975 33.6922L117.186 32.4814C99.8289 0.363184 72.4493 0 64.4363 0H35.5347ZM45.4318 5.05383H64.4363C72.3273 5.05383 95.2425 4.83449 111.553 33.6922C103.523 47.8919 93.8285 55.0596 85.0728 58.6455C76.0422 62.3439 68.493 62.3305 64.4363 62.3305H45.4845C48.6407 57.094 53.4863 47.0859 53.4863 33.6922C53.4863 20.2602 48.5866 10.2758 45.4318 5.05383Z"
              fill="#C0C0C0"
            />
            <rect
              x="151.615"
              y="30.3229"
              width="6.73844"
              height="6.73844"
              fill="#B2B2B2"
            />
            <rect y="47.1691" width="6.73844" height="6.73844" fill="#B2B2B2" />
            <rect y="13.4769" width="6.73844" height="6.73844" fill="#B2B2B2" />
          </svg>
        </Link>
      </div>

      <h1 id="levels-header">Puzzles</h1>
      <div className="bounding-box">
        {puzzleOrder.map((levelId, idx) => {
          return (
            <Link key={idx.toString()} to={"/levels/" + levelId.toString()}>
              <button
                className={`${
                  completed[levelId] ? "lvl-completed" : ""
                } lvl-btn`}
              >
                <div
                  className={`difficulty difficulty-${level_data[levelId].difficulty}`}
                >
                  {level_data[levelId].difficulty}
                </div>
                <p>{level_data[levelId].name}</p>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Levels;
