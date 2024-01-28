import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getBezierPath,
  useReactFlow,
} from "reactflow";

import { useActiveNodes } from "../utils/state";

const Edge = ({
  id,
  source,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}: {
  id: string;
  source: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  selected: boolean;
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  const { setEdges } = useReactFlow();

  const activeNodes = useActiveNodes((state) => state.activeNodes);
  const activeEdge = activeNodes.includes(source);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 3,
          stroke: selected ? "#555" : activeEdge ? "#F3E597" : "#c0c0c0",
          transition: "stroke 0.3s ease",
          animationDuration: activeEdge ? "0.3s" : "1s",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            display: selected ? "block" : "none",
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            style={{ cursor: "pointer" }}
            className="edgebutton"
            onClick={() => {
              console.log(id);
              setEdges((edges) => edges.filter((edge) => edge.id !== id));
            }}
          >
            <circle cx="14" cy="14" r="14" fill="#D35160" />
            <path
              d="M17.1576 21L12.8176 14.72L7.25758 7H10.9376L15.1776 13.2L20.8376 21H17.1576ZM7.15758 21L12.4976 13.38L14.7776 14.96L10.6376 21H7.15758ZM15.4976 14.5L13.2376 12.98L17.1576 7H20.6376L15.4976 14.5Z"
              fill="#C0C0C0"
            />
          </svg>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default Edge;
