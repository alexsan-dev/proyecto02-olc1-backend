import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import Value from '../expression/value'
import FunctionCall from './call'
import errors from '../../error'

class GetValue extends FunctionCall {
	private refValue: Value | undefined

	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; params: [Expression] }) {
		super(token, { ...props, id: 'GetValue' }, true)
	}

	// COMPILAR
	public compile(env: Environment): boolean {
		// OBTENER LISTA
		let compile = true
		const list = env.getVar(this.props.id)
		if (list) {
			if (list.compile(env)) {
				// OBTENER VALOR
				if (this.props.params[0].compile(env)) {
					const indexValue = this.props.params[0].getValue(env)
					if (indexValue && indexValue.compile(env)) {
						// VERIFICAR TIPOS
						if (indexValue.getType() === DataType.INTEGER) {
							const indexNum = indexValue.getValue(env) as number
							const currentList = list.getValue(env) as DataValue[]

							if (indexNum >= 0 && indexNum < currentList.length) {
								this.refValue = new Value(this.token, {
									value: currentList[indexNum],
									type: list.getType(),
									refType: list.getType(),
								})
							} else {
								compile = false
								errors.push({
									token: this.token,
									type: 'Semantic',
									msg: `La posicion ${indexNum} esta fuera de rango para la lista ${this.props.id}.`,
								})
							}
						} else {
							compile = false
							errors.push({
								token: this.token,
								type: 'Semantic',
								msg: `La posicion de la lista dinamica ${this.props.id} debe ser un ${DataType.INTEGER}.`,
							})
						}
					}
				}
			}
		} else {
			compile = false
			errors.push({
				token: this.token,
				type: 'Semantic',
				msg: `La lista dinamica ${this.props.id} no existe.`,
			})
		}

		return compile
	}

	// OBTENER VALOR
	public getValue(): Value | undefined {
		return this.refValue
	}
}

export default GetValue
