import "reactflow/dist/style.css";

import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Edge,
  Node,
  addEdge,
  getOutgoers,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { create } from "zustand";
import { simulate } from "../utils/logic";
import And from "./nodes/And";
import Bulb from "./nodes/Bulb";
import Bumi from "./nodes/Bumi";
import Nand from "./nodes/Nand";
import Nor from "./nodes/Nor";
import Not from "./nodes/Not";
import Or from "./nodes/Or";
import Xnor from "./nodes/Xnor";
import Xor from "./nodes/Xor";

const initialNodes: Node[] = [
  {
    id: "I1",
    position: { x: 0, y: 0 },
    type: "Bulb",
    data: { on: true, label: "Input A" },
    deletable: false,
  },
  {
    id: "I2",
    position: { x: 0, y: 200 },
    type: "Bulb",
    data: { on: false, label: "Input B" },
    deletable: false,
  },
  {
    id: "1",
    position: { x: 200, y: 100 },
    type: "AND",
    data: { label: "yes" },
  },
  {
    id: "B",
    position: { x: 500, y: 100 },
    type: "Bumi",
    deletable: false,
    draggable: false,
    selectable: false,
    positionAbsolute: { x: 0, y: 0 },
    data: { on: true },
  },
];
const initialEdges: Edge<any>[] = [];

interface ActiveNodesState {
  activeNodes: string[];
  setActiveNodes: (activeNodes: string[]) => void;
}

export const useActiveNodes = create<ActiveNodesState>((set) => ({
  activeNodes: [],
  setActiveNodes: (activeNodes: string[]) => set({ activeNodes }),
}));

const Level = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const activeNodes = useActiveNodes((state) => state.activeNodes);
  const setActiveNodes = useActiveNodes((state) => state.setActiveNodes);

  const nodeTypes = useMemo(
    () => ({
      AND: And,
      OR: Or,
      NAND: Nand,
      NOR: Nor,
      NOT: Not,
      XNOR: Xnor,
      XOR: Xor,
      Bumi,
      Bulb,
    }),
    []
  );

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const targetId = connection.target;
      const targetHandle = connection.targetHandle;
      const targetNode = nodes.find((n) => n.id === targetId);

      const existingEdges = edges.filter(
        (e) => e.target == targetId && e.targetHandle == targetHandle
      );

      if (existingEdges.length > 0) return false; // Prevent multiple connections to an input

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (targetId === connection.source) return false;
      if (targetNode && hasCycle(targetNode)) return false; // Prevent cycles and self loops

      return true;
    },
    [nodes, edges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      resimulate();
    },
    [setEdges]
  );

  const resimulate = useCallback(() => {
    console.log("Resimulating");
    const activeNodes = simulate(nodes, edges).active_nodes;
    setActiveNodes(activeNodes);
  }, [nodes, edges, setActiveNodes]);

  useEffect(() => {
    console.log("Setting data to result of activeNodes");
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      for (const node of newNodes) {
        node.data.on = activeNodes.includes(node.id);
      }
      return newNodes;
    });
  }, [activeNodes]);

  return (
    <div style={{ width: "1000px", height: "600px", border: "1px solid red" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        connectionMode={ConnectionMode.Strict}
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
      <div
        style={{
          marginTop: "10px",
          fontSize: "14px",
          fontFamily: "monospace",
        }}
      >
        {JSON.stringify(activeNodes)}
        <br />
        <br />
        {JSON.stringify(nodes.map(({ id, data }) => [id, data.on]))}
      </div>
    </div>
  );
};

export default Level;
