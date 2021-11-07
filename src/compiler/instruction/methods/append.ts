import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import Value from '../expression/value'
import FunctionCall from './call'
import errors from '../../error'

class Append extends FunctionCall {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; params: [Expression] }) {
		super(token, { ...props, id: 'Append' }, true)
		this.props.id = 'Append'
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
					const newValue = this.props.params[0].getValue(env)
					if (newValue && newValue.compile(env)) {
						// VERIFICAR TIPOS
						if (
							newValue.getType() === list.props.generic ||
							`${DataType.DYNAMICLIST}<${newValue.props.generic}>` === list.props.generic
						) {
							// AGREGAR
							const temporal = list.getValue(env) as DataValue[]
							temporal.push(newValue.getValue(env) as DataValue)

							// GUARDAR
							env.setVar(
								this.props.id,
								new Value(this.token, {
									value: temporal,
									type: DataType.DYNAMICLIST,
									generic: list.props.generic,
								})
							)
						} else {
							compile = false
							errors.push({
								token: this.token,
								type: 'Semantic',
								msg: `El no se puede asignar el tipo ${newValue.getType()} a ${
									list.props.generic
								}.`,
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
}

export default Append
