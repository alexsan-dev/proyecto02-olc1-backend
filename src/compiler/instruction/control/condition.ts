import Environment from '../../runtime/environment'
import { TokenInfo } from '../../utils/types'
import Expression from '../expression/data'
import Instruction from '../models'

interface ConditionExp {
	exp: Expression
	body: Instruction[]
}
class Condition extends Instruction {
	// CONSTRUCTOR
	constructor(
		public token: TokenInfo,
		private props: {
			valid: ConditionExp
			inValid?: ConditionExp
			fallback?: ConditionExp[]
		}
	) {
		super(token, 'Condition')
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		let compile = true

		// CONDICION INICIAL
		compile = this.props.valid.exp.compile()
		if (compile) {
			// EJECUTAR CONDICION INICIAL
			const value = this.props.valid.exp.getValue(env)
			compile = value?.compile(env) ?? true
			if (compile && value?.getValue(env)) {
				const environment = new Environment('Condition', 'if', env)
				compile = this.props.valid.body
					.map((instruction) => instruction.compile(environment))
					.every((compile) => compile === true)
			} else {
				// GUARDAR ESTADO DE ELSE
				const inValidCondition = () => {
					if (this.props.inValid) {
						const environment = new Environment('Condition', 'else', env)
						compile = this.props.inValid.body
							.map((instruction) => instruction.compile(environment))
							.every((compile) => compile === true)
					}
				}

				// EJECUTAR LISTA DE ELSE IF
				if (this.props.fallback) {
					let foundValid = false
					for (
						let conditionIndex = 0, length = this.props.fallback.length;
						conditionIndex < length;
						conditionIndex++
					) {
						compile = this.props.fallback[conditionIndex].exp.compile()
						if (compile) {
							const value = this.props.fallback[conditionIndex].exp.getValue(env)
							compile = value?.compile(env) ?? true
							if (compile && value?.getValue(env)) {
								foundValid = true
								const environment = new Environment('Condition', 'else if', env)
								compile = this.props.fallback[conditionIndex].body
									.map((instruction) => instruction.compile(environment))
									.every((compile) => compile === true)
								break
							}
						}
					}

					// EJECUTAR ELSE SI NO ENCONTRO NINGUN ELSE IF
					if (!foundValid) inValidCondition()
				}
				// EJECUTAR ELSE
				else inValidCondition()
			}
		}

		return compile
	}
}

export default Condition
