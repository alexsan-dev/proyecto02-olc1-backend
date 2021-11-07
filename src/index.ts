import express from 'express'
import cors from 'cors'

// TOOLS
import startInitGraphviz, { generateDot } from './compiler/ast'
import Instruction from './compiler/instruction/models'
import symbols from './compiler/symbols'
import errors from './compiler/error'
import logs from './compiler/logs'
import compile from './compiler'
import parser from './grammar'

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

let instructions: Instruction[] = []
startInitGraphviz()

app.get('/dot', (_req, res) => {
	res.status(200).json({ dot: generateDot(instructions) })
})

app.post('/compile', (req, res) => {
	const body = req.body as { code: string }
	if (body?.code?.length) {
		// INICIAR PARSER
		try {
			symbols.length = 0
			errors.length = 0
			logs.length = 0
			instructions = parser.parse(body.code)
			compile(instructions)

			return res.status(200).json({ success: true, symbols, errors, logs })
		} catch (err) {
			return res.status(200).json({ success: false, err })
		}
	} else return res.status(200).json({ success: false })
})

app.listen(5000, () => {
	console.log('Servidor en http://localhost:5000')
})

export default {}
