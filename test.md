---
layout: main
title: 'Inline formatting 1: box types'
css:
- inline0
- inline1
js: test
---

<div class='discloseC mdCaptureStart'></div>

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

<div class='mdCaptureEnd'></div>


<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: DISPLAY INLINE-BLOCK ----------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Display: inline-block**

An inline element's background fills its content box; the inline box can't
be styled directly; it's visible only by its effect on the containing line
box.  However, when set to display:inline-block, the inline element generates
no content box, and its inline box becomes a miniature 'block formatting
context' - ie., it can have multiple line boxes and inline boxes inside it.
In this case, the background fills the inline box, which is to say the inline
box can be styled directly.  Switching to inline-block does not alter the 
layout as long as the element doesn't

- contain nested elements whose styles alter the size of the inline box;
- vertically align nested elements differently than its parent;
- break into >1 line, if its line-height != container's line-height; or
- have an explicit height
- (and probably other scenarios I haven't thought of / run across).

The 3 'notes about display' in line-height section explore these scenarios.

<div class='mdCaptureEnd'></div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: COMPLEX BOX INTERACTION -------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Complex box interaction**

I find it difficult to intuit the behavior of the example above when the 
strut and inline box are hidden (as they are without artificial visualization 
aids).  There are 3 behavioral zones (visualize with <label>red triangles</label>
<input id='Ctr02chkTriangles' type='checkbox'>) as line-height increases:

- ____Left____ zone: nothing happens.  Unseen reason: strut fully vertically
  overlaps pink inline box and determines line box top & bottom.
  
- ____Middle____: line box gets taller; nothing happens to content box.  Reason:
  pink inline box extends below strut bottom & determines line box bottom.
  
- ____Right____: line box gets taller; content box gets lower.  Reason: pink box
  fully vertically overlaps strut & determines line box top & bottom.

Calculation of the tipping-points, using formulae discussed later.
(These notes make more sense if visualizations of the yellow strut box and pink 
inline box are turned on.)

Content box height @ 50px

    = (a   + d  ) /em   *fs
    = (900 + 200) /1000 *50
    = 55px

The left triangle point is where the pink inline box has grown enough that it extends
below baseline as much as yellow strut box.  Strut's descent below baseline

    = (d   + g/2) /em   *fs 
    = (200 + 50 ) /1000 *80 
    = 20px
    
Inline box's descent below baseline

    = 20px = descent      + half leading
           = d  /em   *fs + 1/2(line height - content height)
           = 200/1000 *50 + 1/2(line height - 55)
           = 10           + 1/2(line height - 55)
      10   = 1/2(line height - 55)
      20   = line height - 55
      75   = line height
  
_76th pixel_{red} is the 1st to make the blue line box taller.

The second triangle marks the point where the inline box's ascent equals
the strut's ascent.  Strut's ascent

    = (a   + g/2) /em   * fs 
    = (900 + 50 ) /1000 * 80 
    = 76px

Inline box's ascent

    = 76px = ascent       + half leading
           = a  /em   *fs + 1/2(line height - content height)
           = 900/1000 *50 + 1/2(line height - (900+200)/1000 *50 )
           = 45           + 1/2(line height - 55)
      31   = 1/2(line height - 55)
      62   = line height - 55
     117   = line height
 
Except the 118th pixel gets added to bottom; _the 119th_{red} is the 1st to push 
strut & content box down.

<div class='mdCaptureEnd'></div>

The content box can have horizontal margins, border, & padding.
Vertical border & padding don't affect the line box; horizontal values 
affect inline (horizontal) flow:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 3 -------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex03' class='exhibit'>
  <p id='Ex03p'>a<span id='Ex03s'>b</span>c</p>
</div>

<div id='Ctr03' class='controls'>
  <select id='Ctr03sel1' data-opts='inline,inline-block'></select>
  <p><span>margin:      </span> <input type='range' id='Ctr03slider1' value='0' max='20'></p>
  <p><span>border-width:</span> <input type='range' id='Ctr03slider2' value='0' max='20'></p>
  <p><span>padding:     </span> <input type='range' id='Ctr03slider3' value='0' max='20'></p>
</div>

The content box's background can mask the line above, due to 

- padding / border
- small line-height.

Initisl settings below: 

- {padding-top: 4px;
-  line-height: 1  } <meta c='preList'>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 4 -------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex04' class='exhibit'>
  <p id='Ex04p'>
    <span id='Ex04s'>ddd1 ddd2 ddd3 ddd4 ddd5 ddd6 ddd7</span>
  </p>
</div>

<div id='Ctr04' class='controls'>
  <p><span>padding:    </span> 0<input type='range' id='Ctr04slider1' value='4' max='20'>20px</p>
  <p><span>line-height:</span> 0<input type='range' id='Ctr04slider2' min='0' value='1' max='2' step='.1'>2</p>
</div>





