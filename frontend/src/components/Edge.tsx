import { BaseEdge, Position, getBezierPath } from "reactflow";

import { useActiveNodes } from "../utils/state";

const Edge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  id: string;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  const activeNodes = useActiveNodes((state) => state.activeNodes);
  const activeEdge = activeNodes.includes(source);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 3,
          stroke: activeEdge ? "#F3E597" : "#c0c0c0",
          transition: "stroke 0.3s ease",
          animationDuration: activeEdge ? "0.3s" : "1s",
        }}
      />
    </>
  );
};

export default Edge;
