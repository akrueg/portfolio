### Inline formatting 4: vertical-align

Vertical-align applies to the content (like align-self), not the 
container (like align-items or text-align); setting the 
vertical-align of a container influences how that container is 
positioned within _its_ container.  The following chart 
indicates the alignment points for text-containing elements like 
`<span>`s and textless elements like `<img>`s (cf. &sect;3.2).

<div class='discloseC mdCaptureStart minorNote'></div>

Chart row height

When I click expand / contract to switch between the narow & wide
tables, I want them to be the same height.  I don't mind that the 
'Npx' & 'N%' paragraphs break onto more lines in the expanded 
version, pushing down the following graphic.  What unsettles my
user experience is for the tables to be *almost* but not quite the 
same height - for the intial 'b' of 'bottom' in the wide table 
to be 2px lower than the initial 'b' of 'bot' in the narrow table.

A sure fix would be to make them 1 long table and hide / show 
columns, instead of having each in a separate `<table>` in a
separate `<div>`, but that would degrade the source.  I
wouldn't care if I were coding in straight html, where the 
tables are loaded with so many tags that they're virtually
human-unreadable, but with Markdown I can have tables that look
halfway decent in the source; fusing 2 of them together would 
break that.

2 things were causing the differences in row height:

____Difference 1____: In the wide table, the cell containing 'element `<br>` with text' 
breaks onto 2 lines, where 'txt' in the narrow table is 1 line.
The resulting difference was much less than 1 line, because 
that row of the narrow table also contains the beaver background 
image, which was *almost* 2 normal line-heights:

That row, the 1st of the narrow table, is 1 em high, due to its
content (column titles with no line breaks).  Shrinking the
beaver icon down to a 1em square made it unrecognizable.  2em
was more like it, but that left a little white-space between it 
and the cell border - the cell width is set by that column's 
widest content, the word 'mid'.  2.25em made the background 
exactly fill cell.

But the first row of the wide table, due to the broken line
'element `<br>` with text', is 2em.  The font is set to sans-serif,
which triggers Chromium's default sans font, which I've set to
Droid Sans, which has exactly the same metrics as DejaVu Sans:
m=2048, a=1901, d=483, g=0, thus normal line height 1.164em,
twice which is 2.328em.  At my default font-size of 15px,
(2.328 - 2.25) * 15 = 1.17px.  So I made the image a bit bigger -
I actually had to set its height to 2.37em to stop the difference 
from occuring, presumably due to rounding imprecision.

____Difference 2____: The presence of the up- and down-arrow glyphs in the narrow
table was making those 2 rows a bit taller.  Consulting Chromium's
readout of 'rendered fonts' for the cell containing '&#8679; el'
(4 characters: arrow + \s + e + l), the cell contains 1 glyph of 
FreeSerif & 3 of Droid Sans.  FreeSerif is what I set Chromium's
"standard" font to, the ultimate fallback, so clearly that's
the up-arrow, which Droid Sans must lack.  And FreeSerif's
normal height is 1.2, greater than 1.164 - at fs:15px, that's a
difference .54px.  Solution: give the table rows an explicit 
line-height > 1.2. I used 1.5 (they look better with a little 
more room anyway); except I left the 1st row alone, or I'd have 
had to increase the size of that background image more, to 3em 
(2 lines * 1.5em/line).

____Note 1 on Droid Sans vs DejaVu Sans____:
In these pages, every time I state that an example is FreeSerif 
or DejaVu Sans, it's using b64-encoded fonts stored in the css;
everything else is inheriting sans-serif from the `<html>`
element, for which Chromium on my computer uses Droid Sans.

I didn't notice until this episode that my default sans font is
Droid; I thought it was DejaVu.  The whole reason
I chose DejaVu Sans to focus on was that I had been using it 
(along with FreeSerif) by default, back at the beginning of 
this project when I was figuring out how all this worked.
So why am I now still defaulting to FreeSerif but no longer
defaulting to DejaVu Sans?  I didn't change the setting in
Chromium or install any new fonts.

It's because I'm now using the correct css sans serif keyword,
sans-serif.  Before I was using sans serif, without the hyphen,
which Chromium treats as a font name, not a keyword; it asks
the OS for that font; my OS recognizes it (along with 
'sans-serif' in quotes, 'sans serif', sans, 'sans', and 
probably others) as meaning 'sans serif' and responds with its 
go-to sans font, DejaVu Sans.  I already worked out the 
mechanics of this back in &setc;1, but it's slippery.

____Note 2 on Droid vs DejaVu____: I was surprised that they have
the exact same metrics.  The 3 inline-block `<p>`s below are 
*FreeSerif*{.Ex01FS}, *DejaVu Sans*{.Ex01DV}, & *Droid 
Sans*{.Ex01Dr}, all {line-height: normal}. I added a small b64 
encoding of Droid Sans to the css, containing only x, \s, and \n, 
so all 3 fonts should be system-independent.  (Whoops, not in 
FireFox.  The two fonts differ in their 'typo' metrics - see &sect;3.1 -
which don't influence Chrome but must influence FF.)

<div class='Ex01 exhibit'>
  <p class='Ex01FS'>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x</p>
  <p class='Ex01DV'>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x</p>
  <p class='Ex01Dr'>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x</p>
</div>

Note above;

- FreeSerif's 1.2 line-height makes its column obviously taller,
  while the glyphs of DejaVu and Droid are aligned.

- Each inline block is aligning its baseline - the baseline of
  its lowest / last line box - with the baseline of _the containing 
  `<div>`_{.Ex01}, so the height-difference shows up at the top.

<div class='mdCaptureEnd'></div>

<div id='Ex02pane1' class='mdCaptureStart'></div>

<span id='Ctr02expand'><span>expand</span> ></span>

      |       |     |       | <meta i='Ex02tbl1' c='Ex02tbl'>
------|-------|-----|-------|-----
      | txt   |     |       |
v-al  | aligns own || with | of
top   | i-top | top | i-top | &#8679; el
t-top | i-top | top | c-top | strut
mid   | 1/2m  | mid | 1/2x  | strut
sup   | base  | bot | sup   | strut
base  | base  | bot | base  | strut
sub   | base  | bot | sub   | strut
t-bot | i-bot | bot | c-bot | strut
bot   | i-bot | bot | i-bot | &#8681; el

**Npx**: own baseline Npx above strut's baseline.

**N%**: own baseline N% of own height above strut's baseline.

<div id='Ex02pane2' class='mdCaptureStart'></div>

<span id='Ctr02contract'>&lt; <span>contract</span></span>

               |                      |        |                    | <meta i='Ex02tbl2' c='Ex02tbl'>
---------------|----------------------|--------|--------------------|----------------
               | element<br>with text |        |                    |
vertical-align | aligns own           |        | with               | of
top            | inline box top       | top    | inline box top     | highest element
text-top       | inline box top       | top    | content box top    | strut
middle         | 1/2 em height        | middle | 1/2 ex height      | strut
super          | baseline             | bottom | superscript height | strut
baseline       | baseline             | bottom | baseline           | strut
sub            | baseline             | bottom | subscript height   | strut
text-bottom    | inline box bottom    | bottom | content box bottom | strut
bottom         | inline box bottom    | bottom | inline box bottom  | lowest element

**Npx** (or other unit): sets own _baseline_{indigo!} _(if text)_{indigo} / 
_bottom_{teal!} _(if textless)_{teal} Npx above strut's baseline.

**N%**: sets own _baseline_{indigo!} / _bottom_{teal!} N% of own 
_line height_{indigo!} / _height_{teal!} above strut's baseline.

<div class='mdCaptureEnd'></div>


              
<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 1 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<svg id='Svg02' width='0' height='0'>
  <defs>
    <!-- Mask for strut: -->
    <linearGradient id='Svg02gradL1'>              <stop offset='50%'/><stop stop-opacity='0'/></linearGradient>
    <linearGradient id='Svg02gradR1' x1='1' x2='0'><stop offset='00%'/><stop stop-opacity='0'/></linearGradient>
    <linearGradient id='Svg02gradT1' x2='0' y2='1'><stop offset='70%'/><stop stop-opacity='0'/></linearGradient>
    <linearGradient id='Svg02gradB1' x2='0' y1='1'><stop offset='20%'/><stop stop-opacity='0'/></linearGradient>
    <pattern id='Svg02pattern1' width='1' height='1' patternContentUnits='objectBoundingBox'>
      <rect width='1' height='1' fill='aqua'/>
      <rect width='1' height='1' fill='url(#Svg02gradL1)'/>
      <rect width='1' height='1' fill='url(#Svg02gradR1)'/>
      <rect width='1' height='1' fill='url(#Svg02gradT1)'/>
      <rect width='1' height='1' fill='url(#Svg02gradB1)'/>
    </pattern>
    <!-- Mask for pink span: -->
    <linearGradient id='Svg02gradL2'>              <stop offset='00%'/><stop stop-opacity='0'/></linearGradient>
    <linearGradient id='Svg02gradR2' x1='1' x2='0'><stop offset='50%'/><stop stop-opacity='0'/></linearGradient>
    <linearGradient id='Svg02gradT2' x2='0' y2='1'><stop offset='70%'/><stop stop-opacity='0'/></linearGradient>
    <linearGradient id='Svg02gradB2' x2='0' y1='1'><stop offset='20%'/><stop stop-opacity='0'/></linearGradient>
    <pattern id='Svg02pattern2' width='1' height='1' patternContentUnits='objectBoundingBox'>
      <rect width='1' height='1' fill='aqua'/>
      <rect width='1' height='1' fill='url(#Svg02gradL2)'/>
      <rect width='1' height='1' fill='url(#Svg02gradR2)'/>
      <rect width='1' height='1' fill='url(#Svg02gradT2)'/>
      <rect width='1' height='1' fill='url(#Svg02gradB2)'/>
    </pattern>
  </defs>
</svg> 

Vertical-align: <span id='Ctr02out'>baseline</span> / <input id='Ctr02txt1'> <meta i='Ctr02'>

<div id='Ex02' class='exhibit'>
  <input id='Ctr02rng' class='controls' type='range' value='4' max='7'>
  <p id='Ex02p1'>
    <span id='Ex02sTop'   >A<span id='Ex02sTopBar'   ></span></span><!-- 
 --><span id='Ex02sBottom'>A<span id='Ex02sBottomBar'></span></span><!--
 --><span id='Ex02sStrut' >
      <svg id='Ex02svgStrut' width='59' height='117'><text y='93'>A</text></svg>
    </span><!-- 
 --><span id='Ex02sMove'>
      <span id='Ex02sMoveBar1' ></span>
      <svg  id='Ex02svgMove' width='59'  height='117'><text y='93' >A</text></svg>
      <span id='Ex02sMoveBar2'></span>
    </span><!-- 
 --><span id='Ex02sImg' class='beaver'>
      <span id='Ex02sImgBar1'></span>
      <span id='Ex02sImgBar2'></span>
      <span id='Ex02sImgBar3'></span>
    </span>
  </p> 
</div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: PROPERTY ORDER ----------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Keyword order**

The chart above the graphic lists the keywords in order of 
alignment-point on target element, in downward order assuming 
{line-height: normal}: 

- inline box top
- 1/2 em height
- baseline
- inline box bottom

This doesn't correspond to the keywords' effects.  The slider 
applies the keywords to the graphic in order of final vertical 
position of pink `<span>`, in downward order: 

- top
- super
- text-bottom
- baseline
- middle
- text-top
- sub
- bottom

This (surprising, to me) order depends on the settings I chose for 
the graphic; giving the elements different heights, line-heights, 
or vertical-align values can change the keywords' effective 
vertical order.

Especially surprising to me is that _middle_ aligns unlike points
on the content (1/2 em) and container (1/2 ex).  Was there a 
use-case motivating that implementation?

The order is also different for the image, which jumps up & down as 
slider is transitioned.  Though its height is the same as the pink 
`<span>`, they're using different alignment-points (specified in 
pink & white columns of chart).

<div class='mdCaptureEnd'></div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: COLOR-MAPPED GLYPHS -----------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex02note1' class='discloseC mdCaptureStart minorNote'></div>

Color-mapped glyphs

Apparently there's a webkit way to do this with no Firefox support;
I used svg: the marked-x glyphs in the yellow & pink boxes are formed
from

- an aqua svg `<rect>`

- 4 black svg `<rects>` covering part of the aqua `<rect>` from the
  top, bottom, left, & right, leaving a certain portion of aqua
  showing through, to highlight the desired part of the glyph
  
- an svg `<pattern>` comprising those 5 `<rect>`s

- an svg _`<text>`_{seagreen} containing the glyph and filled with 
  that `<pattern>`

- an _`<svg>`_{blue} containing element

- a _`<span>`_{orchid} wrapping the _`<svg>`_{blue}, to which the desired
  vertical-align setting can be applied.
  
The _`<span>`'s_{orchid} internal structure, not indicating the 
components of the fill pattern (discussed below), is:

_`<span>`_{orchid} 
   _`<svg>`_{blue} 
      _`<text>`_{seagreen} _A_{aqua.Ex03tf} _`</text>`_{seagreen} 
   _`</svg>`_{blue} 
_`</span>`_{orchid} <meta c='pre'>  


____Sizing____

I manually sized the _`<svg>`_{blue} to the content box size of the 
marked glyph:

      height = (a    + d)   / em   * fs 
             = (1901 + 483) / 2048 * fs
             
      width = 1200          / 2048 * fs 
              (The glyph is 1200fu wide.)

The _`<text>`s'_{seagreen} _y_ attribute sets distance from container 
(_`<svg>`_{blue}) top to baseline; since the _`<svg>`_{blue} containers are 
the size of content boxes,

      y = a    / em   * fs
        = 1901 / 2048 * fs

I then compared these results to same-styled non-svg glyphs and 
rounded fractional pixels the same way as the browser.
  
`<Svg>`s are ____replaced____ elements like `<imgs>`, meaning their 
bottom is aligned with their container's baseline at default 
{vertical-align: baseline}.  I wrapped each in an inline-block 
_`<span>`_{orchid} and set its vertical-align to _text bottom_ 
so that the following align:

- ____Content____: *`<svg>`'s*{blue} bottom, which is bottom of aqua 
  glyph, since *`<svg>`*{blue} was sized to contain glyph exactly.
  
- ____Container____: *`<span>`'s*{orchid} content bottom, indicated 
  by the lowermost triangle of black marked-x glyph; in glyph's 
  coordinate map in the ttf file, this triangle descends d(escent) 
  fu(font units) below 0 (baseline).

After that, the _`<span>`_{orchid} can be vertically aligned like 
non-replaced text, and it carries the _`<svg>`_{blue} & _glyph_{aqua} 
along for the ride.  The graphic below contains 

- a black glyph for vertical comparison, not wrapped in _`<svg>`_{blue} 
  and _`<text>`_{seagreen} elements, and
- an aqua glyph wrapped as indicated above:

_`<span>`_{orchid} 
   _A_{.Ex03tf}
   _`<svg>`_{blue} 
      _`<text>`_{seagreen} _A_{aqua.Ex03tf} _`</text>`_{seagreen} 
   _`</svg>`_{blue} 
_`</span>`_{orchid} <meta c='pre'>

Output:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 3 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex03' class='exhibit'>
  <span id='Ex03s1'>
    A<svg id='Ex03svg1' width='29'  height='58' >
      <text y='46' >A</text>
     </svg>
  </span>
</div>

_`<Svg>`_{blue} vertical-align:
  <select id='Ctr03sel1' data-opts='baseline,text-bottom'></select>

One limit that I didn't find a way around: the _`<svg>`_{blue} box can't 
be smaller than the glyph without clipping it, the way a non-svg inline 
box can, so I can't use this approach to illustrate line-height &lt; 
content box height (eg. {line-height: 1}).  Not sure if an `<svg>`'s
contents overflow it.  


____Coloring____
  
The yellow & pink _`<span>`s'_{orchid} _`<text>`s_{seagreen} are 
styled {fill: url(#pattern1/2)}, 
1 for yellow, 2 for pink.  The _url()_ syntax allows me to define 
`<pattern>` elements in a separate `<svg>` block, inside a 
`<def>`(inition) element, then invoke them by id to arbitrarily fill other 
elements.  This separate block, whose contents are explained below,
is structured as follows (closing tags ommitted):

`<svg>`
   `<def>`
      `<pattern>` _for yellow `<span>`_{grey}
         `<rect>`  _- filled aqua_{grey}
         `<rect>`  _- filled with_{grey} 
         `<rect>`    _the 4`<lG>`s below)_{grey}
         `<rect>`
         `<rect>`
      `<linearGradient><stop><stop>` _left_{grey}
      `<linearGradient><stop><stop>` _right_{grey}
      `<linearGradient><stop><stop>` _top_{grey}
      `<linearGradient><stop><stop>` _bottom_{grey}
      _Then another`<pattern>`
      for pink `<span>`..._{grey} <meta c='pre'>

I set each pattern's _patternContentUnits_ attribute to _objectBoundingBox_.
I'm still muddled about svg coordinates, but this let me set the 
patterns' widths & heights to 1 irrespective of the filled `<text>`s' 
actual dimensions.
  
Each `<pattern>` contains 5 `<rect>`s.  One is {fill: aqua}.  The other 4 
use the above _url()_ syntax to fill themselves with 
`<linearGradient>` elements defined in the same `<def>` block.

Each `<linearGradient>` contains 2 `<stop>`s in the following configuration:

      <stop offset='50%'/> <stop stop-opacity='0'/>
      
The 1st `<stop>`'s _offset_ determines how far the default black 
fill color will extent.  The 2nd `<stop>` neutralizes the black fill
at that point by making it transparent.  The code that adjusts the 
1st `<stop>`'s offset makes the following assignment...

      stopElement.offset.baseVal = N

... because .offset isn't a straight number but an object 
('svgAnimatedValue' or something) whose .baseVal property I have 
to set.
  
Each `<linearGradient>` has _x1_, _y1_, _x2_, & _y2_ attributes.
A vector from (x1, y1) to (x2, y2) in standard Cartesian coordinates 
indicates the fill direction: the default is (0,0) -> (1,0), which 
is a vector pointing rightward, meaning _fill from left_.

<div class='mdCaptureEnd'></div>

The marked-x glyphs above indicate the following values:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 4 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex04'>
  <p id='Ex04p'>A</p>
  <div id='Ex04mrks'>
    <p id='Ex04mrk01'>1</p><p id='Ex04mrk02'>2</p>
    <p id='Ex04mrk03'>3</p><p id='Ex04mrk04'>4</p>
    <p id='Ex04mrk05'>5</p><p id='Ex04mrk06'>6</p>
    <p id='Ex04mrk07'>7</p><p id='Ex04mrk08'>8</p>
    <p id='Ex04mrk09'>9</p><p id='Ex04mrk10'>10</p>
  </div>
</div>

   | <meta i='Ex04tbl'>
---|--------------------------
1  | em top
2  | 1/2 em height
3  | em bottom
4  | content top
5  | content bottom
6  | ex height
7  | 1/2 ex height
8  | baseline
9  | superscript height
10 | subscript height


Super- and subscript heights in Chromium:

h_super_ | = baseline + em / 3 <meta c='formulaMain'>
---------|------------------
h_sub_   | = baseline - em / 5



