import Environment from '../../runtime/environment'
import Declaration from '../variable/declaration'
import FunctionBlock from '../methods/functions'
import Assignment from '../variable/assignment'
import Expression from '../expression/data'
import { TokenInfo } from '../../utils'
import Instruction from '../models'
import CycleControl from './cycle'

class ForLoop extends CycleControl {
	private isOnLoopContinue = false
	private loopHandleBreak = false
	private isOnLoopBreak = false

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			assignments: (Assignment | Declaration)[]
			withDeclarations?: boolean
			modifiers: Assignment
			condition: Expression
			body: Instruction[]
		}
	) {
		super(token, { condition: props.condition, body: props.body })
	}

	// AGREGAR FUNCION DE SALIDA
	private addLoopControlFunction(env: Environment, name: 'return' | 'break' | 'continue') {
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
							if (name == 'continue') this.isOnLoopContinue = true
							else this.isOnLoopBreak = true
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
		const containerEnv: Environment = new Environment('Loop', 'for-container', env)

		// AGREGAR FUNCIONES DE SALIDA
		this.addLoopControlFunction(containerEnv, 'continue')
		this.addLoopControlFunction(containerEnv, 'return')
		this.addLoopControlFunction(containerEnv, 'break')

		// ASIGNAR VARIABLES DE INICIO
		this.props.assignments.forEach((assignment) =>
			assignment.compile(this.props.withDeclarations ? containerEnv : env)
		)

		// EJECUTAR INSTRUCCIONES
		while (
			this.props.condition.compile(containerEnv) &&
			this.props.condition.getValue(containerEnv)?.compile(containerEnv) &&
			this.props.condition.getValue(containerEnv)?.getValue(containerEnv) &&
			!this.loopHandleBreak &&
			!this.isOnLoopBreak
		) {
			// CREAR ENTORNO
			const localEnv: Environment = new Environment('Loop', 'for-content', containerEnv)

			// EJECUTAR CONTENIDO DE LOOP
			for (
				let instructionCount = 0, length = this.props.body.length;
				instructionCount < length;
				instructionCount++
			) {
				const instruction = this.props.body[instructionCount]
				if (!this.isOnLoopBreak && !this.isOnLoopContinue)
					this.loopHandleBreak = !instruction.compile(localEnv)
				else {
					// REINICIAR CONTINUAR
					if (this.isOnLoopContinue) this.isOnLoopContinue = false
					break
				}
			}

			// EJECUTAR EXPRESIONES
			this.loopHandleBreak = !this.props.modifiers.compile(containerEnv)
		}

		return true
	}
}

export default ForLoop
