/* eslint-disable indent */
// TIPOS
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import FunctionCall from '../methods/call'
import Instruction from '../models'

// ASIGNACIONES
class Value extends Instruction {
	// GLOBALES
	private refType: DataType

	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: { value: DataValue; type: DataType; fromCall?: FunctionCall }
	) {
		super(token, 'Value')
		this.refType = this.props.type
	}

	// COMPILAR UN VALOR SIEMPRE DEVOLVERA TRUE
	public compile(env: Environment): boolean {
		// CONVERTIR FUNCION A VALOR
		if (this.props.fromCall?.compile(env)) {
			const valueCall = this.props.fromCall?.getValue()

			if (valueCall?.compile(env)) {
				this.props = valueCall?.props
				this.refType = valueCall.getType()
			}
		}

		// COMPILAR VALOR
		if (this.props.type === DataType.ID) {
			if (env) {
				const newValue: Value | undefined = env.getVar(this.props.value as string)
				if (newValue?.compile(env)) this.refType = newValue?.getType()
			}
		} else this.refType = this.props.type

		return true
	}

	// OBTENER TIPO DE RESULTADO
	public getType(): DataType {
		return this.refType
	}

	// OBTENER VALOR CAST
	public getValue(env: Environment): DataValue | undefined {
		if (env) {
			// CAST TIPO
			if (typeof this.props.value !== 'object') {
				switch (this.props.type) {
					case DataType.STRING:
						return this.props.value
					case DataType.INTEGER:
						if (typeof this.props.value === 'string') return parseInt(this.props.value as string)
						else return this.props.value
					case DataType.DOUBLE:
						if (typeof this.props.value === 'string') return parseFloat(this.props.value as string)
						else return this.props.value
					case DataType.BOOLEAN:
						if (typeof this.props.value === 'string')
							return (this.props.value as string).toLowerCase() === 'true'
						else return this.props.value
					case DataType.CHARACTER:
						return (this.props.value as string).charAt(0)
					case DataType.ID:
						if (this.props.value) {
							const newValue: Value | undefined = env.getVar(this.props.value as string)
							if (newValue?.compile(env)) {
								this.refType = newValue.getType()
								return newValue.getValue(env)
							}
						}
						break
					default:
						return this.props.value
				}
			} else return this.props.value
		}
	}
}

export default Value
