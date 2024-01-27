import { animated, easings, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

import { handleStyles } from "../../utils/handles";

const Bumi = ({ data }: { data: { on: boolean } }) => {
  const [tongueActive, setTongueActive] = useState(false);

  const { x } = useSpring({
    config: { duration: 300, easing: easings.easeInOutSine },
    x: tongueActive ? 1 : 0,
    pause: !data.on,
  });

  useEffect(() => {
    const id = setTimeout(() => {
      setTongueActive(!tongueActive);
    }, 300);

    return () => clearTimeout(id);
  }, [tongueActive]);

  useEffect(() => {
    setTongueActive(true);
  }, []);

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
        <animated.path
          id="tongue"
          d={x.to({
            range: [0, 1],
            output: [
              "M102.444 35.656C102.444 35.656 78.9308 50.7335 51.1787 51.8211C33.15 52.5277 31.4739 44.4668 22.9599 42.3061C16.262 40.6062 4 40.8422 4 40.8422",
              "M101.444 35.65599C101.444 35.65599 98.9308 31.73348 71.1787 32.82111C53.15 33.52768 41.5 46.5 21.9599 48.3061C14.5 49 3 40.8422 3 40.8422",
            ],
          })}
          stroke="#D35160"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M103.604 43.7016C109.501 48.6392 129.3 36.367 152.703 37.4472C176.106 38.5273 211.289 76.7699 211.289 76.7699L211.052 4.50101C211.052 4.50101 168.185 11.524 140.101 14.7644C112.018 18.0048 104.04 20.7605 97.2636 28.4872C94.8302 31.2619 97.7079 38.764 103.604 43.7016Z"
          fill="#747474"
        />
        {data.on ? (
          <path
            d="M174.991 22.94109C175.991 18.51963 185.991 17.921453 183.991 25.5"
            stroke="#202020"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M177.991 28.0373C180.563 28.0373 182.649 25.9518 182.649 23.3792C182.649 20.8066 180.563 18.7211 177.991 18.7211C175.418 18.7211 173.333 20.8066 173.333 23.3792C173.333 25.9518 175.418 28.0373 177.991 28.0373Z"
            fill="#202020"
          />
        )}

        <path
          d="M182.174 14.1706C182.174 14.1706 189.939 0.677368 196.94 3.35055C203.941 6.02374 192.866 18.244 192.866 18.244"
          stroke="#959595"
          strokeWidth="4.48182"
          strokeLinejoin="bevel"
        />
        <rect y="37.5" width="6.74" height="6.74" fill="#B2B2B2" />
      </svg>

      <div
        style={{
          transform: "translate(47px, 0)",
        }}
      >
        Bumi
      </div>

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
