// TIPOS DE DATOS
enum DataType {
	ID = 'ID',
	ARRAY = 'ARRAY',
	STRING = 'STRING',
	BOOLEAN = 'BOOLEAN',
	INTEGER = 'INTEGER',
	DOUBLE = 'DOUBLE',
	DYNAMICLIST = 'LIST',
	CHARACTER = 'CHARACTER',
}

export type DataValue = string | number | boolean | DataValue[]

export enum Operator {
	PLUS = '+',
	MINUSMINUS = '--',
	PLUSPLUS = '++',
	MINUS = '-',
	NEGATION = '-*',
	DIVISION = '/',
	TIMES = '*',
	MODULE = '%',
	POWER = '^',
	TERNARY = '?:',
	EQUALSEQUALS = '==',
	MOREOREQUALS = '>=',
	MAJOR = '>',
	LESSOREQUALS = '<=',
	MINOR = '<',
	NOT = '!',
	NONEQUALS = '!=',
	AND = '&&',
	OR = '||',
}

// LINEAS Y COLUMNAS
export interface JISONTokenInfo {
	first_line: number
	last_line: number
	first_column: number
	last_column: number
}

export interface TokenInfo {
	line: number
	col: number
}

export default DataType
