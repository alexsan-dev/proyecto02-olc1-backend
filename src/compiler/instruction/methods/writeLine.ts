import Environment from '../../runtime/environment'
import { TokenInfo } from '../../utils/types'
import Expression from '../expression/data'
import FunctionCall from './call'

class WriteLine extends FunctionCall {
	// CONSTRUCTOR
	constructor(
		public token: TokenInfo,
		public props: {
			params: Expression[]
			id: string
		}
	) {
		super(token, props, true)
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		// OBTENER VALORES
		this.props.params.forEach((exp) => {
			if (exp.compile() && exp.getValue(env)?.compile(env))
				console.log(exp.getValue(env)?.getValue(env))
		})
		return true
	}
}

export default WriteLine
