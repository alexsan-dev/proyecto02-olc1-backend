import { TokenInfo } from 'compiler/utils'

const errors: {
	type: 'Lexical' | 'Syntax' | 'Semantic'
	msg: string
	token: TokenInfo
}[] = []

export default errors
