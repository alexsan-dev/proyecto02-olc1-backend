// TOOLS
import parser from './grammar'
import fs from 'fs'

// GLOBALES
let globalAST

// INICIAR PARSER
try {
	const input: Buffer = fs.readFileSync('./test/input.txt')
	globalAST = parser.parse(input.toString())
	console.log(JSON.stringify(globalAST, null, '\t'))
} catch (err) {
	console.error(err)
}

export default {}
