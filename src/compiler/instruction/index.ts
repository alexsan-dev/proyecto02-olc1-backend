// UTILS
import Value, { VectorValue } from './expression/value'
import DynamicList from './variable/dynamicList'
import VectorAssignment from './variable/vector'
import Declaration from './variable/declaration'
import FunctionBlock from './methods/functions'
import ReturnValue from './methods/returnValue'
import Assignment from './variable/assignment'
import WriteLine from './methods/writeLine'
import Expression from './expression/data'
import FunctionCall from './methods/call'
import Instruction from './models'
import Main from './methods/main'

// EXPORTS
export {
	Declaration,
	Assignment,
	VectorAssignment,
	DynamicList,
	Value,
	VectorValue,
	Expression,
	FunctionBlock,
	FunctionCall,
	WriteLine,
	Main,
	ReturnValue,
}
export default Instruction
