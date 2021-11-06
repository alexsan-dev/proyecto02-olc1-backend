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
	// COMPILAR PRIMERO

	// PROPIEDADES DE EXP IZQUIERDA
	const lValue: DataValue | undefined = left.compile(env) ? left.getValue(env) : undefined
	const lType: DataType | undefined = left.getType()

	// PROPIEDADES DE EXP DERECHA
	const rValue: DataValue | undefined = right?.compile(env) ? right?.getValue(env) : undefined
	const rType: DataType | undefined = right?.getType()

	// PROPIEDADES DE CONDICION
	const conditionValue: DataValue | undefined = condition?.getValue(env)

	// RESULTADOS
	let value: DataValue | undefined
	let type: DataType | undefined

	// OPERAR
	switch (operator) {
		//  OPERADORES ARITMETICOS
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
		case Operator.DIVISION:
			if ((rValue as number) !== 0)
				switch (lType) {
					case DataType.INTEGER:
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

		// OPERADORES BOOLEANOS
		case Operator.OR:
			value = (lValue as boolean) || (rValue as boolean)
			type = DataType.BOOLEAN
			break
		case Operator.AND:
			value = (lValue as boolean) || (rValue as boolean)
			type = DataType.BOOLEAN
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
		case Operator.EQUALSEQUALS:
			value = lValue === rValue
			type = DataType.BOOLEAN
			break
		case Operator.NONEQUALS:
			value = lValue !== rValue
			type = DataType.BOOLEAN
			break
		case Operator.MOREOREQUALS:
			value = (lValue as number) >= (rValue as number)
			type = DataType.BOOLEAN
			break
		case Operator.LESSOREQUALS:
			value = (lValue as number) <= (rValue as number)
			type = DataType.BOOLEAN
			break
		case Operator.MAJOR:
			value = (lValue as number) > (rValue as number)
			type = DataType.BOOLEAN
			break
		case Operator.MINOR:
			value = (lValue as number) < (rValue as number)
			type = DataType.BOOLEAN
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

/**
 * Valores por defecto
 * @description Retorna un valor por defecto para cada tipo de dato
 * @param type
 * @returns
 */
export const defaultValues = (type: DataType): DataValue => {
	switch (type) {
		case DataType.INTEGER:
			return 0
		case DataType.DOUBLE:
			return 0
		case DataType.STRING:
			return ''
		case DataType.BOOLEAN:
			return true
		case DataType.CHARACTER:
			return '0'
		case DataType.ARRAY:
			return []
		default:
			return ''
	}
}

export default operateValues
