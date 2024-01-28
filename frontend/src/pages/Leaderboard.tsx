import "../styles/leaderboard.css";

import { level_data } from "./levels/level_data";
import { get_leaderboard } from "../utils/backend";
import { useState, useEffect } from "react";

function Leaderboard() {
    let [leaderboardData, setLeaderboardData] = useState([] as any[]);
    let [puzzleId, setPuzzleId] = useState(0);
    useEffect(() => {
        get_leaderboard(puzzleId).then(setLeaderboardData);
    }, [puzzleId]);

    return (<div id="main" className="leaderboard">
        <div id="leaderboard_puzzles">
            {
                level_data.map((listing, idx) => (
                    <button 
                        key={idx.toString()}
                        className={`leaderboard_puzzle ${idx==puzzleId ? "leaderboard_puz_sel" : ""}`}
                        onClick={_=>setPuzzleId(idx)}>
                        {listing.name}
                    </button>
                ))
            }
        </div>
        <div id="leaderboard_scores">
            {
                leaderboardData.map((listing, idx) => 
                    (<div key={idx.toString()} className="leaderboard_listing">
                        <div className="leaderboard_username">{listing.username}</div>
                        <div className="leaderboard_score">{listing.score}</div>
                    </div>)
                )
            }
        </div>
    </div>);
    

}

export default Leaderboard;
