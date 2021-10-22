import DataType, { TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import { Value, Expression } from '../expression'
import Assignment from './assignment'

// ASIGNACIONES
class ExpAssignment extends Assignment {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; exp?: Expression }) {
		super(token, props.id)
	}

	// COMPILAR
	public compile(env: Environment, type: DataType): boolean {
		const value: Value | undefined = env.getVar(this.props.id)
		value?.compile(env)
		return super.setValue(env, value?.getType() ?? type, this.getValue(env), type !== undefined)
	}

	// OBTENER VALOR
	public getValue(env: Environment): Value | undefined {
		if (this.props.exp?.compile(env)) {
			const value: Value | undefined = this.props.exp.getValue(env)
			return value
		}
	}
}

export default ExpAssignment
