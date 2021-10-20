// TOOLS
import errors from './compiler/error'
import parser from './grammar'
import fs from 'fs'

// GLOBALES
let globalAST

// INICIAR PARSER
try {
	const input: Buffer = fs.readFileSync('./test/input.txt')
	globalAST = parser.parse(input.toString())

	globalAST[0].compile()
	console.log(errors)
} catch (err) {
	console.error(err)
}

export default {}
