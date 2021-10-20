// TIPOS
import DataType, { TokenInfo } from 'compiler/utils/types'
import ExpValue from '../expression/value'
import DynamicList from './dynamicList'
import Instruction from './models'

// ASIGNACIONES
class Assignment extends Instruction {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			vector?: VectorAssignment
			list?: DynamicList
			exp?: ExpValue
			id?: string
		}
	) {
		super(token, 'Assignment')
	}

	public compile(): void {
		throw new Error('Method not implemented.')
	}
}

// ASIGNACIONES DE VECTORES
export class VectorAssignment extends Instruction {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			defValues?: ExpValue[]
			type?: DataType
			size?: number
			id: string
		}
	) {
		super(token, 'VectorAssignment')
	}

	public compile(): void {
		throw new Error('Method not implemented.')
	}
}

export default Assignment
