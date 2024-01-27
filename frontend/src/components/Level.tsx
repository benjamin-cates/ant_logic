import "reactflow/dist/style.css";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { useCallback, useMemo } from "react";

import And from "./nodes/And";
import Or from "./nodes/Or";
import Nand from "./nodes/Nand";
import Nor from "./nodes/Nor";
import Not from "./nodes/Not";
import Xnor from "./nodes/Xnor";
import Xor from "./nodes/Xor";

const initialNodes = [
  { id: "3", position: { x: 0, y: 200 }, type: "AND", data: { label: "yes" } },
  {
    id: "4",
    position: { x: 300, y: 200 },
    type: "OR",
    data: { label: "yes" },
  },
];
const initialEdges: Edge<any>[] = [];

const Level = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ AND: And, OR: Or, NAND: Nand, NOR: Nor, NOT: Not, XNOR: Xnor, XOR: Xor}), []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "1000px", height: "600px", border: "1px solid red" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        defaultEdgeOptions={{
          animated: true,
          style: {
            strokeWidth: 3,
            stroke: "#C0C0C0",
          },
        }}
        connectionLineStyle={{
          strokeWidth: 3,
          stroke: "#C0C0C0",
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#555555"
        />
      </ReactFlow>
    </div>
  );
};

export default Level;
