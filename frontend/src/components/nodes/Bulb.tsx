import { Handle, Position, useReactFlow } from "reactflow";

import { useState } from "react";
import { handleStyles } from "../../utils/handles";

const Bulb = ({ id, data }: { id: string; data: { on: boolean } }) => {
  const { setNodes } = useReactFlow();

  const [on, setOn] = useState(data.on);

  const toggleBulb = () => {
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      const node = newNodes.find((node) => node.id === id);
      if (node) {
        node.data.on = !on;
        setOn(!on);
      }
      return newNodes;
    });
  };

  return (
    <>
      <svg
        width="93"
        height="108"
        viewBox="0 0 93 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="37.0613"
          y1="91.1539"
          x2="89.2842"
          y2="91.1539"
          stroke="#C0C0C0"
          strokeWidth="3.36922"
        />
        <path
          d="M60.163 77.1252C60.163 77.1252 72.6344 40.3395 72.7723 27.8337C73.0748 0.396665 49.1188 0.277813 36.982 0.209048C25.5904 0.144507 0.138257 -1.08807 0.000736489 26.8964C-0.102918 47.9892 10.7692 77.0078 10.7692 77.0078L60.163 77.1252Z"
          fill={on ? "#F3E597" : "#DADADA"}
        />
        <path
          d="M41.0522 78.3124C41.0522 78.3124 48.3847 51.2132 48.0305 45.7579C47.6763 40.3027 43.2182 41.6762 42.5754 42.2864C41.3061 43.4914 40.9529 47.047 42.5045 47.2103C43.8506 47.352 45.5509 47.4937 45.6217 44.3764C45.6926 41.2591 41.6898 41.1174 40.0604 41.1174C38.4309 41.1174 36.3287 42.9384 36.0222 44.2347C35.931 44.6201 35.6422 47.2926 37.8642 47.2103C39.777 47.1394 41.4773 44.341 39.4228 42.4281C37.3682 40.5152 35.5971 40.4089 33.3301 40.834C31.063 41.2591 30.7088 42.3927 30.0712 43.7388C29.4336 45.0849 29.5044 48.273 32.0548 48.4147C34.6053 48.5564 34.6761 45.8288 34.1802 43.7034C33.6843 41.5779 32.1965 40.1964 29.6461 40.1964C27.0957 40.1964 25.5131 42.9667 25.6079 45.935C25.8113 52.3026 30.2129 78.5249 30.2129 78.5249"
          stroke={on ? "#F7BC65" : "#757575"}
          strokeWidth="1.93625"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
        <path
          d="M10.8723 76.8246C10.3055 102.33 6.89973 108.138 35.8098 107.998C64.9981 107.856 59.8973 102.896 60.1806 76.9663C57.0634 77.2497 10.8723 76.8246 10.8723 76.8246Z"
          fill="#B2B2B2"
        />
        <rect
          x="28.6383"
          y="84.4155"
          width="15.1615"
          height="15.1615"
          rx="3.36922"
          fill="#555555"
          style={{ cursor: "pointer" }}
          onClick={toggleBulb}
        />
        <rect
          x="85.915"
          y="87.7847"
          width="6.73844"
          height="6.73844"
          fill="#B2B2B2"
        />
      </svg>

      <div>{id}</div>
      <div>{data.on ? "ON" : "OFF"}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          right: -7,
          top: 91,
          ...handleStyles,
        }}
        id="INPUT"
      />
    </>
  );
};

export default Bulb;
