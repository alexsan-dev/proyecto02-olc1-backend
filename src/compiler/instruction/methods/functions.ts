import { DataType, TokenInfo } from '../../utils'
import Environment from '../../runtime/environment'
import Instruction from '../models'

class FunctionBlock extends Instruction {
	// GLOBALES
	private env: Environment

	// CONSTRUCTOR
	constructor(
		public token: TokenInfo,
		public props: {
			type: DataType
			id: string
			content: Instruction[]
		}
	) {
		super(token, 'Function')
		this.env = {} as Environment
	}

	// COMPILAR FUNCION
	public compile(env: Environment): boolean {
		// CREAR NUEVO ENTORNO
		const environment = new Environment(env)
		this.env = environment

		// COMPILAR CONTENIDO
		const compiles: boolean[] = this.props.content.map((content: Instruction) =>
			content.compile(environment)
		)
		return compiles.every((result: boolean) => result === true)
	}

	// OBTENER ENTORNO DE FUNCION
	public getEnv(): Environment {
		return this.env
	}
}

export default FunctionBlock
