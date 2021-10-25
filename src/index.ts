// TOOLS
import errors from './compiler/error'
import compile from './compiler'
import parser from './grammar'
import fs from 'fs'

// INICIAR PARSER
try {
	const input: Buffer = fs.readFileSync('./test/input.java')
	const instructions = parser.parse(input.toString())
	compile(instructions)

	if (errors.length) console.log('Errores: ' + JSON.stringify(errors, null, 2))
} catch (err) {
	console.error(err)
}

export default {}
