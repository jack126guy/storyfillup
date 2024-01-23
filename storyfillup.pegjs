story = (placeholder / text)* / ""
text "story text" = text:$([^{}] / "{" !"{" / "}" !"}")+
	{
		return {
			type: 'text', content: text,
		};
	}
placeholder = "{{" description:placeholder_desc special:("|" placeholder_special)? "}}"
	{
		return {
			type: 'placeholder',
			description: description.trim(),
			special: special ? special[1].trim() : null
		};
	}
placeholder_desc "placeholder description" = $[^{}|]*
placeholder_special "placeholder special" = $[^{}]*