import Environment from '../../runtime/environment'
import FunctionBlock from '../methods/functions'
import { TokenInfo } from '../../utils/types'
import Expression from '../expression/data'
import Instruction from '../models/'

class CycleControl extends Instruction {
	private isOnContinue = false
	private handleBreak = false
	private isOnBreak = false

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: { condition: Expression; body: Instruction[]; isDoLoop?: boolean }
	) {
		super(token, 'Loop')
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
							if (name === 'continue') this.isOnContinue = true
							else this.isOnBreak = true
							return true
						},
					},
				],
				params: [],
			})
		)
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		// ENTORNO CONTENEDOR
		const containerEnv: Environment = new Environment('Loop', 'while-container', env)
		this.addControlFunction(containerEnv, 'continue')
		this.addControlFunction(containerEnv, 'return')
		this.addControlFunction(containerEnv, 'break')

		// EJECUTAR INSTRUCCIONES
		const runInstructions = (id: string) => {
			// CREA UN NUEVO ENTORNO
			const localEnv: Environment = new Environment('Loop', id, containerEnv)

			// RECORRER INSTRUCCIONES
			for (
				let instructionCount = 0, length = this.props.body.length;
				instructionCount < length;
				instructionCount++
			) {
				const instruction = this.props.body[instructionCount]
				if (!this.isOnBreak && !this.isOnContinue) this.handleBreak = !instruction.compile(localEnv)
				else {
					if (this.isOnContinue) this.isOnContinue = false
					break
				}
			}
		}

		if (!this.props.isDoLoop)
			while (
				this.props.condition.compile(containerEnv) &&
				this.props.condition.getValue(containerEnv)?.compile(containerEnv) &&
				this.props.condition.getValue(containerEnv)?.getValue(containerEnv) &&
				!this.handleBreak &&
				!this.isOnBreak
			)
				runInstructions('while-content')
		else
			do runInstructions('do while-content')
			while (
				this.props.condition.compile(env) &&
				this.props.condition.getValue(env)?.compile(env) &&
				this.props.condition.getValue(env)?.getValue(env) &&
				!this.handleBreak &&
				!this.isOnBreak
			)

		return true
	}
}

export default CycleControl
