/* eslint-disable indent */
import DataType, { DataValue, Operator, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import errors from '../../error'
import Value from './value'

/**
 * Operar valores
 * @description Operar dos valores segun una tabla de operaciones
 * @param left
 * @param operator
 * @param right
 */
const operateValues = (
	env: Environment,
	token: TokenInfo,
	left: Value,
	operator: Operator,
	right?: Value,
	condition?: Value
): Value | undefined => {
	// PROPIEDADES DE EXP IZQUIERDA
	const lValue: DataValue | undefined = left.getValue(env)
	const lType: DataType | undefined = left.props.type

	// PROPIEDADES DE EXP DERECHA
	const rValue: DataValue | undefined = right?.getValue(env)
	const rType: DataType | undefined = right?.props.type

	// PROPIEDADES DE CONDICION
	const conditionValue: DataValue | undefined = condition?.getValue(env)

	// RESULTADOS
	let value: DataValue | undefined
	let type: DataType | undefined

	// OPERAR
	switch (operator) {
		case Operator.PLUS:
			switch (lType) {
				case DataType.INTEGER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) + (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as number) + (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.BOOLEAN:
							value = (lValue as number) + (rValue ? 1 : 0)
							type = DataType.INTEGER
							break
						case DataType.CHARACTER:
							value = (lValue as number) + (rValue as string).charCodeAt(0)
							type = DataType.INTEGER
							break
						case DataType.STRING:
							value = (lValue as string) + (rValue as string)
							type = DataType.STRING
							break
						default:
							break
					}
					break
				case DataType.DOUBLE:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) + (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.DOUBLE:
							value = (lValue as number) + (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.BOOLEAN:
							value = (lValue as number) + (rValue ? 1 : 0)
							type = DataType.DOUBLE
							break
						case DataType.CHARACTER:
							value = (lValue as number) + (rValue as string).charCodeAt(0)
							type = DataType.DOUBLE
							break
						case DataType.STRING:
							value = (lValue as string) + (rValue as string)
							type = DataType.STRING
							break
						default:
							break
					}
					break
				case DataType.BOOLEAN:
					switch (rType) {
						case DataType.INTEGER:
							value = (rValue ? 1 : 0) + (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (rValue ? 1 : 0) + (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.STRING:
							value = lValue ? 'true' : 'false' + (rValue as string)
							type = DataType.STRING
							break
						default:
							break
					}
					break
				case DataType.CHARACTER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as string).charCodeAt(0) + (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as string).charCodeAt(0) + (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.STRING:
							value = (lValue as string) + (rValue as string)
							type = DataType.STRING
							break
						default:
							break
					}
					break
				case DataType.STRING:
					value = (lValue as string) + (rValue as string)
					type = DataType.STRING
					break
				default:
					break
			}
			break
		case Operator.MINUS:
			switch (lType) {
				case DataType.INTEGER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) - (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as number) - (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.BOOLEAN:
							value = (lValue as number) - (rValue ? 1 : 0)
							type = DataType.INTEGER
							break
						case DataType.CHARACTER:
							value = (lValue as number) - (rValue as string).charCodeAt(0)
							type = DataType.INTEGER
							break
						default:
							break
					}
					break
				case DataType.DOUBLE:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) - (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.DOUBLE:
							value = (lValue as number) - (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.BOOLEAN:
							value = (lValue as number) - (rValue ? 1 : 0)
							type = DataType.DOUBLE
							break
						case DataType.CHARACTER:
							value = (lValue as number) - (rValue as string).charCodeAt(0)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				case DataType.BOOLEAN:
					switch (rType) {
						case DataType.INTEGER:
							value = (rValue ? 1 : 0) - (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (rValue ? 1 : 0) - (rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				case DataType.CHARACTER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as string).charCodeAt(0) - (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as string).charCodeAt(0) - (rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				default:
					break
			}
			break
		case Operator.TIMES:
			switch (lType) {
				case DataType.INTEGER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) * (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as number) * (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.CHARACTER:
							value = (lValue as number) * (rValue as string).charCodeAt(0)
							type = DataType.INTEGER
							break
						default:
							break
					}
					break
				case DataType.DOUBLE:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) * (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.DOUBLE:
							value = (lValue as number) * (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.CHARACTER:
							value = (lValue as number) * (rValue as string).charCodeAt(0)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				case DataType.CHARACTER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as string).charCodeAt(0) * (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as string).charCodeAt(0) * (rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				default:
					break
			}
			break
		// TODO: division por 0
		case Operator.DIVISION:
			switch (lType) {
				case DataType.INTEGER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) / (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as number) / (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.CHARACTER:
							value = (lValue as number) / (rValue as string).charCodeAt(0)
							type = DataType.INTEGER
							break
						default:
							break
					}
					break
				case DataType.DOUBLE:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) / (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.DOUBLE:
							value = (lValue as number) / (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.CHARACTER:
							value = (lValue as number) / (rValue as string).charCodeAt(0)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				case DataType.CHARACTER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as string).charCodeAt(0) / (rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = (lValue as string).charCodeAt(0) / (rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				default:
					break
			}
			break
		case Operator.POWER:
			switch (lType) {
				case DataType.INTEGER:
					switch (rType) {
						case DataType.INTEGER:
							value = Math.pow(lValue as number, rValue as number)
							type = DataType.INTEGER
							break
						case DataType.DOUBLE:
							value = Math.pow(lValue as number, rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				case DataType.DOUBLE:
					switch (rType) {
						case DataType.INTEGER:
							value = Math.pow(lValue as number, rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.DOUBLE:
							value = Math.pow(lValue as number, rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				default:
					break
			}
			break
		case Operator.MODULE:
			switch (lType) {
				case DataType.INTEGER:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) % (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.DOUBLE:
							value = (lValue as number) % (rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				case DataType.DOUBLE:
					switch (rType) {
						case DataType.INTEGER:
							value = (lValue as number) % (rValue as number)
							type = DataType.DOUBLE
							break
						case DataType.DOUBLE:
							value = (lValue as number) % (rValue as number)
							type = DataType.DOUBLE
							break
						default:
							break
					}
					break
				default:
					break
			}
			break
		case Operator.NEGATION:
			switch (lType) {
				case DataType.INTEGER:
					value = (lValue as number) * -1
					type = DataType.INTEGER
					break
				case DataType.DOUBLE:
					value = (lValue as number) * -1
					type = DataType.DOUBLE
					break
				default:
					break
			}
			break
		case Operator.PLUSPLUS:
			value = (lValue as number) + 1
			type = lType
			break
		case Operator.MINUSMINUS:
			value = (lValue as number) - 1
			type = lType
			break
		case Operator.TERNARY:
			if (conditionValue && conditionValue !== undefined) {
				value = lValue
				type = lType
			} else {
				value = rValue
				type = rType
			}
			break
		default:
			break
	}

	// RETORNO
	if (value !== undefined && type !== undefined)
		return new Value(token, { value: value.toString(), type })
	else
		errors.push({
			type: 'Semantic',
			msg: `No es posible operar la expresion ${lType} ${operator} ${rType}.`,
			token,
		})
}

export default operateValues
