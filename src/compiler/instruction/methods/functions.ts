import { DataType, TokenInfo } from '../../utils'
import Environment from '../../runtime/environment'
import Value from '../expression/value'
import Instruction from '../models'
import errors from '../../error'

class FunctionBlock extends Instruction {
	// GLOBALES
	private env: Environment | undefined
	private functionValue: Value | undefined

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
		this.env = new Environment('Function', env)
	}

	// COMPILAR FUNCION
	public compile(): boolean {
		// AGREGAR PARAMETROS A ENTORNO LOCAL
		this.props.params.forEach((param) => this.env?.addVar(param.id, param.type, undefined))

		// COMPILAR CONTENIDO
		const compiles: boolean[] = this.props.content.map((content: Instruction) =>
			this.env ? content.compile(this.env) : false
		)

		this.functionValue = this.env?.getVar('return')

		if (this.props.type !== 'void') {
			if (this.props.type === this.functionValue?.props.type) {
				return compiles.every((result: boolean) => result === true)
			} else {
				errors.push({
					type: 'Semantic',
					token: this.token,
					msg: `La funcion retorna un ${this.functionValue?.props.type} pero se esperaba un ${this.props.type}`,
				})
				return false
			}
		} else return true
	}

	// OBTENER ENTORNO DE FUNCION
	public getEnv(env: Environment): Environment {
		return this.env || new Environment('Function', env)
	}
}

export default FunctionBlock
