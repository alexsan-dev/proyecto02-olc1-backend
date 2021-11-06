import DataType, { DataValue, TokenInfo } from '../../utils/types'
import { Expression, FunctionCall } from '..'
import Environment from '../../runtime/environment'
import errors from '../../error'

class ToUpper extends FunctionCall {
	// GLOBALES
	private refValue: DataValue | undefined

	// CONSTRUCTOR
	constructor(token: TokenInfo, props: { id: string; params: Expression[] }) {
		super(token, { ...props, id: 'ToUpper' }, true)
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.props.params[0] && this.props.params[0].compile(env)) {
			// VERIFICAR TIPO
			if (this.props.params[0].getValue(env)?.getType() === DataType.STRING) {
				this.refValue = this.props.params[0].getValue(env)?.getValue(env)?.toString().toUpperCase()
				return true
			} else {
				errors.push({
					token: this.token,
					type: 'Semantic',
					msg: `La funcion espera un ${DataType.STRING} como parametro.`,
				})
				return false
			}
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

export default ToUpper
