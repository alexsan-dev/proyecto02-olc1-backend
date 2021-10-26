import Environment from './runtime/environment'
import Instruction from './instruction/models'
import { FunctionBlock } from './instruction'
import errors from './error'

// COMPILAR APLICACION
const compile = (instructions: Instruction[]) => {
	// CREAR ENTORNO GLOBAL
	const globalEnv = new Environment('Global', 'Global')

	// COMPILAR TODO PRIMERO
	instructions.forEach((instruction: Instruction) => {
		// GUARDAR VARIABLES Y FUNCIONES
		if (instruction.name === 'Function') {
			const functionBlock = instruction as FunctionBlock
			globalEnv.addFunction(functionBlock.props.id, functionBlock.props.type, functionBlock)
		} else if (instruction.name === 'Declaration') {
			instruction.compile(globalEnv)
		} else if (instruction.name === 'Assignment') {
			instruction.compile(globalEnv)
		} else if (instruction.name === 'FunctionCall') {
			instruction.compile(globalEnv)
		} else if (instruction.name === 'Condition') {
			instruction.compile(globalEnv)
		} else if (instruction.name === 'Loop') {
			instruction.compile(globalEnv)
		} else if (instruction.name === 'Switch') {
			instruction.compile(globalEnv)
		}
	})

	// BUSCAR MAIN
	const mainIndex = instructions.findIndex((instruction) => instruction.name === 'Main')
	if (mainIndex >= 0) instructions[mainIndex].compile(globalEnv)
	else
		errors.push({
			type: 'Semantic',
			token: { line: 0, col: 0 },
			msg: 'No se ha definido ningun start with',
		})
}

export default compile
