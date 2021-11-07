"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../../runtime/environment"));
const functions_1 = __importDefault(require("../methods/functions"));
const cycle_1 = __importDefault(require("./cycle"));
class ForLoop extends cycle_1.default {
    props;
    isOnLoopContinue = false;
    loopHandleBreak = false;
    isOnLoopBreak = false;
    constructor(token, props) {
        super(token, { condition: props.condition, body: props.body });
        this.props = props;
    }
    addLoopControlFunction(env, name) {
        env.addFunction(name, 'void', new functions_1.default(this.token, {
            id: name,
            type: 'void',
            content: [
                {
                    token: this.token,
                    name: 'FunctionCall',
                    compile: () => {
                        if (name == 'continue')
                            this.isOnLoopContinue = true;
                        else
                            this.isOnLoopBreak = true;
                        return true;
                    },
                },
            ],
            params: [],
        }));
    }
    compile(env) {
        const containerEnv = new environment_1.default('Loop', 'for-container', env);
        this.addLoopControlFunction(containerEnv, 'continue');
        this.addLoopControlFunction(containerEnv, 'return');
        this.addLoopControlFunction(containerEnv, 'break');
        this.props.assignments.forEach((assignment) => assignment.compile(this.props.withDeclarations ? containerEnv : env));
        while (this.props.condition.compile(containerEnv) &&
            this.props.condition.getValue(containerEnv)?.compile(containerEnv) &&
            this.props.condition.getValue(containerEnv)?.getValue(containerEnv) &&
            !this.loopHandleBreak &&
            !this.isOnLoopBreak) {
            const localEnv = new environment_1.default('Loop', 'for-content', containerEnv);
            for (let instructionCount = 0, length = this.props.body.length; instructionCount < length; instructionCount++) {
                const instruction = this.props.body[instructionCount];
                if (!this.isOnLoopBreak && !this.isOnLoopContinue)
                    this.loopHandleBreak = !instruction.compile(localEnv);
                else {
                    if (this.isOnLoopContinue)
                        this.isOnLoopContinue = false;
                    break;
                }
            }
            this.loopHandleBreak = !this.props.modifiers.compile(containerEnv);
        }
        return true;
    }
}
exports.default = ForLoop;
