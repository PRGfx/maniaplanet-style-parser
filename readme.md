# ManiaPlanet Style Parser

JavaScript function to translate ManiaPlanet text-styling syntax into html.

## Usage
```javascript
MPStyle(input, options);

MPStyle(input, {
    stripTags: ['w', 'n', 's'],
    useClasses: true
});
```

### Options
* **mlProtocol**: Protocol for manialink links, defaults to `maniaplanet://`. Could be set to `tmtp://` for TMF links.
* **stripTags**: List of tags that will be stripped from formatting. Remove colors by adding `'color'` as value.
* **useClasses**: If set to `true`, the rendered tags will have the class attributes set:
    * mp-bold
    * mp-italic
    * mp-upper
    * mp-shadow
    * mp-wide
    * mp-narrow
    * mp-color
    * mp-link mp-link-l/mp-link-h/mp-link-p

## Supported Tags
* **$o**: bold text
* **$i**: italic text
* **$t**: uppercase text
* **$s**: text with shadow
* **$w**: wider letter spacing
* **$n**: narrower letter spacing
* **$l, $h, $p**: weblinks ($l) and links to the game ($h and $p for backwards compatability)
* **$<, $>**: styling blocks: styles applied withing a block are reset behind it, e.g.:
    ```
    $009blue text, $<$900red $obold text$> and blue again
    ```
# Building and Testing
Install build-tools with `npm i`, build module for usage in web with `npm run build` or `npm run build-min` as `build/mp-style.js` or `build/mp-style.min.js` respectively.
  
Run the tests with `npm run test` or `npm run coverage` to generate the code coverage.
