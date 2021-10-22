// TIPOS
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import errors from '../../error'
import Expression from './data'
import Value from './value'

class VectorValue extends Value {
	private index: number

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: { index: Expression; value: string | DataValue[]; type: DataType }
	) {
		super(token, props)
		this.index = -1
	}

	// OBTENER INDICE CALCULADO
	public getIndex(): number {
		return this.index
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		let compile = true
		if (this.props.index.compile()) {
			// VERIFICAR TIPO DE DATO DE EXPRESION INDEX
			const indexValue: Value | undefined = this.props.index.getValue(env)
			const index: number | undefined = indexValue?.getValue(env) as number

			if (index !== undefined && indexValue?.props.type === DataType.INTEGER) {
				this.index = index
			} else {
				compile = false
				errors.push({
					type: 'Semantic',
					token: this.token,
					msg: `La posicion del arreglo ${this.props.value} debe ser un ${DataType.INTEGER}.`,
				})
			}
		}

		// RETORNAR VALIDACION
		return compile
	}

	// OBTENER VALOR PRIMITIVO
	public getValue(env: Environment): DataValue | undefined {
		if (env) {
			if (this.props.value) {
				const newValue: Value | undefined = env.getVar(this.props.value as string)
				if (newValue) {
					this.props.type = newValue?.props.type
					const value = newValue.getValue(env) as DataValue[]

					// VERIFICAR POSICION
					if (this.index >= 0 && this.index < value.length) {
						return value[this.index]
					} else
						errors.push({
							type: 'Semantic',
							token: this.token,
							msg: `La posicion ${this.props.index} esta fuera de rango.`,
						})
				}
			}
		}
	}
}

export default VectorValue
