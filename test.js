import * as StoryFillup from './index.js';
import { test, expect } from '@jest/globals';

test.each([
	[
		'',
		[],
	],
	[
		'This is a story.',
		[
			{ type: 'text', content: 'This is a story.' },
		],
	],
	[
		' This is a story with extra  space. ',
		[
			{ type: 'text', content: ' This is a story with extra  space. ' },
		],
	],
	[
		'This is a {{ noun }}.',
		[
			{ type: 'text', content: 'This is a ' },
			{ type: 'placeholder', description: 'noun', special: null },
			{ type: 'text', content: '.' },
		],
	],
	[
		'This is an {{ adjective | example }} {{ noun }}.',
		[
			{ type: 'text', content: 'This is an ' },
			{ type: 'placeholder', description: 'adjective', special: 'example' },
			{ type: 'text', content: ' ' },
			{ type: 'placeholder', description: 'noun', special: null },
			{ type: 'text', content: '.' },
		],
	],
	[
		'This is a {{ noun | example | test }}.',
		[
			{ type: 'text', content: 'This is a ' },
			{ type: 'placeholder', description: 'noun', special: 'example | test' },
			{ type: 'text', content: '.' },
		],
	],
	[
		'This is a {{}}.',
		[
			{ type: 'text', content: 'This is a ' },
			{ type: 'placeholder', description: '', special: null },
			{ type: 'text', content: '.' },
		],
	],
	[
		'This is a {{|}}.',
		[
			{ type: 'text', content: 'This is a ' },
			{ type: 'placeholder', description: '', special: '' },
			{ type: 'text', content: '.' },
		],
	],
	[
		'This is a symbol: |',
		[
			{ type: 'text', content: 'This is a symbol: |' },
		],
	],
	[
		'This is a story {example}.',
		[
			{ type: 'text', content: 'This is a story {example}.' },
		],
	],
	[
		'This is a story } {',
		[
			{ type: 'text', content: 'This is a story } {' },
		],
	],
	[
		'This is a {{ noun }}}',
		[
			{ type: 'text', content: 'This is a ' },
			{ type: 'placeholder', description: 'noun', special: null },
			{ type: 'text', content: '}' },
		],
	],
])('parses: %s', (input, expectedResult) => {
	const actualResult = StoryFillup.parse(input);
	expect(actualResult).toEqual(expectedResult);
});

test.each([
	'This is a {{ noun',
	'This is a noun }}',
	'This is a {{{noun}}}.',
])('does not parse: %s', (input) => {
	expect(() => StoryFillup.parse(input)).toThrow(StoryFillup.SyntaxError);
});

test('formats error message given source', () => {
	const text = 'This is a {{ noun';
	const source = 'test';
	let errorThrown = undefined;

	try {
		StoryFillup.parse(text, source);
	} catch (e) {
		errorThrown = e;
	}

	expect(errorThrown).toBeDefined();
	expect(errorThrown.format([{ source, text }])).toContain('{{ noun');
});