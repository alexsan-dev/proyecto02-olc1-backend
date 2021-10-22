/* eslint-disable indent */
// TIPOS
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import FunctionCall from '../methods/call'
import Instruction from '../models'

// ASIGNACIONES
class Value extends Instruction {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		public props: { value: string | DataValue[]; type: DataType; fromCall?: FunctionCall }
	) {
		super(token, 'Value')
	}

	// COMPILAR UN VALOR SIEMPRE DEVOLVERA TRUE
	public compile(env: Environment): boolean {
		// CONVERTIR FUNCION A VALOR
		if (this.props.fromCall?.compile(env)) {
			const valueCall = this.props.fromCall.getValue()
			if (valueCall?.props) this.props = valueCall?.props
		}

		// COMPILAR VALOR
		if (this.props.type === DataType.ID) {
			if (env) {
				const newValue: Value | undefined = env.getVar(this.props.value as string)
				this.props.value = (newValue?.getValue(env) as string | DataType[]) ?? ''
				this.props.type = newValue?.props.type || this.props.type
			}
		}
		return true
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
						return parseInt(strValue as string)
					case DataType.DOUBLE:
						return parseFloat(strValue as string)
					case DataType.BOOLEAN:
						return (strValue as string).toLowerCase() === 'true'
					case DataType.CHARACTER:
						return (strValue as string).charAt(0)
					case DataType.ID:
						if (this.props.value) {
							const newValue: Value | undefined = env.getVar(this.props.value as string)
							if (newValue) {
								this.props.type = newValue?.props.type
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
