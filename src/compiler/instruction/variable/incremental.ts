import DataType, { Operator, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Value from '../expression/value'
import Assignment from './assignment'
import errors from '../../error'

// ASIGNACIONES
class IncrementalAssignment extends Assignment {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; operator: Operator }) {
		super(token, props.id)
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		let compile = true

		// VERIFICAR VARIABLE
		const refVar = env.getVar(this.id ?? '')
		if (refVar) {
			compile = refVar?.compile(env)
			if (compile) {
				if (refVar.getType() === DataType.INTEGER || refVar.getType() === DataType.DOUBLE) {
					// VERIFICAR TIPO
					compile = super.setValue(env, refVar.getType(), this.getValue(env), false)
				} else {
					compile = false
					errors.push({
						token: this.token,
						type: 'Semantic',
						msg: `La variable ${this.id} debe ser del tipo ${DataType.INTEGER} | ${DataType.DOUBLE}`,
					})
				}
			}
		} else {
			compile = false
			errors.push({ token: this.token, type: 'Semantic', msg: `La variable ${this.id} no existe.` })
		}

		return compile
	}

	// OBTENER VALOR
	public getValue(env: Environment): Value | undefined {
		const refVar = env.getVar(this.id ?? '')
		if (refVar && refVar?.compile(env))
			return new Value(this.token, {
				value: (
					(refVar?.getValue(env) as number) + (this.props.operator === Operator.PLUSPLUS ? 1 : -1)
				).toString(),
				type: refVar.getType(),
			})
	}
}

export default IncrementalAssignment
