import { DataType, DataValue, TokenInfo } from '../../utils'
import Environment from '../../runtime/environment'
import { Expression, FunctionBlock, Value } from '..'
import Instruction from '../models'
import errors from '../../error'

class FunctionCall extends Instruction {
	// GLOBALES
	private functionValue: DataValue | undefined

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
	public getValue(): DataValue | undefined {
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
			const functionEnv: Environment = functionBlock.getEnv(env)
			const values: { value: Value; type: DataType }[] = this.props.params.map(
				(exp: Expression) => ({
					value: exp.getValue(env),
					type: exp.getValue(env)?.props.type,
				})
			) as { value: Value; type: DataType }[]

			// COMPILAR Y GUARDAR
			if (this.props.params.map((exp) => exp.compile(functionEnv)).every((exp) => exp === true)) {
				// VERIFICAR CANTIDAD DE PARAMETRO
				if (functionBlock.props.params.length === this.props.params.length) {
					// VERIFICAR TIPOS DE PARAMETROS
					let compile = true
					values.forEach((value, index: number) => {
						if (value.type === functionBlock.props.params[index].type) {
							// ASIGNAR VARIABLE A ENTORNO DE FUNCION
							functionEnv.setVar(functionBlock.props.params[index].id, value.value)
						} else {
							errors.push({
								type: 'Semantic',
								token: this.token,
								msg: `Se esperaba un ${functionBlock.props.params[index].type} en el parametro ${
									index + 1
								} en la function ${this.props.id}`,
							})
							compile = false
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
			}

			return true
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
