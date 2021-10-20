// TIPOS
import { Value } from '../instruction/expression'
import { DataType, TokenInfo } from '../utils'
import errors from '../error'

class Environment {
	// GLOBALES
	private vars: {
		[id: string]: {
			value: Value | undefined
			type: DataType
		}
	}

	// CONSTRUCTOR
	constructor(private prevEnv?: Environment) {
		this.vars = {}
	}

	// AGREGAR VARIABLE
	public addVar(id: string, type: DataType, value?: Value): void {
		// NO EXISTE
		if (this.getVar(id) === undefined) {
			this.vars[id] = { value, type }
		} else
			errors.push({
				type: 'Semantic',
				token: this.getVar(id)?.token || ({} as TokenInfo),
				msg: `La variable ${id} ya se ha declarado anteriormente.`,
			})
	}

	// OBTENER VARIABLE
	public getVar(id: string): Value | undefined {
		return this.vars[id]?.value || this.prevEnv?.getVar(id)
	}
}

export default Environment
