import "../styles/home.css";

import { Link } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { logout } from "../utils/backend";

function App() {
  let loggedIn = getCookie("username") != undefined && getCookie("username") != "_";
  return (
    <div id="main">
      <h1>AntLogic</h1>
      <p>
        Bumi is an anteater at the North Florida Wildlife Center. He’s recently
        been learning logic and needs you anteaters to help him! The goal is to
        build ant logic gates that feed him only under certain conditions.
      </p>
      <div className="main-btns">
        <Link to={"/levels"}>
          <button className="btn-green main-btn" id="main-btn-play">PLAY</button>
        </Link>

        {
            loggedIn 
                ? <></>
                : <Link to={"/login"}>
                  <button className="btn-green main-btn" id="main-btn-login">LOGIN</button>
                </Link>
        }
      </div>
      {
         loggedIn 
            ? (<button className="btn-green" id="main-btn-logout" onClick={_=> {logout();location.reload();}}>Logout</button>) 
            : (<></>)
      }
      <svg
        id="bumi_frontpage"
        width="2002"
        height="107"
        viewBox="0 0 2002 107"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1893.44 35.6559C1893.44 35.6559 1862 58 1765.5 45.5C1513.07 12.8013 1129.5 157 912.5 83C728.41 20.2226 3 6.5 3 6.5"
          stroke="#D35160"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1893.6 43.7016C1899.5 48.6391 1919.3 36.367 1942.7 37.4471C1966.11 38.5273 2001.29 76.7699 2001.29 76.7699L2001.05 4.50098C2001.05 4.50098 1958.18 11.524 1930.1 14.7644C1902.02 18.0048 1894.04 20.7605 1887.26 28.4872C1884.83 31.2618 1887.71 38.764 1893.6 43.7016Z"
          fill="#747474"
        />
        <path
          d="M1967.99 28.0372C1970.56 28.0372 1972.65 25.9517 1972.65 23.3791C1972.65 20.8066 1970.56 18.7211 1967.99 18.7211C1965.42 18.7211 1963.33 20.8066 1963.33 23.3791C1963.33 25.9517 1965.42 28.0372 1967.99 28.0372Z"
          fill="#202020"
        />
        <path
          d="M1972.17 14.1706C1972.17 14.1706 1979.94 0.677353 1986.94 3.35054C1993.94 6.02373 1982.87 18.244 1982.87 18.244"
          stroke="#959595"
          strokeWidth="4.48182"
          strokeLinejoin="bevel"
        />
      </svg>
    </div>
  );
}

export default App;
