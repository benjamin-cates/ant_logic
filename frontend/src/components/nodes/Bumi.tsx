import { Handle, Position } from "reactflow";

import gsap from "gsap";
import { handleStyles } from "../../utils/handles";
import { useGSAP } from "@gsap/react";

const Bumi = () => {
  useGSAP(() => {
    gsap.to("#tongue", {
      duration: 1,
      path: "M101.444 5.65599C101.444 5.65599 98.9308 1.73348 71.1787 2.82111C53.15 3.52768 41.5 16.5 21.9599 18.3061C15 20.5 3 10.8422 3 10.8422",
    });
  });

  return (
    <>
      <svg
        width="212"
        height="77"
        viewBox="0 0 212 77"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="bumi"
      >
        <path
          id="tongue"
          d="M102.444 35.656C102.444 35.656 78.9308 50.7335 51.1787 51.8211C33.15 52.5277 31.4739 44.4668 22.9599 42.3061C16.262 40.6062 4 40.8422 4 40.8422"
          stroke="#D35160"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M103.604 43.7016C109.501 48.6392 129.3 36.367 152.703 37.4472C176.106 38.5273 211.289 76.7699 211.289 76.7699L211.052 4.50101C211.052 4.50101 168.185 11.524 140.101 14.7644C112.018 18.0048 104.04 20.7605 97.2636 28.4872C94.8302 31.2619 97.7079 38.764 103.604 43.7016Z"
          fill="#747474"
        />
        <path
          d="M177.991 28.0373C180.563 28.0373 182.649 25.9518 182.649 23.3792C182.649 20.8066 180.563 18.7211 177.991 18.7211C175.418 18.7211 173.333 20.8066 173.333 23.3792C173.333 25.9518 175.418 28.0373 177.991 28.0373Z"
          fill="#202020"
        />
        <path
          d="M182.174 14.1706C182.174 14.1706 189.939 0.677368 196.94 3.35055C203.941 6.02374 192.866 18.244 192.866 18.244"
          stroke="#959595"
          stroke-width="4.48182"
          stroke-linejoin="bevel"
        />
        <rect y="37.5" width="6.74" height="6.74" fill="#B2B2B2" />
      </svg>

      <Handle
        type="target"
        position={Position.Left}
        style={{
          left: -7,
          top: 40.5,
          ...handleStyles,
        }}
        id="OUTPUT"
      />
    </>
  );
};

export default Bumi;
