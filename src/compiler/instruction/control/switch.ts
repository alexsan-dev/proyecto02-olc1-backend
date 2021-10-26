import Environment from '../../runtime/environment'
import FunctionBlock from '../methods/functions'
import Expression from '../expression/data'
import { TokenInfo } from '../../utils'
import Instruction from '../models'

// PROPS
interface CaseBody {
	case: Expression
	body: Instruction[]
}

class Switch extends Instruction {
	// GLOBALES
	private isOnBreak = false

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: { value: Expression; cases?: CaseBody[]; default?: Omit<CaseBody, 'case'> }
	) {
		super(token, 'Switch')
	}

	// AGREGAR FUNCION DE SALIDA
	private addControlFunction(env: Environment, name: 'return' | 'break' | 'continue') {
		env.addFunction(
			name,
			'void',
			new FunctionBlock(this.token, {
				id: name,
				type: 'void',
				content: [
					{
						token: this.token,
						name: 'FunctionCall',
						compile: () => {
							this.isOnBreak = true
							return true
						},
					},
				],
				params: [],
			})
		)
	}

	// COMPILAR
	public compile(env: Environment) {
		// AGREGAR ENTORNO LOCAL
		const localEnv = new Environment('Switch', 'switch', env)
		this.addControlFunction(localEnv, 'break')
		this.addControlFunction(localEnv, 'return')

		let compile = true
		if (this.props.value.compile(localEnv)) {
			// EVALUAR CASES
			let foundCase = false
			for (
				let caseIndex = 0, length = this.props.cases?.length || 0;
				caseIndex < length;
				caseIndex++
			) {
				if (this.props.cases?.length) {
					if (this.props.cases[caseIndex].case?.compile(localEnv)) {
						if (
							this.props.cases[caseIndex].case.getValue(localEnv)?.getValue(localEnv) ===
							this.props.value.getValue(localEnv)?.getValue(localEnv)
						) {
							// EJECUTAR INSTRUCCIONES
							foundCase = true
							const caseEnv = new Environment('Case', `case_${caseIndex}`, localEnv)
							for (
								let instructionIndex = 0,
									instructionsLength = this.props.cases[caseIndex].body.length;
								instructionIndex < instructionsLength;
								instructionIndex++
							) {
								if (!this.isOnBreak)
									compile = this.props.cases[caseIndex].body[instructionIndex].compile(caseEnv)
								else break
							}

							// SALIR EN BREAK
							if (this.isOnBreak) break
						}
					}
				}
			}

			// EVALUAR DEFAULT
			if (!foundCase) {
				if (this.props.default && this.props.default.body) {
					const defEnv = new Environment('Case', 'default', localEnv)
					for (
						let instructionIndex = 0, instructionsLength = this.props.default.body.length;
						instructionIndex < instructionsLength;
						instructionIndex++
					) {
						if (!this.isOnBreak) compile = this.props.default.body[instructionIndex].compile(defEnv)
						else break
					}
				}
			}
		} else compile = false

		return compile
	}
}

export default Switch
