import { DataType, TokenInfo } from '../../utils'
import Environment from '../../runtime/environment'
import Value from '../expression/value'
import Instruction from '../models'
import errors from '../../error'

class FunctionBlock extends Instruction {
	// GLOBALES
	private env: Environment | undefined
	private functionValue: Value | undefined
	private isOnBreak = false

	// CONSTRUCTOR
	constructor(
		public token: TokenInfo,
		public props: {
			id: string
			type: DataType | 'void'
			content: Instruction[]
			params: { type: DataType; id: string }[]
		}
	) {
		super(token, 'Function')
		this.env = {} as Environment
		this.functionValue = undefined
	}

	// OBTENER VALOR DE FUNCION
	public getValue(): Value | undefined {
		return this.functionValue
	}

	// ASIGNAR ENTORNO
	public setEnv(env: Environment): void {
		this.env = new Environment('Function', this.props.id, env)
		this.isOnBreak = false
		this.functionValue = undefined
		this.env.addFunction(
			'return',
			'void',
			new FunctionBlock(this.token, {
				id: 'return',
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

	// COMPILAR FUNCION
	public compile(): boolean {
		// AGREGAR PARAMETROS A ENTORNO LOCAL
		this.props.params.forEach((param) => this.env?.addVar(param.id, param.type, undefined))

		// COMPILAR CONTENIDO
		const compiles: boolean[] = []
		for (
			let instructionIndex = 0, length = this.props.content.length;
			instructionIndex < length;
			instructionIndex++
		) {
			if (this.env) {
				if (!this.isOnBreak) compiles.push(this.props.content[instructionIndex].compile(this.env))
				else break
			}
		}

		// OBTENER VALOR DE RETORNO
		if (this.env && 'getVar' in this.env) this.functionValue = this.env?.getVar('return')

		if (this.props.type !== 'void') {
			if (this.props.type === this.functionValue?.getType()) {
				return compiles.every((result: boolean) => result === true)
			} else {
				errors.push({
					type: 'Semantic',
					token: this.token,
					msg: `La funcion retorna un ${this.functionValue?.getType()} pero se esperaba un ${
						this.props.type
					}`,
				})
				return false
			}
		} else return true
	}

	// OBTENER ENTORNO DE FUNCION
	public getEnv(): Environment | undefined {
		return this.env
	}
}

export default FunctionBlock
