import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import { Value, Expression } from '../expression'
import Assignment from './assignment'
import { defaultValues } from '../expression/tools'

// ASIGNACIONES
class ExpAssignment extends Assignment {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; exp?: Expression }) {
		super(token, props.id)
	}

	// COMPILAR
	public compile(env: Environment, type: DataType): boolean {
		const nextValue: Value | undefined = this.getValue(env, type)
		const value: Value | undefined = env.getVar(this.props.id)
		value?.compile(env)

		return super.setValue(env, value?.getType() ?? type, nextValue, type !== undefined)
	}

	// OBTENER VALOR
	public getValue(env: Environment, type: DataType): Value | undefined {
		if (this.props.exp) {
			if (this.props.exp?.compile(env)) {
				const value: Value | undefined = this.props.exp.getValue(env)
				if (value)
					return new Value(this.token, {
						value: value?.getValue(env) as DataValue,
						type: value?.getType() as DataType,
						generic: value?.props.generic,
					})
			}
		} else return new Value(this.token, { value: defaultValues(type), type })
	}
}

export default ExpAssignment
