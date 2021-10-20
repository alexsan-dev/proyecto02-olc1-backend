import DataType, { TokenInfo } from 'compiler/utils/types'
import Instruction from './models'

// ASIGNACIONES
class DynamicList extends Instruction {
	// CONSTRUCTOR
	constructor(public props: { token: TokenInfo; id: string; type: DataType }) {
		super(props.token, 'DynamicList')
	}

	// COMPILAR
	compile(): void {
		console.log('compile')
	}
}

export default DynamicList
