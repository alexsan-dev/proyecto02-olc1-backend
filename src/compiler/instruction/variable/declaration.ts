// TIPOS
import DataType, { TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Assignment from './assignment'
import Instruction from '../models'

// DECLARACIONES
class Declaration extends Instruction {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { type: DataType; assignments: Assignment[] }) {
		super(token, 'Declaration')
	}

	// COMPILAR ASIGNACIONES
	public compile(env: Environment): boolean {
		const compiles = this.props.assignments.map((assignment: Assignment) =>
			assignment.compile(env, this.props.type)
		)

		return compiles.every((compile: boolean) => compile === true)
	}
}

export default Declaration
