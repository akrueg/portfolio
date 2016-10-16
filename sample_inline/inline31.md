### Inline formatting 3.1: font metrics

The key metrics the browser uses (at least Chromium running in Linux) to 
display a font are em size (abbreviated hereafter em), ascent (a), 
descent (d), & line gap (g).

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: DATA FORMAT -------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Data formats**

A ttf file (I think other formats are similar) contains several versions 
of these metrics: 

- **Win a/d** (wa/d): used in windows?
- **typo**(graphic) **a/d/g** (ta/d/g): used by my setup if 'really use typo 
  metrics' flag is set
- **hhead a/d/g** (ha/d/g): used by my setup if 'really use typo' 
  flag is unset. 

I believe these are contained in the ttf's 'os/2 table' and 'hhead table'.

I used FontForge to inspect ttf files.  The metrics above are shown in 
the 'Font information' dialog's 'General' & 'OS/2' tabs. The general tab 
also includes values labeled 'ascent' / 'descent' (fa/d - FontForge a/d) 
that are only FontForge-specific calculation aids and are _not_ read from 
/ written to the ttf.  FontForge allows w/t/h a/d to be specified as 
'offsets', defined

- ta =  fa + ta\_offset
- td = -fd + td\_offset
- wa =  ub + wa\_offset
- wd = -lb + wd\_offset
- ha =  ub + ha\_offset
- hd =  lb + hd\_offset <meta c='preList'>

where u/lb = most extreme upper / lower bounds of glyphs.  These 'offset'
values are saved in FontForge's native .sfd project-file format 
but not exported to the ttf file.  When importing from ttf, FontForge

- initially presents all values as non-offsets
- if ta - td = em, sets fa = ta, fd = -td
- else sets fa = 4/5 em, fd = 1/5 em.

Sign of descent: as seen in the chart below,

- fd & wd are positive numbers: a glyph that extends 10 units below 
  the baseline has a descent of 10
  
- td & hd are negative numbers, which matches the coordinates used
  in the glyph tables: the y value of a point 100 font units 
  (described below) below the baseline is -100.

The negative convention keeps leading me to make careless errors.
In the following discussion, when I refer to plain 'descent' / 
'd' without qualifying the data format (Win / typo / hhead / 
FontForge), it will be positive.

The raw values read by FontForge from the font files that came 
with my Linux installation (Ubuntu 14):

          | FreeSerif | DejaVu Sans
----------|-----------|------------          
em        | 1000      | 2048
wa/d      | 900/300   | 1901/483
use typo? | N         | N
ta/d      | 800/-200  | 1556/-492
tg        | 100       | 410
ha/d      | 900/-200  | 1901/-483
hg        | 100       | 0 <meta i='tblRaw'>

According to the rules above, this gives the following:

<div class='mdCaptureEnd'></div>

Metrics used by Chromium on my system for the primary serif
& sans-serif fonts used in this discussion:

   | FreeSerif | DejaVu Sans
---|-----------|------------
em | 1000      | 2048
a  | 900       | 1901
d  | 200       | 483
g  | 100       | 0 <meta i='tblMetrics'>


**Em size**

Ascent, descent, line gap, & the coordinates of the glyph tables are 
measured in ____font units____.  Em size defines fu per line of text: 
looking at the chart above, glyphs in Free Serif are composed of 1000 
tiny rows and a corresponding number of columns (most glyphs are taller 
than they are wide); in DejaVu Sans, each glyph is composed of 2048 
even-tinier rows.  More precisely, the space allotted for each glyph 
is that many rows, with the glyph actually occupying most but not all 
of the available space, as in the following examples.

Font-size then maps that abstract space onto real display 
units: in, cm, pt, etc., which the browser resolves into px (possibly
resolving some meta-values like '2em' along the way).  In FreeSerif 
at {font-size: 1000px}, each of the 1000 rows in the
glyph table is mapped to its own row of pixels on the screen (or more
for a high pixel-density screen); at normal font-sizes, 1 fu represents 
a tiny fraction of 1px.  The following formula gives the rendered height 
or width of a glyph:

h_px_ = h_fu_ / em [(fu/line)] * fs [(px/line)] <meta c='formulaMain'>

h_px_: height (or width) in px on screen  
h_fu_: height in fu in glyph table <meta c='formula'>

Examples at {font-size: 50px}, using em sizes listed in chart above,
inspecting glyph fu sizes with FontForge, and measuring
used values with the green bars below:

h_px_             | = h_fu_ | / em   | * fs <meta i='tblPO1' c='formulaTable tblPO'>
------------------|---------|--------|-----
FreeSerif **p**   | = 677   | / 1000 | * 50
                  | = **33.85px** (used: 35px)
FreeSerif **o**   | = 470   | / 1000 | * 50
                  | = **23.5px** (used: 25px)
DejaVu Sans **p** | = 1573  | / 2048 | * 50
                  | &asymp; **38.40px** (used: 38px)
DejaVu Sans **o** | = 1176  | / 2048 | * 50
                  | &asymp; **28.71px** (used: 29px)

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 1 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex01' class='exhibit'>
  <p id='Ex01p1'>po<span id='Ex01s1'>po</span><span id='Ex01s2'>po</span></p>
  <!-- Vertical bars: -->
  <div id='Ex01marker1'></div>
  <div id='Ex01marker2'></div>
  <div id='Ex01marker3'></div>
  <div id='Ex01marker4'></div>
  <div id='Ex01marker5'></div>
  <div id='Ex01marker6'></div>
</div>    

The used values for DejaVu Sans are within a 1px rounding margin; for 
FreeSerif, they're within 2px, which makes sense: unless font-size \*
line-height is an integer multiple of em size, there's rounding and
blending at the top and bottom (and sides) of each glyph - when 
zooming the screen very close, note partially-shaded pixels at edges of 
glyphs.  Double-checking at higher resolution, FreeSerif at 
{font-size: 100px}:

      |         |        | <meta i='tblPO2' c='formulaTable'>
------|---------|--------|-----
**p** | = 677   | / 1000 | * 100
                | = **67.7px** (used: 68px)
**o** | = 470   | / 1000 | * 100
                | = **47px** (used: 47px)










