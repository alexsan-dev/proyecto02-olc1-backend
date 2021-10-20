// TIPOS
import DataType, { DataValue, TokenInfo } from 'compiler/utils/types'
import ExpValue from '../expression/value'
import DynamicList from './dynamicList'
import Instruction from './models'

// ASIGNACIONES
class Assignment extends Instruction {
	// CONSTRUCTOR
	constructor(
		public props: {
			vector?: VectorAssignment
			list?: DynamicList
			token: TokenInfo
			exp?: ExpValue
			id?: string
		}
	) {
		super(props.token, 'Assignment')
	}

	public compile(): void {
		throw new Error('Method not implemented.')
	}
}

// ASIGNACIONES DE VECTORES
export class VectorAssignment extends Instruction {
	// CONSTRUCTOR
	constructor(
		public props: {
			defValues?: DataValue[]
			token: TokenInfo
			type?: DataType
			size?: number
			id: string
		}
	) {
		super(props.token, 'VectorAssignment')
	}

	public compile(): void {
		throw new Error('Method not implemented.')
	}
}

export default Assignment
