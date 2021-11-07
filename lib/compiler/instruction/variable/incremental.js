"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importStar(require("../../utils/types"));
const value_1 = __importDefault(require("../expression/value"));
const assignment_1 = __importDefault(require("./assignment"));
const error_1 = __importDefault(require("../../error"));
class IncrementalAssignment extends assignment_1.default {
    props;
    constructor(token, props) {
        super(token, props.id);
        this.props = props;
    }
    compile(env) {
        let compile = true;
        const refVar = env.getVar(this.id ?? '');
        if (refVar) {
            compile = refVar?.compile(env);
            if (compile) {
                if (refVar.getType() === types_1.default.INTEGER || refVar.getType() === types_1.default.DOUBLE) {
                    compile = super.setValue(env, refVar.getType(), this.getValue(env), false);
                }
                else {
                    compile = false;
                    error_1.default.push({
                        token: this.token,
                        type: 'Semantic',
                        msg: `La variable ${this.id} debe ser del tipo ${types_1.default.INTEGER} | ${types_1.default.DOUBLE}`,
                    });
                }
            }
        }
        else {
            compile = false;
            error_1.default.push({ token: this.token, type: 'Semantic', msg: `La variable ${this.id} no existe.` });
        }
        return compile;
    }
    getValue(env) {
        const refVar = env.getVar(this.id ?? '');
        if (refVar && refVar?.compile(env))
            return new value_1.default(this.token, {
                value: (refVar?.getValue(env) + (this.props.operator === types_1.Operator.PLUSPLUS ? 1 : -1)).toString(),
                type: refVar.getType(),
            });
    }
}
exports.default = IncrementalAssignment;
