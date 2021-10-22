// TIPOS
import DataType, { TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Value from '../expression/value'
import Instruction from '../models'
import errors from '../../error'

// ASIGNACIONES
class Assignment extends Instruction {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public id?: string) {
		super(token, 'Assignment')
	}

	// GUARDAR VARIABLE EN ENTORNO
	public setValue(env: Environment, type: DataType, value: Value | undefined): boolean {
		if (this.id?.length) {
			if (value?.compile(env)) {
				if (type === value?.props.type) {
					env.addVar(this.id, type, value)
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
	}

	// COMPILAR TODAS LAS PROPIEDADES
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public compile(_env: Environment, _type: DataType): boolean {
		return true
	}
}

export default Assignment
