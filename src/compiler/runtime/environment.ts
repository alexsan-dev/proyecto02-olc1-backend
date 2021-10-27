// TIPOS
import FunctionBlock from '../instruction/methods/functions'
import { Value } from '../instruction/expression'
import { DataType, TokenInfo } from '../utils'
import errors from '../error'

type EnvironmentName = 'Function' | 'Main' | 'Global' | 'Condition' | 'Loop' | 'Case' | 'Switch'
class Environment {
	// GLOBALES
	private vars: {
		[id: string]: {
			value: Value | undefined
			type: DataType
		}
	}

	private functions: {
		[id: string]: {
			value: FunctionBlock | undefined
			type: DataType | 'void'
		}
	}

	// CONSTRUCTOR
	constructor(private name: EnvironmentName, private id: string, private prevEnv?: Environment) {
		this.vars = {}
		this.functions = {}
	}

	// OBTENER ENTORNO PREVIO
	public getPrevEnv(): Environment | undefined {
		return this.prevEnv
	}

	// OBTENER NOMBRE
	public getName(): EnvironmentName {
		return this.name
	}

	// OBTENER ID
	public getID(): string {
		return this.id
	}

	// AGREGAR VARIABLE
	public addVar(id: string, type: DataType, value?: Value): void {
		// NO EXISTE
		if (this.vars[id] === undefined) {
			this.vars[id] = { value, type }
		} else
			errors.push({
				type: 'Semantic',
				token: this.getVar(id)?.token || ({} as TokenInfo),
				msg: `La variable ${id} ya se ha declarado anteriormente.`,
			})
	}

	// RE ASIGNAR VARIABLE
	public setVar(id: string, newValue: Value): void {
		if (this.getVar(id) !== undefined) {
			// BUSCAR
			if (this.vars[id] !== undefined) this.vars[id] = { value: newValue, type: this.vars[id].type }
			else this.prevEnv?.setVar(id, newValue)
		} else
			errors.push({
				type: 'Semantic',
				token: this.getVar(id)?.token || ({} as TokenInfo),
				msg: `La variable ${id} no existe.`,
			})
	}

	// OBTENER VARIABLE
	public getVar(id: string): Value | undefined {
		return this.vars[id]?.value ?? (this.prevEnv ? this.prevEnv?.getVar(id) : undefined)
	}

	// OBTENER FUNCION
	public getFunction(id: string): FunctionBlock | undefined {
		return this.functions[id]?.value !== undefined
			? Object.create(
					Object.getPrototypeOf(this.functions[id]?.value),
					Object.getOwnPropertyDescriptors(this.functions[id]?.value)
			  )
			: this.prevEnv
			? this.prevEnv?.getFunction(id)
			: undefined
	}

	// AGREGAR FUNCION
	public addFunction(id: string, type: DataType | 'void', value: FunctionBlock): void {
		// NO EXISTE
		if (this.functions[id] === undefined) {
			this.functions[id] = { value, type }
		} else
			errors.push({
				type: 'Semantic',
				token: this.getVar(id)?.token || ({} as TokenInfo),
				msg: `La funcion ${id} ya se ha declarado anteriormente.`,
			})
	}
}

export default Environment
