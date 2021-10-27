import DataType, { TokenInfo } from '../../utils/types'
import { Expression, FunctionCall, Value } from '..'
import Environment from '../../runtime/environment'

class TypeOf extends FunctionCall {
	// GLOBALES
	private refType: Value | undefined

	// CONSTRUCTOR
	constructor(token: TokenInfo, props: { id: string; params: Expression[] }) {
		super(token, { ...props, id: 'TypeOf' })
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.props.params[0] && this.props.params[0].compile(env)) {
			const newValue = this.props.params[0].getValue(env)
			const valueType = newValue?.getType()
			if (valueType) {
				this.refType = new Value(this.token, {
					value:
						valueType === DataType.DYNAMICLIST
							? `${DataType.DYNAMICLIST}<${newValue?.props.generic}>`
							: typeof newValue?.getValue(env) === 'object'
							? `${DataType.ARRAY}<${newValue?.props.generic}>`
							: valueType,
					type: DataType.STRING,
				})
			}
			return true
		} else return false
	}

	// OBTENER VALOR
	public getValue(): Value | undefined {
		return this.refType
	}
}

export default TypeOf
