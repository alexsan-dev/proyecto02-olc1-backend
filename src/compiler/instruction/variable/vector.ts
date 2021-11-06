// TIPOS
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import Assignment from './assignment'
import { Value } from '../expression'
import errors from '../../error'

// ASIGNACIONES DE VECTORES
class VectorAssignment extends Assignment {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			defValues?: Expression[]
			type?: DataType
			size?: Expression
			id: string
		}
	) {
		super(token, props.id)
	}

	// COMPILAR EXPRESIONES COMO VECTOR
	public compile(env: Environment, type: DataType): boolean {
		// COMPILAR LOCAL
		let compile = true
		if (this.props.defValues?.length) {
			const compiles = this.props.defValues.map((exp: Expression) => exp.compile(env))
			compile = compiles.every((compile: boolean) => compile === true)
		} else {
			const sizeValue = this.props.size?.getValue(env)
			if (sizeValue?.getType() === DataType.INTEGER) {
				if (this.props.size && (sizeValue.getValue(env) as number) >= 0) compile = true
				else compile = false
			} else {
				compile = false
				errors.push({
					type: 'Semantic',
					token: this.token,
					msg: `El tamaño del vector deber ser un ${DataType.INTEGER}`,
				})
			}
		}

		// COMPILAR PADRE
		const newValue = this.getValue(env, type)

		if (compile) {
			if (newValue?.compile(env)) {
				compile = super.setValue(env, DataType.ARRAY, newValue)
			} else compile = false
		}
		return compile
	}

	// OBTENER VALOR
	public getValue(env: Environment, type: DataType): Value | undefined {
		if (this.props.defValues) {
			// OBTENER
			const values: { value: DataValue; type: DataType }[] = this.props.defValues
				.map((exp: Expression) => {
					const value = exp.getValue(env)
					if (value?.compile(env)) {
						return {
							value: value?.getValue(env),
							type: value?.getType(),
						}
					}
				})
				.filter(Boolean) as { value: DataValue; type: DataType }[]

			// VERIFICAR TIPO
			if (values.every((value) => value.type === values[0].type)) {
				if (values[0].type === type) {
					const validValues: DataValue[] = values.map((value) => value.value)
					const newValue: Value = new Value(this.token, {
						value: validValues,
						type: DataType.ARRAY,
						generic: type,
					})
					return newValue
				} else
					errors.push({
						type: 'Semantic',
						token: this.token,
						msg: `No se puede asignar el tipo ${values[0].type} a ${type}.`,
					})
			} else
				errors.push({
					type: 'Semantic',
					token: this.token,
					msg: 'La lista de valores debe ser del mismo tipo.',
				})
		} else if (this.props.size) {
			const value = this.props.size.getValue(env)
			if (value?.getType() === DataType.INTEGER) {
				return new Value(this.token, {
					value: new Array(value.getValue(env) as number).fill(undefined),
					type: DataType.ARRAY,
					generic: type,
				})
			} else
				errors.push({
					type: 'Semantic',
					token: this.token,
					msg: `El tamaño del vector deber ser un ${DataType.INTEGER}`,
				})
		} else
			errors.push({
				type: 'Semantic',
				token: this.token,
				msg: 'Fue imposible asignar el vector',
			})
	}
}

export default VectorAssignment
