import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import FunctionCall from './call'
import errors from '../../error'

class Truncate extends FunctionCall {
	// GLOBALES
	private refValue: DataValue | undefined

	// CONSTRUCTOR
	constructor(token: TokenInfo, props: { id: string; params: Expression[] }) {
		super(token, { ...props, id: 'Truncate' }, true)
		this.props.id = 'Truncate'
	}

	// OBTENER TIPO
	public getType(): DataType {
		return DataType.INTEGER
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.props.params[0] && this.props.params[0].compile(env)) {
			// VERIFICAR TIPO
			if (
				this.props.params[0].getValue(env)?.getType() === DataType.DOUBLE ||
				this.props.params[0].getValue(env)?.getType() === DataType.INTEGER
			) {
				this.refValue =
					parseInt(
						(this.props.params[0].getValue(env)?.getValue(env)?.toString() || '0') as string,
						10
					) || 0
				return true
			} else {
				errors.push({
					token: this.token,
					type: 'Semantic',
					msg: `La funcion espera un ${DataType.DOUBLE} | ${DataType.INTEGER} como parametro.`,
				})
				return false
			}
		} else return false
	}

	// OBTENER VALOR
	public getValue(): DataValue | undefined {
		return this.refValue
	}
}

export default Truncate
