// TIPOS
import DataType, { TokenInfo } from 'compiler/utils/types'
import Assignment from './assignment'
import Instruction from './models'

// DECLARACIONES
class Declaration extends Instruction {
	// CONSTRUCTOR
	constructor(public props: { type: DataType; assignments: Assignment[]; token: TokenInfo }) {
		super(props.token, 'Declaration')
	}

	public compile(): void {
		throw new Error('Method not implemented.')
	}
}

export default Declaration
