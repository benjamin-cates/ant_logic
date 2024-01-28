import "../../styles/login.css";

import { Link, useNavigate } from "react-router-dom";
import { sign_up } from "../../utils/backend";

import { useState } from "react";


function Signup() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const callback = (event: any) => {
      event.preventDefault();
      let username = (document.querySelector("#username")! as HTMLInputElement).value;
      let email = (document.querySelector("#email")! as HTMLInputElement).value;
      let password = (document.querySelector("#password")! as HTMLInputElement).value;
      sign_up(username,email,password).then(result=> {
          if(result == "forbidden") {
              setErrorMessage("Invalid username, email, or password. Ensure an account doesn't already exist and the password is at least 6 characters");
          }
          else if(result == "fail") {
              setErrorMessage("Login failed (internal server error)");
          }
          else {
              navigate("/");
          }
      });
  };

  return (
    <div id="main">
      <div id='top-bar'>
        <Link to={"/"}>
          <svg id="home-btn" fill="#000000" width="70px" height="70px" viewBox="0 0 495.398 495.398">
            <g>
              <g>
                <g>
                  <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391
                    v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158
                    c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747
                    c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"/>
                  <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401
                    c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79
                    c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"/>
                </g>
              </g>
            </g>
          </svg>
        </Link>
      </div>
      
      <h1>Sign Up</h1>
      <form className="login-form">
        <input type="text" id="email" placeholder="Email" className="input-login"/>
        <input type="text" id="username" placeholder="Username" className="input-login"/>
        <input type="password" id="password" placeholder="Password" className="input-login"/>
        <button type="submit" className="btn-green" id="submit-login" onClick={callback}>Submit</button>
      </form>
      <div id="form-error">{errorMessage}</div>
      <svg id="bumi_frontpage" width="2002" height="107" viewBox="0 0 2002 107" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1893.44 35.6559C1893.44 35.6559 1862 58 1765.5 45.5C1513.07 12.8013 1129.5 157 912.5 83C728.41 20.2226 3 6.5 3 6.5" stroke="#D35160" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1893.6 43.7016C1899.5 48.6391 1919.3 36.367 1942.7 37.4471C1966.11 38.5273 2001.29 76.7699 2001.29 76.7699L2001.05 4.50098C2001.05 4.50098 1958.18 11.524 1930.1 14.7644C1902.02 18.0048 1894.04 20.7605 1887.26 28.4872C1884.83 31.2618 1887.71 38.764 1893.6 43.7016Z" fill="#747474"/>
        <path d="M1967.99 28.0372C1970.56 28.0372 1972.65 25.9517 1972.65 23.3791C1972.65 20.8066 1970.56 18.7211 1967.99 18.7211C1965.42 18.7211 1963.33 20.8066 1963.33 23.3791C1963.33 25.9517 1965.42 28.0372 1967.99 28.0372Z" fill="#202020"/>
        <path d="M1972.17 14.1706C1972.17 14.1706 1979.94 0.677353 1986.94 3.35054C1993.94 6.02373 1982.87 18.244 1982.87 18.244" stroke="#959595" strokeWidth="4.48182" strokeLinejoin="bevel"/>
      </svg>




    </div>
  );
}

export default Signup;
