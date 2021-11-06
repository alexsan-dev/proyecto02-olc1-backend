import Environment from '../../runtime/environment'
import { DataType, DataValue, TokenInfo } from '../../utils'
import Expression from '../expression/data'
import Value from '../expression/value'
import FunctionBlock from './functions'
import Instruction from '../models'
import errors from '../../error'

class FunctionCall extends Instruction {
	// GLOBALES
	private functionValue: DataValue | undefined
	private refType: DataType

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			params: Expression[]
			id: string
			generic?: DataType
		},
		private builtIn: boolean = false
	) {
		super(token, 'FunctionCall')
		this.refType = DataType.ID
	}

	// OBTENER VALOR
	public getValue(): DataValue | undefined {
		return this.functionValue
	}

	// OBTENER TIPO
	public getType(): DataType | undefined {
		return this.refType
	}

	// ES FUNCION NATIVA
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
								if (
									value.type === functionBlock.props.params[index].type ||
									`${DataType.DYNAMICLIST}<${value.value.props.generic}>` ===
										functionBlock.props.params[index].type
								) {
									// ASIGNAR VARIABLE A ENTORNO DE FUNCION
									if (value.value.compile(env)) {
										const copy = new Value(this.token, {
											value: value.value.getValue(env) ?? '',
											type: value.value.getType(),
											generic: value.value.props.generic,
										})
										functionEnv.addVar(functionBlock.props.params[index].id, value.type, copy)
									}
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
						if (compile) {
							const functionValue = functionBlock.getValue()
							if (functionValue) {
								this.functionValue = functionValue?.getValue(env)
								this.refType = functionValue?.getType()
								this.props.generic = functionValue.props.generic
							}
						}
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
