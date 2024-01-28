import "../styles/home.css";

import { animated, easings, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { logout } from "../utils/backend";

function App() {
  const loggedIn =
    getCookie("username") != undefined && getCookie("username") != "_";

  const [tongueActive, setTongueActive] = useState(false);

  const { x } = useSpring({
    config: { duration: 1500, easing: easings.easeInOutSine },
    x: tongueActive ? 1 : 0,
  });

  useEffect(() => {
    const id = setTimeout(() => {
      setTongueActive(!tongueActive);
    }, 1500);

    return () => clearTimeout(id);
  }, [tongueActive]);

  useEffect(() => {
    setTongueActive(true);
  }, []);

  return (
    <div id="main" style={{ marginTop: "5rem" }}>
      <h1>AntLogic</h1>
      <p>
        Bumi is an anteater at the North Florida Wildlife Center. He's recently
        been learning logic and needs you anteaters to help him!
      </p>
      <div className="main-btns">
        <div>
          <Link to={"/levels"}>
            <button className="btn-green main-btn" id="main-btn-play">
              Play
            </button>
          </Link>
          {loggedIn ? (
            <button
              className="btn-green"
              id="main-btn-logout"
              onClick={() => {
                logout();
                location.reload();
              }}
            >
              Logout
            </button>
          ) : (
            <Link to={"/login"} id="btn-login">
              <button className="btn-gray main-btn" id="main-btn-login">
                Log In
              </button>
            </Link>
          )}
        </div>
        <div id="main-secondary-btns">
          <Link to={"/leaderboard"}>
            <button className="btn-blue" id="main-btn-leaderboard">
              Leaderboard
            </button>
          </Link>
          <Link to={"/library"}>
            <button className="btn-blue" id="main-btn-library">
              Library
            </button>
          </Link>
        </div>
      </div>

      <p id="bumi_frontpage_label">(bumi)</p>
      <svg
        id="bumi_frontpage"
        width="3998"
        height="206"
        viewBox="0 0 1999 103"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <animated.path
          d={x.to({
            range: [0, 1],
            output: [
              "M 1905 33 C 1840 42 1632 97 1466 56 C 1271 -5 901 28 604 59 C 302 106 212 1 -5 33",
              "M 1905 33 C 1840 42 1594 35 1466 56 C 1261 91 883 105 604 59 C 345 -3 212 1 -5 33",
            ],
          })}
          stroke="#D35160"
          strokeWidth="5"
        />
        <path
          d="M1890.6 41.7016C1896.5 46.6391 1916.3 34.367 1939.7 35.4471C1963.11 36.5273 1998.29 74.7699 1998.29 74.7699L1998.05 2.50098C1998.05 2.50098 1955.18 9.524 1927.1 12.7644C1899.02 16.0048 1891.04 18.7605 1884.26 26.4872C1881.83 29.2618 1884.71 36.764 1890.6 41.7016Z"
          fill="#747474"
        />
        <path
          d="M1964.99 26.0372C1967.56 26.0372 1969.65 23.9517 1969.65 21.3791C1969.65 18.8066 1967.56 16.7211 1964.99 16.7211C1962.42 16.7211 1960.33 18.8066 1960.33 21.3791C1960.33 23.9517 1962.42 26.0372 1964.99 26.0372Z"
          fill="#202020"
        />
        <path
          d="M1969.17 12.1706C1969.17 12.1706 1976.94 -1.32265 1983.94 1.35054C1990.94 4.02373 1979.87 16.244 1979.87 16.244"
          stroke="#959595"
          strokeWidth="3"
          strokeLinejoin="bevel"
        />
      </svg>
    </div>
  );
}

export default App;
