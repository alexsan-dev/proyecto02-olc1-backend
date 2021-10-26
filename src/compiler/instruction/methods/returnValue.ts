import Environment from '../../runtime/environment'
import { TokenInfo } from '../../utils/types'
import Expression from '../expression/data'
import Value from '../expression/value'
import Instruction from '../models'

class ReturnValue extends Instruction {
	// CONSTRUCTOR
	constructor(public token: TokenInfo, public props: { content: Expression }) {
		super(token, 'Return')
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		if (this.props.content.compile(env)) {
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
				const value = this.props.content.getValue(env)
				if (value?.compile(env)) {
					// EVALUAR Y GUARDAR
					currentEnvironment.addVar(
						'return',
						value.getType(),
						new Value(this.token, {
							value: (value.getValue(env) as string) ?? '',
							type: value.getType(),
						})
					)

					// EJECUTAR RETURN
					const returnFunction = currentEnvironment.getFunction('return')
					if (returnFunction) returnFunction.compile()
					return true
				} else return false
			} else return false
		} else return false
	}

	// OBTENER VALOR
	public getValue(env: Environment): Value | undefined {
		return this.props.content.getValue(env)
	}
}

export default ReturnValue
