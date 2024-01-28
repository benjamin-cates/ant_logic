import "../styles/library.css";

import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";

interface LibraryPage {
    page: ReactElement
    name: string
}
const library_pages: LibraryPage[] = [
    {
        name: "Wires",
        page: <> Wires connect two nodes together. </>,
    },
    {
        name: "Bulb",
        page: <> A bulb is an input source. </>,
    },
    {
        name: "Bumi",
        page: <> Bumi is the anteater you're trying to feed electricity (for some reason)! </>,
    },
    {
        name: "AND Gate",
        page: <> The AND gate is activated if both inputs are activated. </>,
    },
    {
        name: "OR Gate",
        page: <> The OR gate is activated if at least 1 of the inputs are activated. </>,
    },
    {
        name: "XOR Gate",
        page: <> The XOR gate is activated if <em>exactly</em> 1 input is activated </>,
    },
    {
        name: "NOR Gate",
        page: <> The NOR gate is activated if OR would not be activated under the same inputs; neither input can be active. </>,
    },
    {
        name: "NAND Gate",
        page: <> The NAND gate is activated if AND would not be activated under the same inputs; at <em>most</em> 1 input can be active. </>,
    },
    {
        name: "XNOR Gate",
        page: <> The XNOR gate is activated if XOR would not be activated under the same inputs; it is equivalent to the biconditional operator, requiring both inputs to be equivalent. </>,
    },


    

];

function Library() {
    let [pageId, setPageId] = useState(0);
    return (
    <>
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
        <h1 id="library_header">Library</h1>
        <div id="main" className="library">
            <div id="library_pages">
                {
                    library_pages.map((listing, idx) => (
                        <button 
                            key={idx.toString()}
                            className={`library_page ${idx==pageId ? "library_page_sel" : ""}`}
                            onClick={_=>setPageId(idx)}>
                            {listing.name}
                        </button>
                    ))
                }
            </div>
            <div id="leaderboard_scores">
                { library_pages[pageId].page }
            </div>
        </div>
    </>
    );

}

export default Library;
