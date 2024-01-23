import { parse as parserParse, SyntaxError } from './parser.js';

function parse(input, source) {
	return parserParse(input, { grammarSource: source });
}

export { parse, SyntaxError };