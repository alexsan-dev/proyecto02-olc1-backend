"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("../expression");
const assignment_1 = __importDefault(require("./assignment"));
const error_1 = __importDefault(require("../../error"));
class VectorPosition extends assignment_1.default {
    props;
    constructor(token, props) {
        super(token, props.value.props.value);
        this.props = props;
        this.id = props.value.props.value;
    }
    compile(env) {
        if (this.id) {
            const refValue = env.getVar(this.id);
            if (refValue?.compile(env)) {
                return this.setValue(env, refValue.getType(), this.getValue(env));
            }
            else
                return false;
        }
        else
            return false;
    }
    setValue(env, _type, value) {
        let compile = true;
        if (this.id) {
            const refValue = env.getVar(this.id);
            if (refValue) {
                const temporal = refValue.getValue(env);
                if (temporal) {
                    if (this.props.value.compile(env)) {
                        const index = this.props.value.getIndex();
                        if (index >= 0 && index < temporal.length) {
                            if (refValue.props.generic === value?.getType()) {
                                const newValue = value?.getValue(env);
                                if (newValue && value?.compile(env)) {
                                    temporal[index] = newValue;
                                    env.setVar(this.id, new expression_1.Value(this.token, {
                                        value: [...temporal],
                                        type: refValue.getType(),
                                        generic: refValue.props.generic,
                                    }));
                                }
                            }
                            else
                                error_1.default.push({
                                    type: 'Semantic',
                                    token: this.token,
                                    msg: `No se puede asignar el tipo ${value?.getType()} a ${refValue.props.generic}`,
                                });
                        }
                        else {
                            compile = false;
                            error_1.default.push({
                                type: 'Semantic',
                                token: this.token,
                                msg: `La posicion ${index} esta fuera de rango para la lista ${this.props.value.props.value}.`,
                            });
                        }
                    }
                }
                else {
                    compile = false;
                    error_1.default.push({
                        token: this.token,
                        type: 'Semantic',
                        msg: `El arreglo ${this.id} esta vacio.`,
                    });
                }
            }
            else {
                compile = false;
                error_1.default.push({
                    token: this.token,
                    type: 'Semantic',
                    msg: `La variable ${this.id} no existe.`,
                });
            }
        }
        return compile;
    }
    getValue(env) {
        if (this.props.exp.compile(env)) {
            const value = this.props.exp.getValue(env);
            return value;
        }
    }
}
exports.default = VectorPosition;
