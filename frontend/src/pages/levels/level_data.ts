import {Node, Edge} from "reactflow";
import { simulate } from "../../utils/logic";

interface Level {
    default_nodes: Node[],
    testing_function: (nodes: Node[],edges: Edge[]) => number[],
    available_gates: string[],
    prompt: string,
    name: string,
}

function make_bulb(id: number, label: string): Node {
    return {
        id: "bulb" + id.toString(),
        type: "Bulb",
        position: {x: 0, y: 200 * id},
        data: {on: false, label},
        deletable: false,
    };
}

function make_bumi(): Node {
    return {
        id: "bumi",
        type: "Bumi",
        position: {x: 500, y: 100},
        data: {on: false},
        deletable: false,
        draggable: false,
        selectable: false,
        positionAbsolute: { x: 0, y: 0 },
    };
}

function create_test_function(input_count: number, should_activate: number[]): (nodes: Node[], edges: Edge[]) => number[] {
    return (nodes: Node[], edges: Edge[]) => {
        let wrong_inputs: number[] = [];
        let bulb_indicies: number[] = [];
        for(let x = 0; x < input_count; x++) {
            bulb_indicies.push(nodes.findIndex(node=>node.id=="bulb"+x.toString()));
        }
        let old_bulb_states = bulb_indicies.map(idx => nodes[idx].data.on);
        console.log("Bulb indicies: "+bulb_indicies);
        for(let i = 0;i < (1 << input_count); i++) {
            for(let x = 0; x < input_count; x++) {
                nodes[bulb_indicies[x]].data.on = (i & (1 << x)) != 0;
            }
            let output = simulate(nodes,edges).active_nodes.includes("bumi");
            console.log("output for "+i+": "+output);
            if(output != should_activate.includes(i)) wrong_inputs.push(i);
        }
        old_bulb_states.forEach((state,idx) => nodes[bulb_indicies[idx]].data.on = state);
        return wrong_inputs;
    }
}

const level_data: Level[] = [
    {
        name: "Tutorial",
        default_nodes: [
            make_bulb(0, "Input A"),
            make_bumi(),
        ],
        available_gates: [],
        testing_function: create_test_function(2, [2]),
        prompt: "Welcome to AntLogic! This is Bumi, he is a very hungry anteater who craves electricity, for some unexplained reason. He is very picky about which power sources he eats from, so in most puzzles you will need to use logic gates to direct the flow of power.<br/><br/>Hitting the button on a light switch will turn it on/off. Clicking and dragging from any node square to another will establish a connection. If Bumi is receiving power, he will wag his tounge :)<br/><br/><em>To complete this puzzle, feed Bumi when input A is on, and don't feed him when it's off.</em>"
    },
    {
        name: "AND gate",
        default_nodes: [
            make_bulb(0, "Input A"),
            make_bulb(1, "Input B"),
            make_bumi(),
        ],
        available_gates: ["AND"],
        testing_function: create_test_function(2, [3]),
        prompt: "How the game works: On the left are multiple input switches represented by these light bulbs. Sometimes the light bulbs represent a binary number where the bottom light represents 1, the light above it represents 2, the third light would represent 4, etc. Bumi is on the left and is hungry waiting for ants! But don’t feed him if you aren’t supposed to. Bumi is sleepy! In order to wake him up, the zookeepers turn on both lights to wake him up. Design an ant circuit that feeds him if both lights are on and doesn’t feed him when he’s asleep.",
    },
    {
        name: "XOR gate",
        default_nodes: [
            make_bulb(0, "Input A"),
            make_bulb(1, "Input B"),
            make_bumi(),
        ],
        available_gates: ["AND", "OR", "NOT"],
        testing_function: create_test_function(2, [1,2]),
        prompt: "Bumi is learning about a new kind of gate in his computer science class. This gate is called XOR and turns on if either the first input is on or the second input is on, but not if both are on. However, it seems that you don’t have this gate anywhere in your zookeeper shed. Build an ant circuit that is equivalent to this, but with different gates, so we can teach Bumi how it works!"
    },
    {
        name: "isFive(x)",
        default_nodes: [
            make_bulb(0, "Input A (001)"),
            make_bulb(1, "Input B (010)"),
            make_bulb(2, "Input C (100)"),
            make_bumi(),
        ],
        available_gates: ["AND", "OR", "NOT"],
        testing_function: create_test_function(3, [5]),
        prompt: "As a computer science student Bumi is trying to learn binary. A good example number is 5, which is “101” in binary. Build an ant circuit that teaches him what the number 5 is by only turning on when that input is given.",
    },
    {
        name: "Feeding time",
        default_nodes: [
            make_bulb(0, "Breakfast"),
            make_bulb(1, "Lunch"),
            make_bulb(2, "Dinner"),
            make_bumi(),
        ],
        available_gates: ["AND", "OR", "NOT", "XOR"],
        testing_function: create_test_function(3, [1,2,4]),
        prompt: "A wildlife researcher built a circuit that triggers when Bumi’s feeding times are. It outputs “001” for breakfast, “010” for lunch, and “100” for dinner. Build an ant circuit that feeds Bumi when only exactly one of these bulbs is on.",
    },
    {
        name: "Prime numbers",
        default_nodes: [
            make_bulb(0, "Bit A (001)"),
            make_bulb(1, "Bit B (010)"),
            make_bulb(2, "Bit C (100)"),
            make_bumi(),
        ],
        available_gates: ["AND", "OR", "NOT", "XOR"],
        testing_function: create_test_function(3, [2,3,5,7]),
        prompt: "Bumi is taking a math class and is struggling to understand what numbers are prime. He keeps forgetting that 2 is prime and he keeps thinking that 1 is prime. Build an ant circuit that feeds Bumi if and only if the input is a prime binary number.",
    },
    {
        name: "XOR v2",
        default_nodes: [
            make_bulb(0, "Input A"),
            make_bulb(1, "Input B"),
            make_bumi(),
        ],
        available_gates: ["NAND"],
        testing_function: create_test_function(2, [1,2]),
        prompt: "Bumi needs reinforcement on his XOR exercise. If you forgot, only turn the light on if either one of the lights is on, but not both. However, it seems that you have run out of ant gates except for NAND gates until the next shipment comes! Build this circuit using only NAND gates",
    },
    {
        name: "Prime numbers v2",
        default_nodes: [
            make_bulb(0, "Bit A (001)"),
            make_bulb(1, "Bit B (010)"),
            make_bulb(2, "Bit C (100)"),
            make_bumi(),
        ],
        available_gates: ["NOR"],
        testing_function: create_test_function(3, [2,3,5,7]),
        prompt: "Despite his first lesson, Bumi is still struggling to learn prime numbers. Build him another ant circuit lesson, but oh no! We seem to only have NOR gates left!"
    },
    {
        name: "Odd numbers",
        default_nodes: [
            make_bulb(0, "Input A"),
            make_bulb(1, "Input B"),
            make_bulb(2, "Input C"),
            make_bulb(3, "Input D"),
            make_bulb(4, "Input E"),
            make_bumi(),
        ],
        available_gates: ["NOR"],
        testing_function: create_test_function(3, [0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b00111, 0b01110, 0b11100, 0b01101, 0b11001, 0b11010, 0b01011, 0b10011, 0b10110, 0b10101, 0b1111]),
        prompt: "In Bumi’s math class, he is learning about odd numbers and counting. To train him, he is given 5 light bulbs and only given food when an odd number of bulbs are lit up. Build an ant circuit that accomplishes this",
    },
];

export { level_data };
