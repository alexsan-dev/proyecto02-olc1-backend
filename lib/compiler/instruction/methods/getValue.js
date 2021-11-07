"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("../../utils/types"));
const call_1 = __importDefault(require("./call"));
const error_1 = __importDefault(require("../../error"));
class GetValue extends call_1.default {
    props;
    refValue;
    listType;
    constructor(token, props) {
        super(token, { ...props, id: 'GetValue' }, true);
        this.props = props;
        this.listType = types_1.default.ID;
        this.props.id = 'GetValue';
    }
    compile(env) {
        let compile = true;
        const list = env.getVar(this.props.id);
        if (list) {
            if (list.compile(env)) {
                if (this.props.params[0].compile(env)) {
                    const indexValue = this.props.params[0].getValue(env);
                    if (indexValue && indexValue.compile(env)) {
                        if (indexValue.getType() === types_1.default.INTEGER) {
                            const indexNum = indexValue.getValue(env);
                            const currentList = list.getValue(env);
                            if (indexNum >= 0 && indexNum < currentList.length) {
                                this.refValue = currentList[indexNum];
                                this.props.generic = list.props.generic ?? types_1.default.STRING;
                                this.listType = list.getType();
                            }
                            else {
                                compile = false;
                                error_1.default.push({
                                    token: this.token,
                                    type: 'Semantic',
                                    msg: `La posicion ${indexNum} esta fuera de rango para la lista ${this.props.id}.`,
                                });
                            }
                        }
                        else {
                            compile = false;
                            error_1.default.push({
                                token: this.token,
                                type: 'Semantic',
                                msg: `La posicion de la lista dinamica ${this.props.id} debe ser un ${types_1.default.INTEGER}.`,
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
    getValue() {
        return this.refValue;
    }
    getType() {
        return this.listType;
    }
}
exports.default = GetValue;
