// TIPOS
import DataType, { TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import DynamicList from './dynamicList'
import VectorAssignment from './vector'
import Value from '../expression/value'
import Instruction from '../models'
import errors from '../../error'

// ASIGNACIONES
class Assignment extends Instruction {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			vector?: VectorAssignment
			list?: DynamicList
			exp?: Expression
			id?: string
		}
	) {
		super(token, 'Assignment')
	}

	// COMPILAR TODAS LAS PROPIEDADES
	public compile(env: Environment, type: DataType): boolean {
		if (this.props.id) {
			// INSTRUCCION
			let instruction: VectorAssignment | DynamicList | Expression | undefined

			// EXPRESIONES
			if (this.props.exp) instruction = this.props.exp
			else if (this.props.list) instruction = this.props.list
			else if (this.props.vector) instruction = this.props.vector

			if (instruction) {
				if (instruction.compile(env)) {
					const value: Value | undefined = instruction.getValue(env)

					if (type === value?.props.type) {
						env.addVar(this.props.id, type, value)
						return true
					} else {
						errors.push({
							type: 'Semantic',
							token: this.token,
							msg: `No se puede asignar el tipo ${value?.props.type} a ${type}`,
						})
						return false
					}
				} else return false
			} else return false
		} else return false
	}
}

export default Assignment
