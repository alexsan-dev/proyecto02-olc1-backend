// TIPOS DE DATOS
enum DataType {
	INT = 'INT',
	DECIMAL = 'DECIMAL',
	BOOLEAN = 'BOOLEAN',
	CHAR = 'CHARACTER',
	STRING = 'STRING',
	DYNAMICLIST = 'LIST',
}

export type DataValue = string | number | boolean

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
