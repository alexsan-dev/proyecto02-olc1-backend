"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const value_1 = __importDefault(require("../expression/value"));
const call_1 = __importDefault(require("./call"));
const error_1 = __importDefault(require("../../error"));
class Append extends call_1.default {
    props;
    constructor(token, props) {
        super(token, { ...props, id: 'Append' }, true);
        this.props = props;
    }
    compile(env) {
        let compile = true;
        const list = env.getVar(this.props.id);
        if (list) {
            if (list.compile(env)) {
                if (this.props.params[0].compile(env)) {
                    const newValue = this.props.params[0].getValue(env);
                    if (newValue && newValue.compile(env)) {
                        if (newValue.getType() === list.props.generic ||
                            `${types_1.default.DYNAMICLIST}<${newValue.props.generic}>` === list.props.generic) {
                            const temporal = list.getValue(env);
                            temporal.push(newValue.getValue(env));
                            env.setVar(this.props.id, new value_1.default(this.token, {
                                value: temporal,
                                type: types_1.default.DYNAMICLIST,
                                generic: list.props.generic,
                            }));
                        }
                        else {
                            compile = false;
                            error_1.default.push({
                                token: this.token,
                                type: 'Semantic',
                                msg: `El no se puede asignar el tipo ${newValue.getType()} a ${list.props.generic}.`,
                            });
                        }
                    }
                }
            }
        }
        else {
            compile = false;
            error_1.default.push({
                token: this.token,
                type: 'Semantic',
                msg: `La lista dinamica ${this.props.id} no existe.`,
            });
        }
        return compile;
    }
}
exports.default = Append;
