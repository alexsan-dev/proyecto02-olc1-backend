import Environment from '../../runtime/environment'
import FunctionCall from '../methods/call'
import { TokenInfo } from '../../utils'
import Instruction from '../models'

// INICIO DEL PROGRAMA
class Main extends Instruction {
	// CONSTRUCTOR
	constructor(public token: TokenInfo, private functionCall: FunctionCall) {
		super(token, 'Main')
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		this.functionCall.compile(env)
		return true
	}
}

export default Main
