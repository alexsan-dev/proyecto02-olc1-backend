import { DataType, DataValue, TokenInfo } from '../../utils'
import Environment from '../../runtime/environment'
import Instruction from '../models'

class FunctionBlock extends Instruction {
	// GLOBALES
	private env: Environment | undefined
	private functionValue: DataValue | undefined

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
	public getValue(): DataValue | undefined {
		return this.functionValue
	}

	// ASIGNAR ENTORNO
	public setEnv(env: Environment): void {
		this.env = new Environment(env)
	}

	// COMPILAR FUNCION
	public compile(): boolean {
		// AGREGAR PARAMETROS A ENTORNO LOCAL
		this.props.params.forEach((param) => this.env?.addVar(param.id, param.type, undefined))

		// COMPILAR CONTENIDO
		const compiles: boolean[] = this.props.content.map((content: Instruction) =>
			this.env ? content.compile(this.env) : false
		)
		this.functionValue = undefined // TODO:  Agregar return de funcion
		return compiles.every((result: boolean) => result === true)
	}

	// OBTENER ENTORNO DE FUNCION
	public getEnv(env: Environment): Environment {
		return this.env || new Environment(env)
	}
}

export default FunctionBlock
