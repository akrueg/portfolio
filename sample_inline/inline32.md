### Inline formatting 3.2: baseline

The spec leaves content box height up to the browser.  Below is Chromium's
formula, followed by its application to FreeSerif & DejaVu Sans, using
font metric values presented in last section:

 h_content box_ | = ( a [fu] | + d [fu] | ) / em [fu/ln] | * fs [px/ln] <meta c='formulaTable'>
----------------|------------|----------|----------------|-------------
FreeSerif       | = ( 900    | + 200    | ) / 1000       | * 100
                | = **110.00px** (used: 110px)
DejaVu sans     | = ( 1901   | + 483    | ) / 2048       | * 100        
                | &asymp; **116.41px** (used: 117px)

Measurement of the used values:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 1 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex01' class='exhibit'>
  <p id='Ex01p1'>
    <span id='Ex01s1'>f</span>
    <span id='Ex01s2'>d</span><!--
 --><span id='Ex01inlineBox'> inline box</span>
  </p>
  <div id='Ex01marker1'></div>
  <div id='Ex01marker2'></div>
  <div id='Ex01marker3'></div>
  <div id='Ex01marker4'></div>
  <p id='Ex01notInlineBox'><span>not inline box</span></p>
</div>

The proportion of ascent & descent to em sets the height of glyphs on the 
line.  If line height exactly = content box height, _space above & below 
baseline is proportional to a & d._{green}

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: BASELINE ----------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart minorNote'></div>

Definition of baseline

I'd never thought about this before: the shape of every English / Latin letter 
except j indicates a vertical baseline position.  They don't have 
horizontal baselines: when written vertically, letters are centered by 
width, irrespective of internal shape.  I believe CJK characters have 
no internal baselines and are 

- horizontally centered when written vertically, like english letters
- bottom-aligned when written horizontally, like English CAPITALS -
  or, like English capitals, they all have the same height and are just
  _vertically aligned_ with each other.
  
For inline layout calculations, the baseline corresponds to the vertical 
0-point in each glyph's coordinate map.

<div class='mdCaptureEnd'></div>

At a given font-size, space...

               |     |     | <meta i='tblBase1'>
---------------|-----|-----|-----
above baseline | = a | /em | \*fs 
below          | = d | /em | \*fs

For the DejaVu Sans glyph above
(<label>show</label> <input type='checkbox' id='Ctr01chk1'>),

               |        |       | <meta i='tblBase2' c='formulaTable'>
---------------|--------|-------|-----
above baseline | = 1901 | /2048 | \*100 
               | &asymp; **92.82px** (used: 93px)
below          | = 483  | /2048 | \*100
               | &asymp; **23.58px** (used: 24px)

The relationship stated in green above doesn't hold at other line 
heights.  If it did, given that the graphic above is {line-height: 10px} 
_(which isn't apparent, because the containing `<p>` has no 
background; the green boxes are the content boxes of `<spans>` 
contained in the `<p>`, so their sizes reflect none of the `<p>`'s
properties except its {font-size})_{grey~},
<label>this</label> <input type='checkbox' id='Ctr01chkNotIB'> 
would be the result (see graphic above), with the 'inline box's baseline' (ie. a vertical
position d/em above its bottom) aligned with the glyphs' baseline.
(This box is just an absolutely positioned sibling.)

The inline box actually revealed by filling the containing `<p>`'s background
(<label>make it so</label> <input type='checkbox' id='Ctr01chkIB'>)
is completely above the glyphs' baseline.  It looks strange with
{font-size: 100px; line-height: 10px}, but the logic makes sense 
at normal settings: the glyphs should appear vertically centered 
in the line; when there's extra vertical space, half of it 'goes 
above' the glyphs, half below.  More precisely,
([Spec 10.8.1] (https://www.w3.org/TR/CSS2/visudet.html#leading)):

- the vertical position of the inline box's top edge is determined
  by context (parent's top, other content on the line, {vertical-align}).
  
- ____Leading____ (L) = line height - content height.

- Position each glyph so the top edge of its content box is L/2 below 
  the top edge of the inline box.
  
- In a 'negative leading' / overflow case, where line height &lt; content 
  height (like the graphic above), place content box top edge L/2 _above_ 
  inline box top.
  
As a result, glyphs keep a constant vertical position relative to the 
inline box's midline.  This can be seen in constant distance (green bar 
below) of the glyph's baseline below the inline box's midline.  Below, 
slider sets pink `<span>`'s {line-height} (current value:
<span id='Ex02sLH'>117px</span>):

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 2 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex02container'>     
  <input id='Ctr02rng1' class='controls' type='range' value='117' max='200'>
  <p id='Ex02p1' class='exhibit'>
    <span id='Ex02strut'>x</span><!--
 --><span id='Ex02s1'>d<span id='Ex02marker1'></span></span>
  </p>
</div>

At settings of vertical-align other than baseline (eg. 
<label>top</label> <input id='Ex02chkVA' type='checkbox'>), the glyph's 
position isn't always constant relative to the baseline of the
_line_ box (strut represented above by yellow box).


<div class='discloseC mdCaptureStart'></div>

**Rounding quirk**

The green bar is an absolutely positioned child of the pink span, 
keeping its position via {top: 49.9%}.  If it's set to 
<input type='checkbox' id='Ex02chk1'> {<label>top:50%</label>},
as {line-height} is adjusted it wobbles up and down as it rounds 50% of
even and odd line heights.  These numbers depend on the elements sizes
(at other sizes, 49.9% wobbles while 50% is stable), which makes
sense, since this is an artifact of the browser's 
rounding-at-the-margins algorithm.

<div class='mdCaptureEnd'></div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: TYPOGRAPHIC AESTHETICS --------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Typographic aesthetics**

While stem of DejaVu Sans d glyph rests on baseline, bottom curve dips 
below it. This is not another rounding artifact: curve descends to -29fu 
in glyph's coordinate map.  This is a common design feature, at least in 
FreeSerif & DejaVu Sans.

<div class='mdCaptureEnd'></div>

Formula for the relationship between glyphs / content box and inline 
box:

h_center-to-baseline_ = (a - d) /2 /em \*fs <meta c='formulaMain'>

This is based on the following observation:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 3 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex03' class='exhibit'>
  <p id='Ex03p1'><span id='Ex03s1'>d</span></p>
  <div id='Ex03marker1'></div>
  <div id='Ex03marker2'></div>
  <div id='Ex03marker3'></div>
</div>

<div id='Ex03labels'>
  <p id='Ex03p2'><span class='rSq'></span> = (a + d) / 2&nbsp;</p>
  <p id='Ex03p3'><span class='bSq'></span> = d</p>
  <p id='Ex03p4'><span class='gSq'></span>&nbsp;
    <span>= <span class='rSq'></span> - <span class='bSq'></span><br>
          = (a + d) / 2 - d<br>
          = (a - d) / 2</span>
  </p>
</div>
   
For FreeSerif & DejaVu Sans, this value is very similar (presumably by 
design), respectively .35 \*fs and .346 \*fs; stated differently, in 
FreeSerif, the baseline is located at 18.2% of the height of the content 
box, while in DejaVu Sans it's located at 20.3%.  A large font-size is 
needed to see the difference:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- LARGE FONT-SIZE EXAMPLE -------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Large font-size example**
 
Center-to-baseline at {font-size: 1000px}:

h_c-to-b_   | = ( a    | - d   | )/2 | /em   | \*fs <meta c='formulaTable'>
------------|----------|-------|-----|-------|-------
FreeSerif   | = ( 900  | - 200 | )/2 | /1000 | \*1000
            | = **350px** (used: 350px)
DejaVu Sans | = ( 1901 | - 483 | )/2 | /2048 | \*1000 
            | &asymp; **346.19px** (used: 346px)

The inline boxes below have been filled with vertical linear-gradient 
(rebeccapurple 50%, orange 50%) to make their vertical midpoints
apparent.  The 4px light-blue margin below / above these inline boxes
is the difference in center-to-baseline height for the two fonts.

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 4 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex04' class='exhibit'>
  <p id='Ex04p1'>
    <span id='Ex04s1'>i</span>
    <span id='Ex04s2'>i</span>
  </p>
  <div id='Ex04marker1'></div>
  <div id='Ex04marker2'></div>
</div>

<div class='mdCaptureEnd'></div>


The effect of the a/d ratio can be seen more readily when it's more extreme.
Below are variants of DejaVu Sans created in FontForge with a = 1901 and d
varying (#2 is the value DejaVu Sans really uses). See note in 'large 
example' above about two-tone backgrounds.  Font-size is 128px:

d       | ( a    | - d    | )/2 | /em   | \*fs <meta i='Ex05tbl1' c='formulaTable'>
--------|--------|--------|-----|-------|------
1) 0    | ( 1901 | - 0    | )/2 | /2048 | \*128 
        | &asymp; **59.41px** (used: 59px)
2) 483  | ( 1901 | - 483  | )/2 | /2048 | \*128
        | &asymp; **44.31px** (used: 44px)
3) 1483 | ( 1901 | - 1483 | )/2 | /2048 | \*128 
        | &asymp; **13.06px** (used: 13px)
4) 1901 | ( 1901 | - 1901 | )/2 | /2048 | \*128 
        | =       **0px**;    (used: 0px)

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 5 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex05' class='exhibit'>
  <p id='Ex05p1'>
    <span id='Ex05s1'>A</span><span id='Ex05s2'>A</span>
  </p>
  <p id='Ex05p2'>
    <span id='Ex05s3'>A</span><span id='Ex05s4'>A</span>
  </p>
  <div id='Ex05marker1'></div>
  <div id='Ex05marker2'></div>
  <div id='Ex05marker3'></div>
  <div id='Ex05marker4'></div>
</div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- COUNTERINTUITIVE EXAMPLE ------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Counterintuitive example**

This example really baffled me at first: the light-blue `<p>`
contains a `<span>`. Reducing its font-size (with the slider) makes 
the `<p>`'s line box _larger_.  The `<span>`'s text is set to report 
its current font-size:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 6 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex06container'>
  <input id='Ctr06rng1' class='controls' type='range' value='200' max='200'>
  <p id='Ex06p' class='exhibit'>
    <span id='Ex06strut'>p</span><span id='Ex06s1'>200</span>
  </p>
</div>

<label>Explanation</label> <input id='Ctr06chk1' type='checkbox'> :
this behavior occurs because the containing `<p>` has an 
absolutely-specified {line-height: 200px}, which the `<span>` inherits.  
As the `<span>`'s font-size goes down, its center-to-baseline distance 
goes down per the formula above.  That means its center has to slide 
down, because its baseline is locked to `<p>`'s / strut's baseline. 
As the `<span>` slides down, the blue line box streches to keep it
enclosed.

<div class='mdCaptureEnd'></div>





