/* eslint-disable indent */
// TIPOS
import { Operator, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import operateValues from './tools'
import Instruction from '../models'
import Value from './value'

// ASIGNACIONES
class Expression extends Instruction {
	private childToken: TokenInfo

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: Partial<{ left: Expression; right: Expression; value: Value; operator: Operator }>
	) {
		super(token, 'Expression')
		this.childToken = token
	}

	// COMPILAR VALORES
	public compile(env: Environment): boolean {
		const value: Value | undefined = this.getValue(env)
		return value !== undefined
	}

	// OBTENER VALOR REAL
	public getValue(env: Environment): Value | undefined {
		// OBTENER RESULTADOS ANTERIORES
		const left: Value | undefined = this.props.left?.getValue(env)
		const right: Value | undefined = this.props.right?.getValue(env)

		// OPERAR
		if (left) {
			if (this.props.operator) {
				const result: Value | undefined = operateValues(
					env,
					this.childToken,
					left,
					this.props.operator,
					right
				)
				if (result) return result
			} else return left
		} else if (this.props.value) {
			if (this.props.value.compile()) return this.props.value
		}
	}
}

export default Expression
