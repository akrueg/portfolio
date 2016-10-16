### Inline formatting 2.1: line-height

The height of each inline box is determined by its line-height and possibly its 
font-size, depending on the value used for line-height, which can be:

- keyword 'normal', which it inherits by default: inline box height is based on 
  font metrics (see below)
  
- an absolute value: 40px / 40pt, which overrides / ignores font-size

- a unitless scalar multiple of font-size: {font-size: 40px; line-height:
  _1.5_{.parallel}} => inline box height = _60px_{.parallel2}
  
- a font-unit multiple of font-size: {fs: 40px; lh:  _1.5em_{.parallel}} =>
  _60px_{.parallel2}  (font-units ex and ch vary by font, as described below)
  
- a percentage of font-size: {fs: 40px; lh: _150%_{.parallel}} => _60px_{.parallel2}.


<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: PX & PT -----------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart minorNote'></div>

Definition of px

Physical pixels: Making the best hand measurement I can perform, holding 
a flexible, transparent ruler up to screen: 10" on my screen is 865px => 
86.5 ppi.  Vertical measurement conforms to horizontal => square pixels.  
Screen resolution is at max = 1280x1024, which suggests a screen 14.80" x 
11.84", diagonal 18.95".  I don't have the specs for this (2nd-hand) 
monitor, but it shows up in the hardware list as 'Dell 19-inch,' which 
tallies.

According to [the spec] (https://drafts.csswg.org/css-values-3/#absolute-lengths),
css anchors the definitions of all units to the 'logical pixel', which 
assumes 96ppi: 1" = 96px.  (I think that applies to display devices, 
while printers have a separate logic.)  Confirmation: the (real-world) 
definition of 1pt is 1/72"; a square of side 72pt is exactly 96px on my 
screen:

<div id='dInch1'> 1in</div>
<div id='dInch2'>72pt</div>
<div id='dInch3'>96px</div>

Confirmation in the other direction: I measure the 1in square as 28mm; 
the physical size on my screen of 1 logical inch predicted by my 'best 
measurement' above is

1 logical in  
* 96 log px / log in  
* 1 device px / log px  
* 1 real in / 86.5 dev px  
* 25.4 mm / real in  
= 28.2mm

I'm grateful to [this blog post] (https://omnicognate.wordpress.com/2013/01/07/in-css-px-is-not-an-angular-measurement-and-it-is-not-non-linear)
for debunking some very misleading assertions.  According to it, a 
'reference pixel' is defined by the spec as a pixel in a 96ppi screen.  
In a device other than a screen (the post cites 'futuristic eyewear' & 
'a massive display wall'), a reference pixel is a square that subtends 
the same visual angle as a 96ppi screen seen at a nominal arm's length 
of 28" - an image 100x100 reference px would appear the same size (occupy 
the same proportion of / angle in my field of vision) on each device.

According to [MDN] (https://developer.mozilla.org/en-US/docs/Web/CSS/@media/-webkit-device-pixel-ratio),
the browser queries the device's pixel density and sets a logical pixel 
equal to the nonzero integer number of device pixels that creates an area 
as close as possible to the reference pixel.  On my screen, that's 1 
device pixel: 1 is the integer closest to 86.5/96.  A high-density screen 
might be 2 or 3 dexive pixels / logical pixel.

I believe this is also what's happening when I use Chromium or linux to 
zoom in: the number of device pixels per logical pixel is increased.  [This post] 
(https://mindtheshift.wordpress.com/2015/04/02/r-i-p-rem-viva-css-reference-pixel)
does a great job differentiating (a) browser text-zooming via changing 
root font-size from (b) browser zooming via changing logical pixel size.

<div class='mdCaptureEnd'></div>

Below, the inline boxes are affected by 

- font metrics / font family
- font-size
- line-height.

Line box is affected by 

- strut (span 1)
- inline box heights
- inline box vertical-align values (discussed later); span 2 is initially 
  {vertical-align: 10px}: 

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 1 ----------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<p id='Ex01' class='exhibit'>
  <span id='Ex01s1'>1</span>
  <span id='Ex01s2'>2</span>
</p>

`<p>`          |<meta i='Ctr01' c='controls'>
---------------|-------------------------------
font-family:   |<input  id='Ctr01txt1' value='DejaVu Sans'>
font-size:     |<input  id='Ctr01txt2' value='50px'>
line-height:   |<input  id='Ctr01txt3'>                    
`<span>`       |
font-family:   |<input  id='Ctr01txt4'>
font-size:     |<input  id='Ctr01txt5'>
line-height:   |<input  id='Ctr01txt6'>
vertical-align:|<select id='Ctr01sel1'></select>
               |<input  id='Ctr01txt7' value='10px'>










