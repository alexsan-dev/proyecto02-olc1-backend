import DataType, { TokenInfo } from 'compiler/utils/types'
import Instruction from './models'

// ASIGNACIONES
class DynamicList extends Instruction {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; type: DataType }) {
		super(token, 'DynamicList')
	}

	// COMPILAR
	compile(): void {
		console.log('compile')
	}
}

export default DynamicList
