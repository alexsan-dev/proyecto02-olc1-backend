import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import { Value } from '../expression'

// ASIGNACIONES
class DynamicListValue extends Value {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: { value: DataValue; generic?: DataType; type: DataType }
	) {
		super(token, {
			value: [],
			type: DataType.DYNAMICLIST,
			generic: props.type,
		})
		this.props.generic = props.type
	}

	// COMPILAR
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public compile(_env: Environment): boolean {
		return true
	}

	// OBTENER VALOR
	public getValue(): DataValue | undefined {
		return []
	}
}

export default DynamicListValue
