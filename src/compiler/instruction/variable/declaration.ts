// TIPOS
import DataType, { TokenInfo } from 'compiler/utils/types'
import Assignment from './assignment'
import Instruction from './models'

// DECLARACIONES
class Declaration extends Instruction {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { type: DataType; assignments: Assignment[] }) {
		super(token, 'Declaration')
	}

	public compile(): void {
		throw new Error('Method not implemented.')
	}
}

export default Declaration
