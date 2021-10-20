import DataType, { TokenInfo } from '../../utils/types'
import { Value } from '../expression'
import Instruction from '../models'

// ASIGNACIONES
class DynamicList extends Instruction {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; type: DataType }) {
		super(token, 'DynamicList')
	}

	// COMPILAR
	public compile(): boolean {
		return true
	}

	// OBTENER VALOR
	public getValue(): Value {
		return new Value(this.token, { value: [], type: DataType.DYNAMICLIST })
	}
}

export default DynamicList
