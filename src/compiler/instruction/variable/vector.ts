// TIPOS
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import { Value } from '../expression'
import Instruction from '../models'
import errors from '../../error'

// ASIGNACIONES DE VECTORES
class VectorAssignment extends Instruction {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: {
			defValues?: Expression[]
			type?: DataType
			size?: number
			id: string
		}
	) {
		super(token, 'VectorAssignment')
	}

	// COMPILAR EXPRESIONES COMO VECTOR
	public compile(env: Environment): boolean {
		if (this.props.defValues) {
			const compiles = this.props.defValues.map((exp: Expression) => exp.compile(env))
			return compiles.every((compile: boolean) => compile === true)
		} else {
			if (this.props.size && this.props.size >= 0) return true
			else return false
		}
	}

	// OBTENER VALOR
	public getValue(env: Environment): Value | undefined {
		if (this.props.defValues) {
			// OBTENER
			const values: { value: DataValue; type: DataType }[] = this.props.defValues.map(
				(exp: Expression) => ({
					value: exp.getValue(env)?.getValue(env),
					type: exp.getValue(env)?.props.type,
				})
			) as { value: DataValue; type: DataType }[]

			// VERIFICAR TIPO
			if (values.every((value) => value.type === values[0].type)) {
				if (values[0].type === this.props.type) {
					const validValues: DataValue[] = values.map((value) => value.value)
					return new Value(this.token, { value: validValues, type: this.props.type })
				} else
					errors.push({
						type: 'Semantic',
						token: this.token,
						msg: `No se puede asignar el tipo ${values[0].type} a ${this.props.type}`,
					})
			} else
				errors.push({
					type: 'Semantic',
					token: this.token,
					msg: 'La lista de valores debe ser del mismo tipo.',
				})
		} else if (this.props.size) {
			return new Value(this.token, {
				value: new Array(this.props.size).fill(undefined),
				type: this.props.type || DataType.STRING,
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
