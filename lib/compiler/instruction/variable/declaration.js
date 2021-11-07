"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
class Declaration extends models_1.default {
    props;
    constructor(token, props) {
        super(token, 'Declaration');
        this.props = props;
    }
    compile(env) {
        const compiles = this.props.assignments.map((assignment) => assignment.compile(env, this.props.type));
        return compiles.every((compile) => compile === true);
    }
}
exports.default = Declaration;
