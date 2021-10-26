import DataType, { TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Assignment from './assignment'
import { Value } from '../expression'
import errors from '../../error'

// ASIGNACIONES
class DynamicList extends Assignment {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; type: DataType }) {
		super(token, props.id)
	}

	// COMPILAR
	public compile(env: Environment, type: DataType): boolean {
		// VERIFICAR TIPOS
		if (type === `${DataType.DYNAMICLIST}<${this.props.type}>`) {
			env.addVar(this.props.id, type, this.getValue())
			return true
		} else {
			errors.push({
				token: this.token,
				type: 'Semantic',
				msg: `No se puede asignar el tipo ${this.props.type} a ${type}.`,
			})
			return false
		}
	}

	// OBTENER VALOR
	public getValue(): Value {
		return new Value(this.token, {
			value: [],
			refType: this.props.type,
			type: DataType.DYNAMICLIST,
		})
	}
}

export default DynamicList
