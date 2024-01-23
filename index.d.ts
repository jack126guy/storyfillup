import { parser } from 'peggy';

export function parse(input: string, source?: unknown): StoryPart[];

export type StoryPart = TextPart | PlaceholderPart;

export interface TextPart {
	type: 'text';
	content: string;
}

export interface PlaceholderPart {
	type: 'placeholder';
	description: string;
	special: string | null;
}

export const SyntaxError: parser.SyntaxErrorConstructor;