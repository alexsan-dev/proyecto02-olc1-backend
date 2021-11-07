"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const value_1 = __importDefault(require("../expression/value"));
const models_1 = __importDefault(require("../models"));
const error_1 = __importDefault(require("../../error"));
class FunctionCall extends models_1.default {
    props;
    builtIn;
    functionValue;
    refType;
    constructor(token, props, builtIn = false) {
        super(token, 'FunctionCall');
        this.props = props;
        this.builtIn = builtIn;
        this.refType = utils_1.DataType.ID;
    }
    getValue() {
        return this.functionValue;
    }
    getType() {
        return this.refType;
    }
    isBuiltIn() {
        return this.builtIn;
    }
    compile(env) {
        const functionBlock = env.getFunction(this.props.id);
        if (functionBlock) {
            functionBlock.setEnv(env);
            const functionEnv = functionBlock.getEnv();
            if (functionEnv) {
                const values = this.props.params.map((exp) => ({
                    value: exp.getValue(env),
                    type: exp.getValue(env)?.getType(),
                }));
                if (this.props.params.map((exp) => exp.compile(functionEnv)).every((exp) => exp === true)) {
                    if (functionBlock.props.params.length === this.props.params.length) {
                        let compile = true;
                        values.forEach((value, index) => {
                            compile = value.value.compile(env);
                            if (compile) {
                                if (value.type === functionBlock.props.params[index].type ||
                                    value.value.props.generic === functionBlock.props.params[index].type ||
                                    `${utils_1.DataType.DYNAMICLIST}<${value.value.props.generic}>` ===
                                        functionBlock.props.params[index].type) {
                                    if (value.value.compile(env)) {
                                        const copy = new value_1.default(this.token, {
                                            value: value.value.getValue(env) ?? '',
                                            type: value.value.getType(),
                                            generic: value.value.props.generic,
                                        });
                                        functionEnv.addVar(functionBlock.props.params[index].id, value.type, copy);
                                    }
                                }
                                else {
                                    error_1.default.push({
                                        type: 'Semantic',
                                        token: this.token,
                                        msg: `Se esperaba un ${functionBlock.props.params[index].type} en el parametro ${index + 1} en la function.`,
                                    });
                                    compile = false;
                                }
                            }
                        });
                        compile = functionBlock.compile();
                        if (compile) {
                            const functionValue = functionBlock.getValue();
                            if (functionValue) {
                                this.functionValue = functionValue?.getValue(env);
                                this.refType = functionValue?.getType();
                                this.props.generic = functionValue.props.generic;
                            }
                        }
                        return compile;
                    }
                    else {
                        error_1.default.push({
                            type: 'Semantic',
                            token: this.token,
                            msg: `Se esperaban ${functionBlock.props.params.length} parametros pero se obtuvieron ${this.props.params.length} en la funcion ${this.props.id}`,
                        });
                        return false;
                    }
                }
                else
                    return false;
            }
            else
                return false;
        }
        else {
            error_1.default.push({
                type: 'Semantic',
                token: this.token,
                msg: `La funcion ${this.props.id} no existe.`,
            });
            return false;
        }
    }
}
exports.default = FunctionCall;
