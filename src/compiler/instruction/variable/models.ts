// UTILS
import { TokenInfo } from 'compiler/utils'

// INSTRUCCIONES
export type InstructionName =
	| 'Declaration'
	| 'Assignment'
	| 'VectorAssignment'
	| 'DynamicList'
	| 'Expression'
abstract class Instruction {
	// CONSTRUCTOR
	constructor(public token: TokenInfo, public name: InstructionName) {}

	// COMPILAR
	public abstract compile(): void
}

export default Instruction
