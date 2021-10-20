// TIPOS
import type { JISONTokenInfo, TokenInfo } from './types'

/**
 * Obtener token
 * @description Reducir propiedades de token de JISON
 * @param jisonToken
 * @returns
 */
const getToken = (jisonToken: JISONTokenInfo): TokenInfo => ({
	line: jisonToken.first_line,
	col: jisonToken.first_column,
})

export default getToken
