import DataType, { TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Assignment from './assignment'
import { Value } from '../expression'

// ASIGNACIONES
class DynamicList extends Assignment {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; type: DataType }) {
		super(token, props.id)
	}

	// COMPILAR
	public compile(env: Environment, type: DataType): boolean {
		return super.setValue(env, type, this.getValue())
	}

	// OBTENER VALOR
	public getValue(): Value {
		return new Value(this.token, { value: [], type: DataType.DYNAMICLIST })
	}
}

export default DynamicList
