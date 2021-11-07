/* eslint-disable indent */
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import { Expression, FunctionCall } from '..'
import Environment from '../../runtime/environment'

class TypeOf extends FunctionCall {
	// GLOBALES
	private refValue: DataValue | undefined

	// CONSTRUCTOR
	constructor(token: TokenInfo, props: { id: string; params: Expression[] }) {
		super(token, { ...props, id: 'TypeOf' }, true)
		this.props.id = 'TypeOf'
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.props.params[0] && this.props.params[0].compile(env)) {
			const newValue = this.props.params[0].getValue(env)
			const valueType = newValue?.getType()
			if (valueType) {
				this.refValue =
					valueType === DataType.DYNAMICLIST
						? `${DataType.DYNAMICLIST}<${newValue?.props.generic}>`
						: typeof newValue?.getValue(env) === 'object'
						? `${DataType.ARRAY}<${newValue?.props.generic}>`
						: valueType
			}
			return true
		} else return false
	}

	// OBTENER VALOR
	public getValue(): DataValue | undefined {
		return this.refValue
	}

	// OBTENER TIPO
	public getType(): DataType {
		return DataType.STRING
	}
}

export default TypeOf
