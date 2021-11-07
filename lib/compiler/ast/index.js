"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDot = void 0;
const graphviz_1 = __importDefault(require("graphviz"));
let g;
const startInitGraphviz = () => {
    g = graphviz_1.default.digraph('G');
};
const getRandom = () => {
    return Math.round(Math.random() * 10000);
};
const generateDot = (instructions) => {
    if (g) {
        const parentNode = g.addNode('Main');
        const graphAExpression = (expNode, rand, exp) => {
            if (g) {
                if (exp?.props.operator) {
                    graphAExpression(expNode, rand, exp.props.left);
                    const oper = g.addNode(`${exp.props.operator}_${rand}`, { label: exp.props.operator });
                    g.addEdge(expNode, oper);
                    graphAExpression(expNode, rand, exp.props.right);
                }
                else if (exp?.props.value) {
                    const valRand = getRandom();
                    const valNode = g.addNode(`Value_${rand}_${valRand}`, { label: 'Value' });
                    const valNodeVal = g.addNode(`${exp.props.value.props.value}_${rand}_${valRand}`, {
                        label: exp.props.value.props.value,
                    });
                    g.addEdge(expNode, valNode);
                    g.addEdge(valNode, valNodeVal);
                }
            }
        };
        instructions.forEach((instruction) => {
            if (instruction.name !== 'Main') {
                if (g) {
                    if (instruction.name === 'Function') {
                        const func = instruction;
                        const newNode = g.addNode(`${instruction.name}_${func.props.id}_${getRandom()}`, {
                            label: instruction.name,
                        });
                        const content = func?.props?.content;
                        content.forEach((item) => {
                            if (g) {
                                const rand = getRandom();
                                const nextNode = g.addNode(item.name, { label: `${item.name}_${rand}` });
                                g.addEdge(newNode, nextNode);
                                if (item.name === 'FunctionCall') {
                                    const call = item;
                                    const newParentNode = g.addNode(`${call.props?.id + '_' ?? ''}${rand}`, {
                                        label: call.props?.id,
                                    });
                                    g.addEdge(nextNode, newParentNode);
                                    const par = g.addNode(`(_${rand}`, { label: '(' });
                                    g.addEdge(nextNode, par);
                                    call.props.params.forEach((param) => {
                                        if (g) {
                                            const newRand = getRandom();
                                            const expNode = g?.addNode(`Expression_${newRand}`, { label: 'Expression' });
                                            graphAExpression(expNode, newRand, param);
                                            g?.addEdge(nextNode, expNode);
                                        }
                                    });
                                    const par2 = g.addNode(`)_${rand}`, { label: ')' });
                                    g.addEdge(nextNode, par2);
                                }
                            }
                        });
                        g?.addEdge(parentNode, newNode);
                    }
                }
            }
        });
        return g.to_dot();
    }
};
exports.generateDot = generateDot;
exports.default = startInitGraphviz;
