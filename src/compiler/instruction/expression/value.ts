// TIPOS
import { TokenInfo } from 'compiler/utils/types'
import { Instruction } from '../variable'

// ASIGNACIONES
class ExpValue extends Instruction {
	// CONSTRUCTOR
	constructor(token: TokenInfo) {
		super(token, 'Expression')
	}

	public compile(): void {
		throw new Error('Method not implemented.')
	}
}

export default ExpValue
