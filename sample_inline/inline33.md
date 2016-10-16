### Inline formatting 3.3: em & normal height

The three values of the ascent, descent, & em size metrics 
(a, d, & em) together define the ____em box____, a 1-em-high 
box around glyphs corresponding to a line of text at 
{line-height: 1}.  The marked-x glyph used below is a clone
of the DejaVu Sans x glyph modified as follows:

- Marks 1 & 3 indicate the em box's top & bottom edges.  They were added
  to the glyph table via FontForge, using a calculation explained below.
  
- Mark 2 is midway between 1 & 3, indicating the vertical 
  center of the glyph and the em, inline, & content boxes (and line
  box, if the container has no other content).
  
- Marks 4 & 5 are aligned in the glyph's table to +1901 and -483, DejaVu 
  Sans's a & d values, so the marks indicate the top & bottom edges of the 
  content box.
  
- Other marks explained in next section.

Below, the blue `<p>` is {line-height: 1}, aligning with the 1st glyph's
em-top & em-bottom marks (almost - see note on rounding below).  The
2nd glyph illustrates content-box dimensions for comparison:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 1 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex01' class='exhibit'>
  <p id='Ex01p'>A<span>A</span></p>
  <div id='Ex01markers'>
    <p id='Ex01marker1'>1</p>
    <p id='Ex01marker2'>2</p>
    <p id='Ex01marker3'>3</p>
    <p id='Ex01marker4'>4</p>
    <p id='Ex01marker5'>5</p>
  </div>
</div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: ROUNDING ----------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Rounding**

The `<p>` above has {font-size: 128px}.  Due to rounding, at many font-sizes 
the top & bottom em marks of the test glyph can be 1px misaligned with 
the top & bottom of a height-1 line - even as much as 1px + 1 blended px.
Expanding to 
<label>{font-size: 2048px}</label> <input type='checkbox' id='Ctr01chk1'> 
demonstrates their actual flush alignment.  _(At that height, most of this 
note falls underneath the 1st glyph's bottommost marker, the content-bottom
marker - which overflows because content height = a + d > em, at least in 
FreeSerif & DejaVu Sans.  This makes the previous checkbox unclickable, so 
the `<p>` above is {pointer-events: none}.)_{grey}  It might have made 
sense to observe how glyph-marks of various font-unit sizes get rounded 
when displayed at typical font-sizes, then design the marker-glyph to 
look good / round well at those sizes; I'm sure real fonts take that into 
account.

<div class='mdCaptureEnd'></div>



<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: SIGNIFICANCE OF EM BOX --------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart minorNote'></div>

Significance of em box

Other than corresponding to a height-1 line, I'm not sure the 
em box signifies much:

- It's not the default line height, which is {normal},
  defined below.
  
- It's not the content height a + d.
  
- Glyph tables don't use it as a boundary.  Most glyphs occupy
  less than 1 em of height, while some occupy more.  I didn't
  observe any whose upper or lower edges exactly matched the 
  edges of the em box (exactly filling a height-1 line), which
  is partly why I made the test glyph described below.
  
The em box seems to be referenced much in discussions of this
subject (no citation for that claim), possibly because:

- The em size metric is crucial in determining everything else.
  Without knowing that FreeSerif uses an em of 1000 while DejaVu
  Sans uses 2048, the other metrics would be meaningless.  It's
  the scaling factor between fu and lines (which font-size then 
  converts into physical units).
  
- Historically the em box was more significant: metallic glyphs
  and lines of print really were 1 em high.
  
- There may be some confusion of em box with content, inline, or 
  line boxes or normal line height.
  
Anyway, for the record...

<div class='mdCaptureEnd'></div>

Since the em box is vertically centered with with the content & 
inline boxes, the em box ascent (distance from baseline to top edge; 
region of glyph map above 0 that will fit within a height-1 line)
and em box descent (distance from baseline to bottom edge; region
of glyph map below 0 that will fit within height-1 line) are given by:

a_em_[fu] = (a[fu] - d[fu] + em[fu]) / 2 <meta c='formulaMain'>

d_em_ = (d - a + em) / 2 <meta c='formulaMain'>

These relationships 
(<label>a_em_</label> <input id='Ctr02optA' type='radio' name='Ctr02optAD' checked>
/ <label>d_em_</label> <input id='Ctr02optD' type='radio' name='Ctr02optAD'>)
are illustrated in the graphic below; blue `<p>` is {line-height: 1}: <meta c='formula'>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 2 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex02' class='exhibit'>
  <p id='Ex02p1'>A</p>
  <div id='Ex02markers'>
    <div id='Ex02markersA'>
      <div id='Ex02markerA1'></div>
      <div id='Ex02markerA2'></div>
      <div id='Ex02markerA3'></div>
    </div>
    <div id='Ex02markersD'>
      <div id='Ex02markerD1'></div>
      <div id='Ex02markerD2'></div>
      <div id='Ex02markerD3'></div>
    </div>
  </div>
</div>

<div id='Ex02lbls'>
  <div id='Ex02lblsA'>
    <p id='Ex02lblA1'><span class='bSq'>&nbsp;</span>
                      <span>= top half of em box
                      <br>  = em / 2</span></p>
    <p id='Ex02lblA2'><span class='gSq'>&nbsp;</span>
                      <span>= center-to-baseline
                      <br>  = (a - d) / 2 
                      <span id='Ex02see'>(see previous &sect;)</span></span></p> 
    <p id='Ex02lblA3'><span class='rSq'>&nbsp;</span>
                      <span class='formula'>= a_em_, em box ascent
                      <br>  = <span class='bSq'></span> + <span class='rSq'></span>
                      <br>  = (a - d) / 2 + em / 2 
                      <br>  = (a - d + em) / 2</span></p>
  </div>
  <div id='Ex02lblsD'>
    <p id='Ex02lblD1'><span class='bSq'>&nbsp;</span>
                      <span>= bottom margin
                      <br>  = (a + d - em) / 2</span></p>
    <p id='Ex02lblD2'><span class='gSq'>&nbsp;</span>
                      <span>= d</span></p>
    <p id='Ex02lblD3'><span class='rSq'>&nbsp;</span>
                      <span class='formula'>= d_em_, em box descent
                      <br>  = <span class='gSq'></span> - <span class='bSq'></span>
                      <br>  = d - (a + d - em) / 2
                      <br>  = (d - a + em) / 2
                      <br>  &nbsp;</span></p>
  </div>
</div>


For DejaVu Sans, these value are

      |          |        |        | <meta i='Ex02tbl' c='formula'>
------|----------|--------|--------|------
*a_em_*{.formula} | = ( a    | - d    | + em   | ) / 2
      | = ( 1901 | - 483  | + 2048 | ) / 2
      | = **1733**
d_em_ | = ( d    | - a    | + em   | ) / 2
      | = ( 483  | - 1901 | + 2048 | ) / 2
      | = **315**

In the table of the marked-x glyph, these values were used as 
the upper and lower edges of the em box marker-triangles (labeled
1 & 3 above).  

**{Line-height: normal}**
  
The Spec leaves calculation of normal line height up to the browser,
suggesting a value between 1.1 and 1.2.
Chromium's calculation includes the 3 metrics used above - a, d, & em -
as well as the 4th metric mentioned in the overview of font metrics 
in &sect;3.1, line gap (g).  Normal line height in units of lines
(without multiplying by font-size and converting to display units
/ pixels) is given by:

h_normal_[ln] | = ( a[fu] | + d[fu] | + g[fu] | ) / em[fu/ln] <meta c='formulaTable'>
--------------|-----------|---------|---------|--------------
FreeSerif     | = ( 900   | + 200   | + 100   | ) / 1000
              | = **1.2**
DejaVu Sans   | = ( 1901  | + 483   | + 0     | ) / 2048
              | &asymp; **1.164**

Note that DejaVu Sans has g = 0, so content box height = normal line
height.  `<P>` below is {line-height: normal}; 2nd 'd' is inside
{display: inline} `<span>`, whose background therefore indicates the 
content box and is the same height as the `<p>`'s line box:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 3 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex03' class='exhibit'>
  <p id='Ex03p1'>d<span>d</span></p>
</div>

In Freeserif at {font-size: 100px}, normal line height = 1.2 
\*100 = 120px, with the gap-height distributed equally above & below the 
content box:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 4 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex04' class='exhibit'>
  <p id='Ex04p1'>f<span id='Ex04s1'>f</span></p>
  <div id='Ex04marker1'></div>
  <div id='Ex04marker2'></div>
  <div id='Ex04marker3'></div>
</div>

<div id='Ex04lbls'>
  <p id='Ex04lbl1'><span class='gSq'>&nbsp;</span>
                   <span>= normal line height used
                   <br>  = 120px</span></p>
  <p id='Ex04lbl2'><span class='bSq'>&nbsp;</span>
                   <span>= content box height used
                   <br>  = 110px</span></p>
  <p id='Ex04lbl3'><span class='rSq'>&nbsp;</span>
                   <span>= margin used
                   <br>  = 5px
                   <br>  should = (<span class='gSq'></span> - <span class='bSq'></span>) / 2
                   <br>  = (120 - 110) / 2
                   <br>  = 5px &#10003;</span></p>
</div>  


**Ex height**

The [Spec][] leaves calculation of the ex unit (as in {margin: 1ex})
up to the browser, stipulating that if no ex value can be determined, 
it defaults to 1/2 em.  Chromium uses the height of the x glyph in 
the font table:
[Spec]: https://www.w3.org/TR/css-values/#relative-lengths

1ex[(in px)] | = x glyph's height[(fu)] | / em[(fu/ln)] | * fs[(px/ln)] <meta c='formulaTable'>
-------------|--------------------------|---------------|--------------
DejaVu Sans: | = 1120                   | / 2048        | * fs

`<p>` below has {line-height: 1ex}.  As mentioned above, the vertical 
center of the line is not the vertical center of the x glyph's 
    <label>bounding box</label> <input id='Ctr05chkBounding' type='checkbox'>
but the vertical center of its 
    <label>em box      </label> <input id='Ctr05chkEm'       type='checkbox'>
(or <label>inline      </label> <input id='Ctr05chkInline'   type='checkbox'>
/   <label>content box </label> <input id='Ctr05chkContent'  type='checkbox'>), 
which the left-pointing arrow in the 
marker-glyph indicates:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 5 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex05' class='exhibit'>
  <p id='Ex05p'>x<span id='Ex05s1'>A</span></p>
  <div id='Ex05bounding'></div>
  <div id='Ex05em'      ></div>
</div>

x-height also determines how {vertical-align: middle} is interpreted,
as discussed in next &sect;.

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: SOURCE OF X-HEIGHT ------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart minorNote'></div>

Source of x-height

The OS/2 table (which I inspected with FontForge) contains an 'x 
height' field, but Chromium ignores it.  Also, Font-Squirrel offers 
something called 'x-height matching', but I found that to have no 
effect (didn't investigate it much). Finally, at one point when my 
testfont contained only x and w glyphs, I really think I observed 
Chromium _averaging_ their heights to determine ex-height, 
but I can't reproduce that.  I thought perhaps it might average the 
heights of all lower-case letters without ascenders (all but bdfhijklt).  

<div class='mdCaptureEnd'></div>  


**Ch(aracter) unit**

1ch[(in px)] | = 0 glyph's width[(fu)] | / em[(fu/ln)] | * fs[(px/ln)] <meta c='formulaTable'>
-------------|-------------------------|---------------|--------------
Dejavu sans: | = 1303                  | / 2048        | * fs

The `<p>` below has {width: 1ch}, fitting the 0 but not the i or m:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 6 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<p id='Ex06' class='exhibit'>i<br>0<br>m</p>  


**Family name**

Fontforge allows one to set 

- 'family name'
- 'fontname'
- 'name for humans'.

Chromium uses the family name.















