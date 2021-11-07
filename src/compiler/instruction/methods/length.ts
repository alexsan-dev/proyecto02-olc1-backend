import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import FunctionCall from './call'
import errors from '../../error'

class Length extends FunctionCall {
	// GLOBALES
	private refValue: DataValue | undefined

	// CONSTRUCTOR
	constructor(token: TokenInfo, props: { id: string; params: Expression[] }) {
		super(token, { ...props, id: 'Length' }, true)
		this.props.id = 'Length'
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.props.params[0] && this.props.params[0].compile(env)) {
			// VERIFICAR TIPO
			if (
				this.props.params[0].getValue(env)?.getType() === DataType.DYNAMICLIST ||
				this.props.params[0].getValue(env)?.getType() === DataType.STRING ||
				typeof this.props.params[0].getValue(env)?.getValue(env) === 'object'
			) {
				this.refValue = (this.props.params[0].getValue(env)?.getValue(env) as string)?.length || 0
				return true
			} else {
				errors.push({
					token: this.token,
					type: 'Semantic',
					msg: `La funcion espera un ${DataType.STRING} | ${DataType.ARRAY} | ${DataType.DYNAMICLIST} como parametro.`,
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
		return DataType.INTEGER
	}
}

export default Length
