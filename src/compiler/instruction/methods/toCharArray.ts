import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import FunctionCall from './call'
import errors from '../../error'

class ToCharArray extends FunctionCall {
	// GLOBALES
	private refValue: DataValue | undefined

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: { id: string; params: Expression[]; generic?: DataType }
	) {
		super(token, { ...props, id: 'ToCharArray' }, true)
		this.props.id = 'ToCharArray'
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.props.params[0] && this.props.params[0].compile(env)) {
			// VERIFICAR TIPO
			if (this.props.params[0].getValue(env)?.getType() === DataType.STRING) {
				this.refValue = (
					(this.props.params[0].getValue(env)?.getValue(env)?.toString() || '') as string
				).split('')
				this.props.generic = DataType.CHARACTER
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
		return DataType.DYNAMICLIST
	}
}

export default ToCharArray
