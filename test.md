---
layout: main
title: 'Inline formatting 1: box types'
css:
- inline0
- inline1
js: test
---

**Fonts used**

Initially, I found myself working with these fonts due to the following mechanisms:
Chromium (hamburger button / settings / show advanced / web content / customize fonts)
allows me to set 'standard', 'serif', 'sans-serif', & 'fixed width' (monospace)
defaults.  The last three are used when I set font-famly to the keywords (without 
quotes) serif, sans-serif, & monospace; the first is used when I don't specify a
font or use an invalid value.  My settings were _FreeSerif_{green}, Droid Serif, Droid Sans,
& Droid Mono (I had tinkered with these earlier; I don't know what they were when I
installed chromium).  Hence my use of FreeSerif.

For other values of font-family, Chromium appears to request a font from my os, 
Ubuntu 14.  /etc/ fonts/ fonts.conf specifies folders in which to look for fonts, 
especially /usr/ share/ fonts/ truetype/.  These are used to build the font cache when 
I run sudo fc-cache -f (-v) (font-config cache, -force update, -verbose).  When I edit 
a file in /u/s/f/t/, in order to get Chromium to use the updates file, I have to 
run fc-cache then restart chromium.
  
/etc/ fonts/ conf-avail/ contains 82 config modules that are involved in determining
the font actually rendered.  Certain well known font names are mapped to equivalents 
in the Liberation family: 

- Times / 'Times' / Times New Roman / 'Times New Roman' -> Liberation Serif.
- Arial / 'Arial' / Helvetica / 'Helvetica' -> Liberation Sans.

Certain keyword variants are mapped to the DejaVu family: 

- 'serif' (in quotes) -> DejaVu Serif.
- 'sans-serif' / sans / 'sans' / sans serif / 'sans serif' -> DejaVu Sans.
- 'monospace' / mono / 'mono' / mono space / 'mono space'  -> DejaVu Sans Mono.

Font-family values appear to be case-insensitive.  When a font (like testfont, 
described below) has limited glyphs and I employ a missing glyph, the browser 
tries to determine a fallback font.  It'll first use my font-stack (eg. with 
{font-family: testfont, FreeSerif}, it'll use FreeSerif); if I don't supply a 
fallback, the browser doesn't use the 'standard' font from its own settings; 
instead, it appears to submit a null request to the os, which is handled by 
three config modules: 

- 49-sansserif.conf: if font doesn't have a family, make it sans-serif.
- 57-dejavu-sans.conf: interpret sans-serif as _dejavu sans_{green}.
- 10-hinting-slight.conf: use 'slight hinting', which in this case 
  increases the font-weight. (Font hinting is a topic I haven't explored.)

Hence my use of DejaVu Sans.

Establishing what fonts are being used isn't simple.  getComputedStyle often 
reports an intermediate value like 'sans'.  Method that usually works in Chromium: 

- Select element in devtools.
- Go to styles tab /
- box-model-styles pane.
- Scroll to bottom under 'rendered fonts'.

Afaik this can't be accessed programmatically (say to console.log an element's 
true font).  I've seen this fail in a few situations: 

- I think with `<pre>`.
- When remotely inspecting an attached phone.  In these 2 cases, the 'rendered
  fonts' section doesn't appear.
- If I employ a missing glyph and don't specify a fallback, or my fallback is 
  DejaVu Sans; I remove DejaVuSans.ttf and restart chromium.  In that case 
  'rendered fonts' lists the name as a null string, though it does
  render the glyphs.

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


