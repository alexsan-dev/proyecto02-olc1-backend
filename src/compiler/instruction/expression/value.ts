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
		public props: { value: string | DataValue[]; type: DataType; fromCall?: FunctionCall }
	) {
		super(token, 'Value')
		this.refType = this.props.type
	}

	// COMPILAR UN VALOR SIEMPRE DEVOLVERA TRUE
	public compile(env: Environment): boolean {
		// CONVERTIR FUNCION A VALOR
		if (this.props.fromCall) {
			const valueCall = this.props.fromCall?.getValue()
			if (valueCall?.props) {
				this.props = valueCall?.props
				this.refType = valueCall.refType
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
			const strValue: string | DataValue[] = this.props.value

			// CAST TIPO
			if (typeof strValue !== 'object') {
				switch (this.props.type) {
					case DataType.STRING:
						return strValue
					case DataType.INTEGER:
						if (typeof strValue === 'string') return parseInt(strValue as string)
						else return strValue
					case DataType.DOUBLE:
						return parseFloat(strValue as string)
					case DataType.BOOLEAN:
						if (typeof strValue === 'string') return (strValue as string).toLowerCase() === 'true'
						else return strValue
					case DataType.CHARACTER:
						return (strValue as string).charAt(0)
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
						return strValue
				}
			} else return strValue
		}
	}
}

export default Value
