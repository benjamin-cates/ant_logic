import { NodeToolbar, Position, useReactFlow } from "reactflow";

const Toolbar = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodes, setEdges } = useReactFlow();

  return (
    <>
      <NodeToolbar position={Position.Top}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: "0.5rem", cursor: "pointer" }}
          onClick={() => {
            setEdges((edges) =>
              edges.filter((edge) => edge.source !== id && edge.target !== id)
            );
            setNodes((nodes) => nodes.filter((node) => node.id !== id));
          }}
        >
          <circle cx="14" cy="14" r="14" fill="#D35160" />
          <path
            d="M17.1576 21L12.8176 14.72L7.25758 7H10.9376L15.1776 13.2L20.8376 21H17.1576ZM7.15758 21L12.4976 13.38L14.7776 14.96L10.6376 21H7.15758ZM15.4976 14.5L13.2376 12.98L17.1576 7H20.6376L15.4976 14.5Z"
            fill="#C0C0C0"
          />
        </svg>
      </NodeToolbar>
      {children}
    </>
  );
};

export default Toolbar;
