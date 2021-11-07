import FunctionBlock from '../instruction/methods/functions'
import Expression from '../instruction/expression/data'
import FunctionCall from '../instruction/methods/call'
import Instruction from '../instruction/models'
import graphviz from 'graphviz'

let g: graphviz.Graph | undefined
/**
 * Iniciar graphviz
 * @description Iniciar instancia de graphviz
 */
const startInitGraphviz = () => {
	g = graphviz.digraph('G')
}

const getRandom = () => {
	return Math.round(Math.random() * 10000)
}

/**
 * Generar dot
 * @description Revierte la lista de nodos y crea un archivo .dot
 */
export const generateDot = (instructions: Instruction[]): string | undefined => {
	if (g) {
		const parentNode = g.addNode('Main')

		const graphAExpression = (expNode: graphviz.Node, rand: number, exp?: Expression) => {
			if (g) {
				if (exp?.props.operator) {
					graphAExpression(expNode, rand, exp.props.left)
					const oper = g.addNode(`${exp.props.operator}_${rand}`, { label: exp.props.operator })
					g.addEdge(expNode, oper)
					graphAExpression(expNode, rand, exp.props.right)
				} else if (exp?.props.value) {
					const valRand = getRandom()
					const valNode = g.addNode(`Value_${rand}_${valRand}`, { label: 'Value' })
					const valNodeVal = g.addNode(`${exp.props.value.props.value}_${rand}_${valRand}`, {
						label: exp.props.value.props.value,
					})
					g.addEdge(expNode, valNode)
					g.addEdge(valNode, valNodeVal)
				}
			}
		}

		instructions.forEach((instruction) => {
			if (instruction.name !== 'Main') {
				if (g) {
					// FUNCIONES
					if (instruction.name === 'Function') {
						// FUNCION
						const func = instruction as FunctionBlock
						const newNode = g.addNode(`${instruction.name}_${func.props.id}_${getRandom()}`, {
							label: instruction.name,
						})
						const content = func?.props?.content

						// RECORRER FUNCION
						content.forEach((item) => {
							if (g) {
								// RECORRER SEGUN TIPO DE INSTRUCCION
								const rand = getRandom()

								const nextNode = g.addNode(item.name, { label: `${item.name}_${rand}` })
								g.addEdge(newNode, nextNode)

								if (item.name === 'FunctionCall') {
									const call = item as FunctionCall
									const newParentNode = g.addNode(`${call.props?.id + '_' ?? ''}${rand}`, {
										label: call.props?.id,
									})

									g.addEdge(nextNode, newParentNode)
									const par = g.addNode(`(_${rand}`, { label: '(' })
									g.addEdge(nextNode, par)

									// PARAMETROS
									call.props.params.forEach((param) => {
										if (g) {
											const newRand = getRandom()
											const expNode = g?.addNode(`Expression_${newRand}`, { label: 'Expression' })

											// RECORRER EXPRESSION
											graphAExpression(expNode, newRand, param)
											g?.addEdge(nextNode, expNode)
										}
									})

									const par2 = g.addNode(`)_${rand}`, { label: ')' })
									g.addEdge(nextNode, par2)
								}
							}
						})

						// AGREGAR A FUNCION
						g?.addEdge(parentNode, newNode)
					}
				}
			}
		})

		return g.to_dot()
	}
}

export default startInitGraphviz
