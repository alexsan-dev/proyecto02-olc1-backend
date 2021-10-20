/* eslint-disable indent */
// TIPOS
import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Instruction from '../models'

// ASIGNACIONES
class Value extends Instruction {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { value: string | DataValue[]; type: DataType }) {
		super(token, 'Value')
	}

	// COMPILAR UN VALOR SIEMPRE DEVOLVERA TRUE
	public compile(): boolean {
		return true
	}

	// OBTENER VALOR CAST
	public getValue(env: Environment): DataValue | undefined {
		if (env) {
			const strValue: string | DataValue[] = this.props.value

			// CAST TIPO
			switch (this.props.type) {
				case DataType.STRING:
					return strValue
				case DataType.INTEGER:
					return parseInt(strValue as string)
				case DataType.DECIMAL:
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
					break
			}
		}
	}
}

export class VectorValue extends Value {
	// CONSTRUCTOR
	constructor(
		token: TokenInfo,
		private index: number,
		public props: { value: string | DataValue[]; type: DataType }
	) {
		super(token, props)
	}

	// OBTENER VALOR PRIMITIVO
	public getValue(env: Environment): DataValue | undefined {
		if (env) {
			if (this.props.value) {
				const newValue: Value | undefined = env.getVar(this.props.value as string)
				if (newValue) {
					this.props.type = newValue?.props.type
					return (newValue.getValue(env) as DataValue[])[this.index]
				}
			}
		}
	}
}

export default Value
