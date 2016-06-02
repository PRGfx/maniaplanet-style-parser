'use strict';
function MPStyle(input, options) {
	var TextBlock = function() {
		var content = '';
		var styles = {
			color: null,
			isBold: false,
			isCapitalized: false,
			isItalic: false,
			isNarrow: false,
			isWide: false,
			isLink: null,
			isShadowed: false,
			link: null
		};
		return {
			content: content,
			getContent: function() { return content; },
			styles: function(s) {
				if (s !== undefined) {
					for (var style in styles) {
						if (s[style] !== undefined)
							styles[style] = s[style];
					}
					return this;
				}
				return styles;
			},
			append: function(c) {
				content += c;
				return this;
			},
			copy: function() {
				var s = new TextBlock();
				s.styles(styles);
				return s;
			}
		};
	};
	options = {
		mlProtocol: options && options.mlProtocol ? options.mlProtocol : 'maniaplanet://',
		stripTags: options && options.stripTags ? options.stripTags : [],
		useClasses: options && options.useClasses ? options.useClasses : false
	};
	var blocks = [(new TextBlock())];
	var escaped = false;
	var formatBlocks = [0];
	var append = function(c) {
		blocks[blocks.length - 1].append(c);
	};
	var setStyle = function(style) {
		var nb = blocks[blocks.length - 1]
			.copy()
			.styles(style);
		blocks.push(nb);
		formatBlocks[formatBlocks.length - 1]++;
	};
	var parse = function(input) {
		for (var i = 0; i < input.length; i++) {
			var c = input.charAt(i).toLowerCase();
			if (c == '$') {
				if (!escaped)
					escaped = true;
				else {
					append(c);
					escaped = false;
				}
			}
			else {
				if (!escaped) {
					append(input.charAt(i));
					continue;
				}
				var cs = blocks[formatBlocks[formatBlocks.length - 1]].styles();
				switch (c) {
					case 'o':
						if (options.stripTags.indexOf('o') < 0)
							setStyle({isBold: !cs.isBold});
						break;
					case 'i':
						if (options.stripTags.indexOf('i') < 0)
							setStyle({isItalic: !cs.isItalic});
						break;
					case 'g':
						setStyle({color: null});
						break;
					case 'z':
						blocks.push(new TextBlock());
						formatBlocks[formatBlocks.length - 1]++;
						break;
					case 't':
						if (options.stripTags.indexOf('t') < 0)
							setStyle({isCapitalized: !cs.isCapitalized});
						break;
					case 'h':
					case 'l':
					case 'p':
						if (cs.isLink === null) {
							var href = null;
							if (input.charAt(i + 1) == '[') {
								for (var j = i + 1; j < input.length; j++) {
									if (input.charAt(j) == ']') {
										href = input.substr(i+2, j-i-2);
										break;
									}
								}
								i += href.length + 2;
							}
							if (options.stripTags.indexOf(c) < 0)
								setStyle({isLink: c, link: href});
						} else {
							setStyle({isLink: null, link: null});
						}
						break;
					case '<':
						blocks.push(blocks[blocks.length - 1].copy());
						formatBlocks.push(blocks.length - 1);
						break;
					case '>':
						formatBlocks.pop();
						blocks.push(blocks[formatBlocks[formatBlocks.length - 1]].copy());
						formatBlocks[formatBlocks.length - 1] = blocks.length - 1;
						break;
				}
				if (input.substr(i, 3).match(/[0-9a-f]{3}/i)) {
					if (options.stripTags.indexOf('color') < 0)
						setStyle({color: input.substr(i, 3)});
					i += 2;
				}
				escaped = false;
			}
		}
	};
	var render = function() {
		var Tag = function(type, attributes, content) {
			var t = type;
			var a = attributes || {};
			var c = content || '';
			var render = function (forceTag) {
				if (forceTag || Object.keys(a).length > 0)
					forceTag = true;
				else return c;
				var output = '<' + t;
				for (var attr in a) {
					if (!attributes.hasOwnProperty(attr)) continue;
					if (!attributes[attr]) continue;
					output += ' ' + attr + '="' + attributes[attr] + '"';
				}
				output += '>' + c + '</'+t+'>';
				return output;
			};
			return {
				render: render
			};
		};
		var output = '';
		for (var i = 0; i < blocks.length; i++) {
			var block = blocks[i];
			if (block.getContent()) {
				var content = block.getContent();
				var style = block.styles();
				if (style.isLink) {
					var href = style.link ? style.link : content;
					if (style.isLink == 'h' || style.isLink == 'p') {
						if (!href.startsWith(options.mlProtocol))
							href = options.mlProtocol + href;
					}
					var attr = {'href': href};
					if (options.useClasses)
						attr.class = 'mp-link mp-link-' + style.isLink;
					content = (new Tag('a', attr, content)).render();
				}
				var cssStyle = '';
				var classes = [];
				if (style.isBold) {
					cssStyle += 'font-weight:bold;';
					classes.push('mp-bold');
				}
				if (style.isItalic) {
					cssStyle += 'font-style:italic;';
					classes.push('mp-italic');
				}
				if (style.color) {
					cssStyle += 'color:#' + style.color + ';';
					classes.push('mp-color');
				}
				if (style.isShadowed) {
					cssStyle += 'text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);';
					classes.push('mp-shadow');
				}
				if (style.isNarrow) {
					cssStyle += 'letter-spacing:-.1em;font-size:95%;';
					classes.push('mp-narrow');
				}
				if (style.isWide) {
					cssStyle += 'letter-spacing:.1em;font-size:105%;';
					classes.push('mp-wide');
				}
				if (style.isCapitalized) {
					cssStyle += 'text-transform: uppercase;';
					classes.push('mp-upper');
				}
				var attributes = {};
				if (cssStyle) {
					if (!options.useClasses) {
						attributes.style = cssStyle;
					} else {
						if (style.color)
							attributes.style = 'color:#' + style.color + ';';
					}
				}
				if (options.useClasses && classes.length)
					attributes.class = classes.join(' ');
				content = (new Tag('span', attributes, content)).render();
				output += content;
			}
		}
		return output;
	};
	parse(input);
	return render();
}