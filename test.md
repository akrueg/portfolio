---
layout: main
title: 'Inline formatting 1: box types'
css:
- inline0
- inline1
js: test
---

Having determined that, I hardcoded those fonts into my css:

- Open the ttf file in FontForge.
- Select all non-keyboard glyphs / right-click / clear - reduces file size from
  ~700k to ~40k; CodePen has a 1MB page limit.
- File menu / 'export' new ttf file (as opposed to saving in fontforge's .sfd format).
- Upload to [FontSquirrel's converter] (http://www.fontsquirrel.com/tools/webfont-generator) 
  with settings:
  - expert
  - WOFF (or whatever I want)
  - hinting: keep existing
  - vertical: no adjustment (otherwise strips out line gap)
  - x-height matching: none
  - subsetting: none (though this works as an alternative to manually clearing
    unwanted glyphs in fontforge)
  - css: base64 encode
- Download kit; extract; open styles.css.
- use the following css:

@font-face {
  font-family: '_nameIPick_{green}';
  src        : url(data:application/font-woff;charset=utf-8;base64,_b64string_{green}) 
               format('woff' _(or other)_{green}) } <meta c='pre'>

Base64 encodes binary as text using 64 printable characters: 

- A-Z, a-z, 0-9 - which is 62 characters.
- Last 2 chars are + / in 'standard base64' variant, which is what FontSquirrel
  generates, which Chromium accepts.
- [Wikipedia entry] (https://en.wikipedia.org/wiki/Base64#URL\_applications)
  talks about the need to either use 'modified Base64 for URL' or encode the 
  standard b64 string, I think when passing it to a server as a url-encoded datum. 
  
64 = 2^6: each character represents a sextet (6 bits); hence each 4 characters
represent 3 bytes of encoded data.  Thus base64 is not a compression algorithm
(it uses 4 bytes to encode 3 bytes) but a padding / normalization algorithm.

Woff (web open font format) works with Chromium and, according to CanIUse, 94%
of US browsers, the exception being legacy IE, which needs eot (embedded open 
type).


