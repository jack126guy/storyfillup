# StoryFillup

StoryFillup is a simple markup language for writing text with placeholders to be filled in by a user. It was originally designed for "fill in the blank" stories but can be used in other applications.

This package provides a simple parser (generated using [Peggy](https://peggyjs.org/)) for the StoryFillup language, which returns an array of text and placeholder objects which can be used by an application.

## Usage

```
import * as StoryFillup from 'storyfillup';

const text = 'This is a {{ description }}. {{ interjection | exclamation }}';
const parsed = StoryFillup.parse(text);
console.log(parsed);

/*
Result:

[
	{ type: 'text', content: 'This is a ' },
	{ type: 'placeholder', description: 'description', special: null },
	{ type: 'text', content: '.' },
	{ type: 'placeholder', description: 'interjection', special: 'exclamation' },
]
*/
```

### Error Handling

An error is thrown if the input has invalid syntax. The error object contains additional information about the error such as the location within the text (refer to the [Peggy documentation](https://peggyjs.org/documentation.html)).

The `format` method on the error object produces a string with information. This requires a mapping from sources (such as filenames or even objects) to text inputs. The source for parsing is passed as an optional second argument to `parse`:

```
import * as StoryFillup from 'storyfillup';

const input = 'This is a {{';
const name = 'example';
try {
	StoryFillup.parse(input, name);
} catch (e) {
	console.log(e.format([{ source: name, text: input }]));
}

/*
Result:

Error: Expected "|", "}}", or placeholder description but end of input found.
 --> example:1:13
  |
1 | This is a {{
  |             ^
*/
```

The `SyntaxError` class is exported for applications to handle different types of errors:

```
import * as StoryFillup from 'storyfillup';

try {
	// ...
} catch (e) {
	if (e instanceof StoryFillup.SyntaxError) {
		// Handle parsing error
	}
	// Handle other error
}
```

## Language Syntax

Placeholders are indicated by double braces (`{{ }}`). Single braces are allowed outside placeholders, but not inside them. (The restriction on braces inside placeholders may change in the future.)

The text inside the braces is a description followed by an optional "special" code. The special code is separated from the description by a vertical bar (`|`). This means that the description cannot contain a vertical bar, but the special code can.

For example, the placeholder `{{example|with|a|special|code}}` has a description of `example` and a special code of `with|a|special|code`.

This specification does not mandate any particular interpretation of the description and special code; this is left to the application. The intended use is for the description to serve as a human-readable description of what to fill in, and the special code to serve as a signal to the application for some sort of special processing.

The parser trims leading and trailing whitespace in the description and special code, so `{{ x | y }}` has a single-character description and a single-character special code. Note, however, that space around any additional vertical bars in the special code is not trimmed: `{{ x | y | z }}` has a special code of "y | z". Descriptions and special codes may be empty, so `{{ }}`, `{{}}`, and `{{|}}` are all considered placeholders. Applications may apply special processing in these situations (for example, rejecting empty descriptions), but this specification does not require any such processing.

(Note that the last two examples in the previous paragraph are subtly different: `{{}}` is a placeholder with no special code, while `{{|}}` is a placeholder with an empty special code. The parser represents the former as `null` and the latter as an empty string. Applications may choose to treat these two placeholders as identical.)

## License

This package is available under the MIT License. Refer to `LICENSE.txt` for details.