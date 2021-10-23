import Environment from '../../runtime/environment'
import { DataType, TokenInfo } from '../../utils'
import Expression from '../expression/data'
import Value from '../expression/value'
import FunctionBlock from './functions'
import Instruction from '../models'
import errors from '../../error'

class FunctionCall extends Instruction {
	// GLOBALES
	private functionValue: Value | undefined

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			params: Expression[]
			id: string
		},
		private builtIn: boolean = false
	) {
		super(token, 'FunctionCall')
	}

	// OBTENER VALOR
	public getValue(): Value | undefined {
		return this.functionValue
	}

	// OBTENER TIPO
	public isBuiltIn(): boolean {
		return this.builtIn
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		// BUSCAR FUNCION
		const functionBlock: FunctionBlock | undefined = env.getFunction(this.props.id)

		// EJECUTAR
		if (functionBlock) {
			// OBTENER EXPRESIONES
			functionBlock.setEnv(env)
			const functionEnv: Environment | undefined = functionBlock.getEnv()
			if (functionEnv) {
				const values: { value: Value; type: DataType }[] = this.props.params.map(
					(exp: Expression) => ({
						value: exp.getValue(env),
						type: exp.getValue(env)?.getType(),
					})
				) as { value: Value; type: DataType }[]

				// COMPILAR Y GUARDAR
				if (this.props.params.map((exp) => exp.compile(functionEnv)).every((exp) => exp === true)) {
					// VERIFICAR CANTIDAD DE PARAMETRO
					if (functionBlock.props.params.length === this.props.params.length) {
						// VERIFICAR TIPOS DE PARAMETROS
						let compile = true
						values.forEach((value, index: number) => {
							compile = value.value.compile(env)

							if (compile) {
								if (value.type === functionBlock.props.params[index].type) {
									// ASIGNAR VARIABLE A ENTORNO DE FUNCION
									if (value.value.compile(env))
										functionEnv.addVar(
											functionBlock.props.params[index].id,
											value.type,
											value.value
										)
								} else {
									errors.push({
										type: 'Semantic',
										token: this.token,
										msg: `Se esperaba un ${
											functionBlock.props.params[index].type
										} en el parametro ${index + 1} en la function ${this.props.id}`,
									})
									compile = false
								}
							}
						})

						compile = functionBlock.compile()
						this.functionValue = functionBlock.getValue()
						return compile
					} else {
						errors.push({
							type: 'Semantic',
							token: this.token,
							msg: `Se esperaban ${functionBlock.props.params.length} parametros pero se obtuvieron ${this.props.params.length} en la funcion ${this.props.id}`,
						})
						return false
					}
				} else return false
			} else return false
		} else {
			errors.push({
				type: 'Semantic',
				token: this.token,
				msg: `La funcion ${this.props.id} no existe.`,
			})
			return false
		}
	}
}

export default FunctionCall
