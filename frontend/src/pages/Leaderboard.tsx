import "../styles/leaderboard.css";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { get_leaderboard } from "../utils/backend";
import { level_data } from "./levels/level_data";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([] as any[]);
  const [puzzleId, setPuzzleId] = useState(0);
  useEffect(() => {
    get_leaderboard(puzzleId).then(setLeaderboardData);
  }, [puzzleId]);

  const lowestScore = leaderboardData.sort((a, b) =>
    a.score < b.score ? -1 : 1
  )[0];

  return (
    <>
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
      </div>
      <h1 className="leaderboard">Leaderboard</h1>
      <div id="main" className="leaderboard">
        <div id="leaderboard_puzzles">
          {level_data.map((listing, idx) => (
            <button
              key={idx.toString()}
              className={`leaderboard_puzzle ${
                idx == puzzleId ? "leaderboard_puz_sel" : ""
              }`}
              onClick={(_) => setPuzzleId(idx)}
            >
              {listing.name}
            </button>
          )).slice(1)}
        </div>
        <div id="leaderboard_scores">
          {leaderboardData.map((listing, idx) => (
            <div key={idx.toString()} className="leaderboard_listing">
              <div
                className="leaderboard_score"
                style={{
                  color:
                    listing.score == lowestScore.score ? "#F3E597" : "#d2d5e1",
                }}
              >
                {listing.score}
              </div>
              <div className="leaderboard_username">{listing.username}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
