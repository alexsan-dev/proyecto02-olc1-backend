import { Expression, Value, VectorValue } from '../expression'
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Assignment from './assignment'
import errors from '../../error'

// ASIGNACIONES
class VectorPosition extends Assignment {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			exp: Expression
			value: VectorValue
		}
	) {
		super(token, props.value.props.value as string)
		this.id = props.value.props.value as string
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.id) {
			const refValue: Value | undefined = env.getVar(this.id)
			if (refValue?.compile(env)) {
				return this.setValue(env, refValue.getType(), this.getValue(env))
			} else return false
		} else return false
	}

	// ASIGNAR VALOR
	public setValue(env: Environment, _type: DataType, value: Value | undefined): boolean {
		let compile = true

		// OBTENER VARIABLE
		if (this.id) {
			const refValue: Value | undefined = env.getVar(this.id)
			if (refValue) {
				const temporal: DataValue[] | undefined = refValue.getValue(env) as DataValue[]
				if (temporal) {
					if (this.props.value.compile(env)) {
						// INDICE DE EXPRESION
						const index: number = this.props.value.getIndex()
						if (index >= 0 && index < temporal.length) {
							if (refValue.getType() === value?.getType()) {
								// ASIGNAR NUEVO VALOR
								const newValue = value?.getValue(env)
								if (newValue && value?.compile(env)) temporal[index] = newValue
							} else
								errors.push({
									type: 'Semantic',
									token: this.token,
									msg: `No se puede asignar el tipo ${value?.getType()} a ${refValue.getType()}`,
								})
						} else {
							compile = false
							errors.push({
								type: 'Semantic',
								token: this.token,
								msg: `La posicion ${index} esta fuera de rango para el arreglo ${this.props.value.props.value}.`,
							})
						}
					}
				} else {
					compile = false
					errors.push({
						token: this.token,
						type: 'Semantic',
						msg: `El arreglo ${this.id} esta vacio.`,
					})
				}
			} else {
				compile = false
				errors.push({
					token: this.token,
					type: 'Semantic',
					msg: `La variable ${this.id} no existe.`,
				})
			}
		}

		// RETORNAR VALIDACIONES
		return compile
	}

	// OBTENER VALOR
	public getValue(env: Environment): Value | undefined {
		if (this.props.exp.compile(env)) {
			const value: Value | undefined = this.props.exp.getValue(env)
			return value
		}
	}
}

export default VectorPosition
