import Environment from '../../runtime/environment'
import { TokenInfo } from '../../utils/types'
import Instruction from '../models'

class ContinueValue extends Instruction {
	// CONSTRUCTOR
	constructor(public token: TokenInfo) {
		super(token, 'Continue')
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		// BUSCAR ENTORNO DE FUNCION
		let currentEnvironment: Environment | undefined = env

		// RECURSIVA
		const searchEnvironment = () => {
			if (currentEnvironment?.getName() !== 'Loop') {
				if (currentEnvironment?.getPrevEnv()) {
					currentEnvironment = currentEnvironment?.getPrevEnv()
					searchEnvironment()
				} else return
			} else return
		}
		searchEnvironment()

		// ASIGNAR RETORNO A FUNCION
		if (currentEnvironment) {
			// EJECUTAR BREAK
			const continueFunction = currentEnvironment.getFunction('continue')
			if (continueFunction) continueFunction.compile()
			return true
		} else return false
	}
}

export default ContinueValue
