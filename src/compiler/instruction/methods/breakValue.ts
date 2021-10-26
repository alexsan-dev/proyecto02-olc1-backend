import Environment from '../../runtime/environment'
import { TokenInfo } from '../../utils/types'
import Instruction from '../models'

class BreakValue extends Instruction {
	// CONSTRUCTOR
	constructor(public token: TokenInfo) {
		super(token, 'Break')
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		// BUSCAR ENTORNO DE FUNCION
		let currentEnvironment: Environment | undefined = env

		// RECURSIVA
		const searchEnvironment = () => {
			if (
				currentEnvironment?.getName() !== 'Function' &&
				currentEnvironment?.getName() !== 'Loop' &&
				currentEnvironment?.getName() !== 'Switch'
			) {
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
			const breakFunction = currentEnvironment.getFunction('break')
			if (breakFunction) breakFunction.compile()
			return true
		} else return false
	}
}

export default BreakValue
