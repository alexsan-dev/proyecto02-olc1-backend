"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("./runtime/environment"));
const error_1 = __importDefault(require("./error"));
const compile = (instructions) => {
    const globalEnv = new environment_1.default('Global', 'Global');
    instructions.forEach((instruction) => {
        if (instruction.name === 'Function') {
            const functionBlock = instruction;
            globalEnv.addFunction(functionBlock.props.id, functionBlock.props.type, functionBlock);
        }
        else if (instruction.name === 'Declaration') {
            instruction.compile(globalEnv);
        }
        else if (instruction.name === 'Assignment') {
            instruction.compile(globalEnv);
        }
    });
    const mainIndex = instructions.findIndex((instruction) => instruction.name === 'Main');
    if (mainIndex >= 0)
        instructions[mainIndex].compile(globalEnv);
    else
        error_1.default.push({
            type: 'Semantic',
            token: { line: 0, col: 0 },
            msg: 'No se ha definido ningun start with',
        });
};
exports.default = compile;
