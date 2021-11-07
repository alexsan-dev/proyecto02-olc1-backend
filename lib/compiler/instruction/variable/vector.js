"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const assignment_1 = __importDefault(require("./assignment"));
const expression_1 = require("../expression");
const error_1 = __importDefault(require("../../error"));
class VectorAssignment extends assignment_1.default {
    props;
    constructor(token, props) {
        super(token, props.id);
        this.props = props;
    }
    compile(env, type) {
        let compile = true;
        if (this.props.defValues?.length) {
            const compiles = this.props.defValues.map((exp) => exp.compile(env));
            compile = compiles.every((compile) => compile === true);
        }
        else {
            const sizeValue = this.props.size?.getValue(env);
            if (sizeValue?.getType() === types_1.default.INTEGER) {
                if (this.props.size && sizeValue.getValue(env) >= 0)
                    compile = true;
                else
                    compile = false;
            }
            else {
                compile = false;
                error_1.default.push({
                    type: 'Semantic',
                    token: this.token,
                    msg: `El tamaño del vector deber ser un ${types_1.default.INTEGER}`,
                });
            }
        }
        const newValue = this.getValue(env, type);
        if (compile) {
            if (newValue?.compile(env)) {
                compile = super.setValue(env, types_1.default.ARRAY, newValue);
            }
            else
                compile = false;
        }
        return compile;
    }
    getValue(env, type) {
        if (this.props.defValues) {
            const values = this.props.defValues
                .map((exp) => {
                const value = exp.getValue(env);
                if (value?.compile(env)) {
                    return {
                        value: value?.getValue(env),
                        type: value?.getType(),
                    };
                }
            })
                .filter(Boolean);
            if (values.every((value) => value.type === values[0].type)) {
                if (values[0].type === type) {
                    const validValues = values.map((value) => value.value);
                    const newValue = new expression_1.Value(this.token, {
                        value: validValues,
                        type: types_1.default.ARRAY,
                        generic: type,
                    });
                    return newValue;
                }
                else
                    error_1.default.push({
                        type: 'Semantic',
                        token: this.token,
                        msg: `No se puede asignar el tipo ${values[0].type} a ${type}.`,
                    });
            }
            else
                error_1.default.push({
                    type: 'Semantic',
                    token: this.token,
                    msg: 'La lista de valores debe ser del mismo tipo.',
                });
        }
        else if (this.props.size) {
            const value = this.props.size.getValue(env);
            if (value?.getType() === types_1.default.INTEGER) {
                return new expression_1.Value(this.token, {
                    value: new Array(value.getValue(env)).fill(undefined),
                    type: types_1.default.ARRAY,
                    generic: type,
                });
            }
            else
                error_1.default.push({
                    type: 'Semantic',
                    token: this.token,
                    msg: `El tamaño del vector deber ser un ${types_1.default.INTEGER}`,
                });
        }
        else
            error_1.default.push({
                type: 'Semantic',
                token: this.token,
                msg: 'Fue imposible asignar el vector',
            });
    }
}
exports.default = VectorAssignment;
