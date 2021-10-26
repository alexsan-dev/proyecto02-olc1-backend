import DataType, { DataValue, TokenInfo } from '../../utils/types'
import Environment from '../../runtime/environment'
import Expression from '../expression/data'
import Value from '../expression/value'
import FunctionCall from './call'
import errors from '../../error'

class SetValue extends FunctionCall {
	// CONSTRUCTOR
	constructor(token: TokenInfo, public props: { id: string; params: [Expression, Expression] }) {
		super(token, { ...props, id: 'SetValue' }, true)
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
						if (indexValue.getType() === DataType.INTEGER) {
							const newValue = this.props.params[1].getValue(env)
							if (newValue && newValue.compile(env)) {
								// VERIFICAR TIPOS
								if (newValue.getType() === list.getType()) {
									// AGREGAR
									const temporal = list.getValue(env) as DataValue[]
									const indexNum = indexValue.getValue(env) as number
									temporal[indexNum] = newValue.getValue(env) as DataValue

									// GUARDAR
									env.setVar(
										this.props.id,
										new Value(this.token, {
											value: temporal,
											type: DataType.DYNAMICLIST,
											refType: list.getType(),
										})
									)
								} else {
									compile = false
									errors.push({
										token: this.token,
										type: 'Semantic',
										msg: `El no se puede asignar el tipo ${newValue.getType()} a ${list.getType()}`,
									})
								}
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
}

export default SetValue
