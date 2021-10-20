import Environment from 'compiler/runtime/environment'
import { TokenInfo } from 'compiler/utils/types'

// INSTRUCCIONES
export type InstructionName =
	| 'Declaration'
	| 'Assignment'
	| 'VectorAssignment'
	| 'DynamicList'
	| 'Expression'
	| 'Value'
	| 'Function'
abstract class Instruction {
	// CONSTRUCTOR
	constructor(public token: TokenInfo, public name: InstructionName) {}

	// COMPILAR
	public abstract compile(env: Environment, type?: string): boolean
}

export default Instruction
