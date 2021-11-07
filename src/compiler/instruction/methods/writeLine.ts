import Environment from '../../runtime/environment'
import { TokenInfo } from '../../utils/types'
import Expression from '../expression/data'
import FunctionCall from './call'
import logs from '../../logs'

class WriteLine extends FunctionCall {
	// CONSTRUCTOR
	constructor(
		public token: TokenInfo,
		public props: {
			params: Expression[]
			id: string
		}
	) {
		super(token, { ...props, id: 'WriteLine' }, true)
		this.props.id = 'WriteLine'
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		// OBTENER VALORES
		this.props.params.forEach((exp) => {
			if (exp.compile(env)) {
				if (exp.getValue(env)?.compile(env)) {
					logs.push(exp.getValue(env)?.getValue(env))
					console.log(exp.getValue(env)?.getValue(env))
				}
			}
		})
		return true
	}
}

export default WriteLine
