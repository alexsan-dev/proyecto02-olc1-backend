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
	public setValue(
		env: Environment,
		type: DataType,
		value: Value | undefined,
		isNew = true
	): boolean {
		if (this.id?.length) {
			if (value?.compile(env)) {
				// EXCEPCIONES PARA NUMEROS
				const typeException =
					(type === DataType.DOUBLE && value.getType() === DataType.INTEGER) ||
					(type === DataType.INTEGER && value.getType() === DataType.DOUBLE) ||
					type === `${DataType.DYNAMICLIST}<${value.props.generic}>`

				if (type === value.getType() || typeException) {
					if (isNew) env.addVar(this.id, type, value)
					else env.setVar(this.id, value)
					return true
				} else {
					if (type) {
						errors.push({
							type: 'Semantic',
							token: this.token,
							msg: `No se puede asignar el tipo ${value.getType()} a ${type}.`,
						})
					} else
						errors.push({
							type: 'Semantic',
							token: this.token,
							msg: `Es posible que la variable ${this.id} no este declarada.`,
						})
					return false
				}
			} else return false
		} else return false
	}

	// COMPILAR TODAS LAS PROPIEDADES
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public compile(_env: Environment, _type?: DataType): boolean {
		return true
	}
}

export default Assignment
