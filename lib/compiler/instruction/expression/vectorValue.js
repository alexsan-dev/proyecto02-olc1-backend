"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const error_1 = __importDefault(require("../../error"));
const value_1 = __importDefault(require("./value"));
class VectorValue extends value_1.default {
    props;
    index;
    type;
    constructor(token, props) {
        super(token, props);
        this.props = props;
        this.index = -1;
        this.type = this.props.type;
    }
    getIndex() {
        return this.index;
    }
    getType() {
        return this.type;
    }
    compile(env) {
        let compile = true;
        if (this.props.index.compile()) {
            const indexValue = this.props.index.getValue(env);
            const index = indexValue?.getValue(env);
            if (index !== undefined && indexValue?.getType() === types_1.default.INTEGER) {
                this.index = index;
            }
            else {
                compile = false;
                error_1.default.push({
                    type: 'Semantic',
                    token: this.token,
                    msg: `La posicion del arreglo ${this.props.value} debe ser un ${types_1.default.INTEGER}.`,
                });
            }
        }
        if (compile) {
            const newValue = env.getVar(this.props.value);
            if (newValue?.compile(env)) {
                this.type = newValue.props.generic || types_1.default.STRING;
                this.props.generic = undefined;
                this.props.type = newValue.props.generic || types_1.default.STRING;
            }
            else
                compile = false;
        }
        return compile;
    }
    getValue(env) {
        if (env) {
            if (this.props.value) {
                const newValue = env.getVar(this.props.value);
                if (newValue?.compile(env)) {
                    const value = newValue.getValue(env);
                    if (this.index >= 0 && this.index < value.length) {
                        return value[this.index];
                    }
                    else
                        error_1.default.push({
                            type: 'Semantic',
                            token: this.token,
                            msg: `La posicion ${this.index} esta fuera de rango para la lista ${this.props.value}.`,
                        });
                }
            }
        }
    }
}
exports.default = VectorValue;
