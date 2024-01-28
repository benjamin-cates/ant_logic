import { Edge, Node } from "reactflow";

import { simulate } from "../../utils/logic";


type Difficulty = "intro" | "easy" | "medium" | "hard";

interface Level {
  default_nodes: Node[];
  testing_function: (nodes: Node[], edges: Edge[]) => number[];
  available_gates: string[];
  prompt: string;
  name: string;
  difficulty: Difficulty,
} 

function make_bulb(id: number, label: string): Node {
  return {
    id: "bulb" + id.toString(),
    type: "Bulb",
    position: { x: 0, y: 200 * id },
    data: { on: false, label },
    selectable: false,
    deletable: false,
  };
}

function make_bumi(num_bulbs: number): Node {
  return {
    id: "bumi",
    type: "Bumi",
    position: { x: 500, y: ((num_bulbs - 1) * 200) / 2 + 20 },
    data: { on: false },
    deletable: false,
    draggable: false,
    selectable: false,
    positionAbsolute: { x: 0, y: 0 },
  };
}

const puzzleOrder = [
    0, // Tutorial
    1, // AND gate
    2, // OR gate
    3, // NOT gate
    4, // XOR gate
    5, // isFive(x)
    11, // Demorgan's
    6, // Feeding Time
    7, // Prime number
    10, // Odd numbers
    8, // XOR v2
    9, // Prime numbers v2
];

function nextPuzzle(id: number): number {
    return puzzleOrder[puzzleOrder.indexOf(id) + 1];
}

function create_test_function(input_count: number, should_activate: number[]): (nodes: Node[], edges: Edge[]) => number[] {
    return (nodes: Node[], edges: Edge[]) => {
        let wrong_inputs: number[] = [];
        let bulb_indicies: number[] = [];
        for(let x = 0; x < input_count; x++) {
            bulb_indicies.push(nodes.findIndex(node=>node.id=="bulb"+x.toString()));
        }
        let old_bulb_states = bulb_indicies.map(idx => nodes[idx].data.on);
        for(let i = 0;i < (1 << input_count); i++) {
            for(let x = 0; x < input_count; x++) {
                nodes[bulb_indicies[x]].data.on = (i & (1 << x)) != 0;
            }
            let output = simulate(nodes,edges).active_nodes.includes("bumi");
            if(output != should_activate.includes(i)) wrong_inputs.push(i);
        }
        old_bulb_states.forEach((state,idx) => nodes[bulb_indicies[idx]].data.on = state);
        return wrong_inputs;
    };
}

const level_data: Level[] = [
  {
    name: "Tutorial",
    default_nodes: [make_bulb(0, "Input A"), make_bumi(1)],
    available_gates: [],
    testing_function: create_test_function(1, [1]),
    prompt:
      "Welcome to AntLogic! This is Bumi, he is a very hungry anteater who craves electricity, for some unexplained reason. He is very picky about which power sources he eats from, so in most puzzles you will need to use logic gates to direct the flow of power.<br/><br/>Hitting the button on a light switch will turn it on/off. Clicking and dragging from any node square to another will establish a connection. If Bumi is receiving power, he will wag his tounge :)<br/><br/>For puzzles, your solutions must work for <em>every</em> possible input.<br/><br/><em>To complete this puzzle, feed Bumi when input A is on, and don't feed him when it's off.</em>",
    difficulty: "intro",
  },
  {
    name: "AND gate",
    default_nodes: [
      make_bulb(0, "Input A"),
      make_bulb(1, "Input B"),
      make_bumi(2),
    ],
    available_gates: ["AND"],
    testing_function: create_test_function(2, [3]),
    prompt:
      "Introducing your first gate: AND. This gate will only turn on if <em>both</em> of its inputs are on.<br/><br/>*Remember you can always view your gates in the Gate Library Tab!<br/><br/><em>To complete this puzzle, Build an ant circuit that feeds Bumi when both inputs are on.</em>",
    difficulty: "intro",
  },
  {
    name: "OR gate",
    default_nodes: [
      make_bulb(0, "Input A"),
      make_bulb(1, "Input B"),
      make_bumi(2),
    ],
    available_gates: ["OR"],
    testing_function: create_test_function(2, [1,2,3]),
    prompt:
      "Introducing your next gate: OR. This gate will turn on if <em>at least 1</em> of its inputs are on.<br/><br/>*Remember you can always view your gates in the Gate Library Tab!<br/><br/><em>To complete this puzzle, Build an ant circuit that feeds Bumi when at least 1 input is on.</em>",
    difficulty: "intro",
  },
  {
    name: "NOT gate",
    default_nodes: [make_bulb(0, "Input A"), make_bumi(1)],
    available_gates: ["NOT"],
    testing_function: create_test_function(1, [0]),
    prompt:
      "Your last simple gate is NOT. This gate will only turn on if the input is <em>off</em>.<br/><br/>*Remember you can always view your gates in the Gate Library Tab!<br/><br/><em>To complete this puzzle, Build an ant circuit that feeds Bumi when the input is off.</em>",
    difficulty: "intro",
  },
  {
    name: "XOR gate",
    default_nodes: [
      make_bulb(0, "Input A"),
      make_bulb(1, "Input B"),
      make_bumi(2),
    ],
    available_gates: ["AND", "OR", "NOT"],
    testing_function: create_test_function(2, [1, 2]),
    prompt:
      "Bumi is learning about a new kind of gate in his computer science class. This gate is called XOR and turns on if either the first input is on or the second input is on, but not if both are on. However, it seems that you don’t have this gate anywhere in your zookeeper shed. Build an ant circuit that is equivalent to this, but with different gates, so we can teach Bumi how it works!",
    difficulty: "intro",
  },
  {
    name: "isFive(x)",
    default_nodes: [
      make_bulb(0, "Input A (001)"),
      make_bulb(1, "Input B (010)"),
      make_bulb(2, "Input C (100)"),
      make_bumi(3),
    ],
    available_gates: ["AND", "OR", "NOT"],
    testing_function: create_test_function(3, [5]),
    prompt:
      "As a computer science student Bumi is trying to learn binary. A good example number is 5, which is “101” in binary. Build an ant circuit that teaches him what the number 5 is by only turning on when that input is given.",
    difficulty: "easy",
  },
  {
    name: "Feeding time",
    default_nodes: [
      make_bulb(0, "Breakfast"),
      make_bulb(1, "Lunch"),
      make_bulb(2, "Dinner"),
      make_bumi(3),
    ],
    available_gates: ["AND", "OR", "NOT", "XOR"],
    testing_function: create_test_function(3, [1, 2, 4]),
    prompt:
      "A wildlife researcher built a circuit that triggers when Bumi’s feeding times are. It outputs “001” for breakfast, “010” for lunch, and “100” for dinner. Build an ant circuit that feeds Bumi when only exactly one of these bulbs is on.",
    difficulty: "medium",
  },
  {
    name: "Prime numbers",
    default_nodes: [
      make_bulb(0, "Bit A (001)"),
      make_bulb(1, "Bit B (010)"),
      make_bulb(2, "Bit C (100)"),
      make_bumi(3),
    ],
    available_gates: ["NOT","AND","OR","XOR","NAND","NOR"],
    testing_function: create_test_function(3, [2, 3, 5, 7]),
    prompt:
      "Bumi is taking a math class and is struggling to understand what numbers are prime. He keeps forgetting that 2 is prime and he keeps thinking that 1 is prime. Build an ant circuit that feeds Bumi if and only if the input is a prime binary number.",
    difficulty: "medium",
  },
  {
    name: "XOR v2",
    default_nodes: [
      make_bulb(0, "Input A"),
      make_bulb(1, "Input B"),
      make_bumi(2),
    ],
    available_gates: ["NAND"],
    testing_function: create_test_function(2, [1, 2]),
    prompt:
      "Bumi needs reinforcement on his XOR exercise. If you forgot, only turn the light on if either one of the lights is on, but not both. However, it seems that you have run out of ant gates except for NAND gates until the next shipment comes! Build this circuit using only NAND gates.",
    difficulty: "hard",
  },
  {
    name: "Prime numbers v2",
    default_nodes: [
      make_bulb(0, "Bit A (001)"),
      make_bulb(1, "Bit B (010)"),
      make_bulb(2, "Bit C (100)"),
      make_bumi(3),
    ],
    available_gates: ["NOR"],
    testing_function: create_test_function(3, [2, 3, 5, 7]),
    prompt:
      "Despite his first lesson, Bumi is still struggling to learn prime numbers. Build him another ant circuit lesson, but oh no! We seem to only have NOR gates left!",
    difficulty: "hard",
  },
  {
    name: "Odd numbers",
    default_nodes: [
      make_bulb(0, "Input A"),
      make_bulb(1, "Input B"),
      make_bulb(2, "Input C"),
      make_bulb(3, "Input D"),
      make_bulb(4, "Input E"),
      make_bumi(5),
    ],
    available_gates: ["NOT","AND","OR","XOR","NAND","NOR"],
    testing_function: create_test_function(
      5,
      [
        0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b00111, 0b01110, 0b11100,
        0b01101, 0b11001, 0b11010, 0b01011, 0b10011, 0b10110, 0b10101, 0b11111,
      ]
    ),
    prompt:
      "In Bumi’s math class, he is learning about odd numbers and counting. To train him, he is given 5 light bulbs and only given food when an odd number of bulbs are lit up. Build an ant circuit that accomplishes this.",
    difficulty: "medium",
  },
  {
    name: "DeMorgan's Law",
    default_nodes: [
      make_bulb(0, "Input A"),
      make_bulb(1, "Input B"),
      make_bumi(2),
    ],
    available_gates: ["OR", "NOT"],
    testing_function: create_test_function(2, [3]),
    prompt:
      "According to Bumi's Boolean Logic teacher, an AND gate can be constructed with just NOT gates and OR gates. To give Bumi a head start, his teacher said that DeMorgan's Law is NOT(a OR b) ≡ NOT(a) AND NOT(b). Create an ant circuit that simulates an AND gate using only OR gates and NOT gates.",
    difficulty: "easy",
  },
];

export { level_data, puzzleOrder, nextPuzzle};
