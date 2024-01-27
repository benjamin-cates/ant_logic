import "../styles/index.css";

import { Link } from "react-router-dom";

function App() {
  return (
    <div id="main">
      <h1>AntLogic</h1>
      <p>
        Bumi is an anteater at the North Florida Wildlife Center. He’s recently
        been learning logic and needs you anteaters to help him! The goal is to
        build ant logic gates that feed him only under certain conditions.
      </p>
      <Link to={"/levels"}>
        <button className="btn-green">PLAY</button>
      </Link>
    </div>
  );
}

export default App;
