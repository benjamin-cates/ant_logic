import "reactflow/dist/style.css";
import "../styles/level.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Node,
  addEdge,
  getOutgoers,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { level_data } from "../pages/levels/level_data.ts";
import { simulate } from "../utils/logic";
import { useActiveNodes } from "../utils/state.ts";
import svgs from "../utils/svgs.tsx";
import And from "./nodes/And";
import Bulb from "./nodes/Bulb";
import Bumi from "./nodes/Bumi";
import Nand from "./nodes/Nand";
import Nor from "./nodes/Nor";
import Not from "./nodes/Not";
import Or from "./nodes/Or";
import Xnor from "./nodes/Xnor";
import Xor from "./nodes/Xor";
import { update_my_leaderboard } from "../utils/backend.ts";

const Level = () => {
  const [params] = useSearchParams();
  const { index } = useParams() as any;

  const [nodes, setNodes, onNodesChange] = useNodesState(
    level_data[index].default_nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(" ");
  const [isSolved, setIsSolved] = useState(false);

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

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  useEffect(() => {
    const activeNodes = simulate(nodes, edges).active_nodes;
    setActiveNodes(activeNodes);
  }, [edges]);

  useEffect(() => {
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      for (const node of newNodes) {
        node.data.on = activeNodes.includes(node.id);
      }
      return newNodes;
    });
  }, [activeNodes]);

  const submitCode = () => {
    const wrong_cases = level_data[index].testing_function(nodes, edges);
    if(wrong_cases.length == 0) {
        setSubmitMessage("Success");
        setIsSolved(true);
        // Ignore return value
        console.log(index,nodes.length - level_data[index].default_nodes.length);
        update_my_leaderboard(Number(index),nodes.length-level_data[index].default_nodes.length).then(response => {
            console.log("Update leaderboard response: "+response);
        });
    }
    else {
        setSubmitMessage("Your solution doesn't work for " + wrong_cases.length + " case"+((wrong_cases.length==1)?"":"s")+". Hint: have you tried a solution where the inputs spell out " + wrong_cases[0].toString(2).padStart(level_data[index].default_nodes.length-1,'0') + " in binary?");
    }
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = (reactFlowInstance as any).screenToFlowPosition({
        x: event.clientX - 158 / 2,
        y: event.clientY - 67 / 2,
      });
      const newNode = {
        id: Math.random().toString(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div id="level_wrapper" style={{}}>
      <div id="level_side_panel">
        <Link to={"/levels"}>
          <button id="level_back_button" className="btn-gray">
            ← Back to Level Menu
          </button>
        </Link>
        <p
          dangerouslySetInnerHTML={{ __html: level_data[index].prompt }}
          id="level_prompt"
        ></p>
        <h2>Inventory</h2>
        {level_data[index].available_gates.length == 0 && (
          <p
            style={{
              textAlign: "center",
              width: "100%",
              marginTop: "1rem",
              fontSize: "1.2rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            Oops! Looks like your inventory is empty! Complete this level with
            wires only.
          </p>
        )}
        <div className="inventory_buttons">
          {level_data[index].available_gates.map((name) => (
            <div
              draggable
              className="inventory_button"
              onDragStart={(event) => onDragStart(event, name)}
              key={name}
            >
              {svgs[name]}
            </div>
          ))}
        </div>
        <button
          id="level_submit_button"
          className="btn-blue"
          onClick={submitCode}
        >
          Submit
        </button>
        <div className="level_submit_response">{submitMessage}</div>
        {
            isSolved && <a href={"/levels/" + (Number(index)+1).toString()}><button className="btn-blue">Next Puzzle</button></a>
        }
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onInit={setReactFlowInstance as any}
        isValidConnection={isValidConnection}
        connectionMode={ConnectionMode.Strict}
        fitView
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
        onDrop={onDrop}
        onDragOver={onDragOver}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#555555"
        />
      </ReactFlow>

      {params.get("dev") == "true" && (
        <div
          id="debug_info"
          style={{
            marginTop: "10px",
            fontSize: "14px",
            fontFamily: "monospace",
          }}
        >
          Active Nodes: {JSON.stringify(activeNodes)}
          <br />
          Edges: {JSON.stringify(edges.map((e) => e.id))}
          <br />
          Node Data:{" "}
          {JSON.stringify(nodes.map(({ id, data }) => [id, data.on]))}
        </div>
      )}
    </div>
  );
};

export default Level;
