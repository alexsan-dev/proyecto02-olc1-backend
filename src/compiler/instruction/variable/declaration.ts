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
	public compile(): boolean {
		// CREAR NUEVO ENTORNO
		const environment = new Environment()

		const compiles = this.props.assignments.map((assignment: Assignment) =>
			assignment.compile(environment, this.props.type)
		)

		console.log(JSON.stringify(environment, null, 2))
		return compiles.every((compile: boolean) => compile === true)
	}
}

export default Declaration
