"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../../runtime/environment"));
const models_1 = __importDefault(require("../models"));
class Condition extends models_1.default {
    token;
    props;
    constructor(token, props) {
        super(token, 'Condition');
        this.token = token;
        this.props = props;
    }
    compile(env) {
        let compile = true;
        compile = this.props.valid.exp.compile();
        if (compile) {
            const value = this.props.valid.exp.getValue(env);
            compile = value?.compile(env) ?? true;
            if (compile && value?.getValue(env)) {
                const environment = new environment_1.default('Condition', 'if', env);
                compile = this.props.valid.body
                    .map((instruction) => instruction.compile(environment))
                    .every((compile) => compile === true);
            }
            else {
                const inValidCondition = () => {
                    if (this.props.inValid) {
                        const environment = new environment_1.default('Condition', 'else', env);
                        compile = this.props.inValid.body
                            .map((instruction) => instruction.compile(environment))
                            .every((compile) => compile === true);
                    }
                };
                if (this.props.fallback) {
                    let foundValid = false;
                    for (let conditionIndex = 0, length = this.props.fallback.length; conditionIndex < length; conditionIndex++) {
                        compile = this.props.fallback[conditionIndex].exp.compile();
                        if (compile) {
                            const value = this.props.fallback[conditionIndex].exp.getValue(env);
                            compile = value?.compile(env) ?? true;
                            if (compile && value?.getValue(env)) {
                                foundValid = true;
                                const environment = new environment_1.default('Condition', 'else if', env);
                                compile = this.props.fallback[conditionIndex].body
                                    .map((instruction) => instruction.compile(environment))
                                    .every((compile) => compile === true);
                                break;
                            }
                        }
                    }
                    if (!foundValid)
                        inValidCondition();
                }
                else
                    inValidCondition();
            }
        }
        return compile;
    }
}
exports.default = Condition;
