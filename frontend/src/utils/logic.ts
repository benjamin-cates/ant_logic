import _, {Edge, Node, getConnectedEdges} from "reactflow";
interface SimulateOutput {
    active_nodes: string[],
}

function run_gate(name: string, inputs: boolean[]): boolean | undefined {
    if(name == "Bumi" || name == "NOT") {
        if(inputs.length != 1) return undefined;
    }
    else {
        if(inputs.length != 2) return undefined;
    }
    if(name == "Bumi") return inputs[0];
    if(name == "NOT") return !inputs[0];
    if(name == "AND") return inputs[0] && inputs[1];
    if(name == "OR") return inputs[0] || inputs[1];
    if(name == "XOR") return inputs[0] !== inputs[1];
    if(name == "NAND") return !(inputs[0] && inputs[1]);
    if(name == "NOR") return !(inputs[0] || inputs[1]);
    if(name == "XNOR") return !(inputs[0] !== inputs[1]);
}


function simulate(nodes: Node[], edges: Edge[]): SimulateOutput {
    let node_activation: (boolean | undefined)[] = Array.apply(null,Array(nodes.length)).map(_ => undefined);
    for(let i = 0;i < 20;i++) {
        node_activation = node_activation.map((activation,index) => {
            if(activation != undefined) return activation
            if(nodes[index].type == "Bulb") return nodes[index].data.on as boolean;
            let inputs: (boolean | undefined)[] = getConnectedEdges([nodes[index]],edges)
                .filter(node => node.source != nodes[index].id)
                .map(edge => nodes.findIndex(node => node.id == edge.source))
                .map(index => node_activation[index]);
            if(nodes[index].type == "AND") console.log(inputs);
            if(inputs.every(input => input != undefined)) {
                return run_gate(nodes[index].type!,inputs as boolean[]);
            }
            return undefined;
        });
        if(node_activation.every(val=> val!=undefined)) break;
    }
    return {active_nodes: node_activation
        .map((active, idx) => ({id: nodes[idx].id, active}))
        .filter(activation => activation.active == true)
        .map(node => node.id)};
}

export {simulate};
