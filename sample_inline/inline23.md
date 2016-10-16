### Inline formatting 2.3: line-height vs height

Roughly, 

- inline elements are affected by {line-height};
- block / inline-block are affected by {height};
- block / inline-block with text are affected by both.

The 1st example below illustrates the inline and inline-block-with-text
cases, followed by a 2nd example illustrating the textless case.
In the 1st example, 

- font-size of blue container `<p>` is 50px; font-size of green & pink
  `<span>`s is 100px
- green '_il_{seagreen!}' `<span>` is inline; pink '_ib_{orchid!}' `<span>` 
  is inline-block; yellow, crimson, & purple boxes explained below
- sliders & checkboxes set (same) values on green & pink `<spans>` (only).  
  
<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 1 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ctr01' class='controls'>
  <p>Line-height: <span id='Ctr01outLH' ></span> 
     / normal <input type='checkbox' id='Ctr01chkNormal'><br>
     <input id='Ctr01rngLH'>                             <br>
    <span id='Ctr01compLH'>computed:</span>
  </p>
  <p>Height:      <span id='Ctr01outH' ></span>          
     / auto   <input type='checkbox' id='Ctr01chkAuto'  ><br>
     <input id='Ctr01rngH'>                              <br>
     <span id='Ctr01compH' >computed:</span>
  </p>
</div>

<p id='Ex01' class='exhibit'>
   <span id='Ex01s0'>p  </span><!--
--><span id='Ex01s1'>il</span><!--
--><span id='Ex01s2w'><span id='Ex01s2'>il</span></span><!--
--><span id='Ex01s3'>ib</span><!--
--><span id='Ex01s4w'><span id='Ex01s4'>ib</span></span>
</p>

<div id='Discussion01' class='mdCaptureStart'></div>

**Light blue box**: containing `<p>`.

**Yellow**: represents strut of containing `<p>`.

**Green**: 'il' `<span>` is {display: inline}.  Green box is its content box,
with height based only on font-size, disconnected from blue line box's 
height calculation - green box's vertical edges don't correspond to 
/ influence anything else.

**Pink**: 'ib' span is {inline-block}.
The fact that this span contains text is crucial to the analysis of this
example, because that forces it to generate an inline box, which responds
to {line-height}; behavior of inline-block element without text covered in next
example.  Pink box is its block box, which can coincide with its inline box,
if {height} is 'auto'.

**Pink box with {height: auto}**: {line-height} * {font-size} = computed line 
height _(computation at {line-height: normal} covered in 'Font metrics' 
section)_{grey} = inline box height = pink box.  Inline box is vertically centered 
with glyph - <label>display marker-glyph</label> <input id='Ctr01chkMarker' type='checkbox'>
(explained later; left-center marker is its
vertical midpoint).  Therefore, if top of inline box is flush with / is setting
top of blue line box (eg. values 0.3 / auto - 
<input id='Ctr01btn1' type='button' value='set'>), increasing its height by d pushes
glyphs down d/2.
  
**Pink box with absolute height**: height overides line-height as basis of
pink block box's height.  Pink box's position / top edge doesn't change;
bottom edge is raised / lowered.  Example: toggle 'auto' checkbox at
values 2.5 / 50 (<input id='Ctr01btn2' type='button' value='set'>).
Glyphs' position also doesn't change: they're still 
center-aligned with the 'ib' span's inline box, which is now not directly 
visible.
  
**Purple box**: 'ib' `<span>` is wrapped in another inline-block `<span>`, and
this is its block box.
  
**Purple box's strut**: purple box contains 2 things: its strut and the
'ib' `<span>`.  The strut's influence has been minimized by setting this box's
font-size to 0, so the strut is 0-height.  Since the 'ib' `<span>` is
the default {vertical-align: baseline}, the strut's baseline (which 
coincides with its top & bottom, since it's been collapsed to 0 height)
aligns with the 'ib' `<span>`'s glyphs' baseline.  
  
**Purple box's extent**: the purple box, like all blocks, extends from the 
top of its highest content to the bottom of its lowest.  The pink box's
top will always be above the purple box's strut:
  
- Pink box top = top of 'ib' `<span>`'s inline box.
 
- Midpoint of 'ib' `<span>`'s inline box (which is of course lower than
  its top) sets glyphs' vertical midpoint.
    
- Glyphs' baseline (of course lower than midpoint) is aligned with
  purple box's strut's baseline.
    
- Purple box's strut's baseline = its top, since it's 0-height.
  
- So top of 'ib' `<span>` is always above top of purple box's strut.
  
**Purple box's extent at low {height}**: strut is lowest content.  Purple 
box extends from top of pink box to glyphs' baseline.  At  minimum 
values 0 / 0 (<input id='Ctr01btn3' type='button' value='set'>),
pink box has collapsed to 0-height line vertically centered
with glyphs, so purple box extends from glyphs' vertical midpoint to 
their baseline.
  
**Purple box's extent at higher {height}**, such as values 0 / 40
(<input id='Ctr01btn4' type='button' value='set'>): pink box's
bottom now extends below purple box's strut, so pink box sets top and
bottom of purple box, which now extends below glyphs' baseline.  At even 
greater height, such as values 0 / 60
(<input id='Ctr01btn5' type='button' value='set'>), pink box also extends below
yellow strut of blue container, increasing the blue box's line height.

**Crimson box**: this is an inline-block `<span>` wrapping the inline 'il'
`<span>`.  Inline element ignores height property (and other vertical
properties, like margin-top / -bottom); the height reported by
getComputedStyle is always 'auto'.  Therefore crimson box always does
what purple box does at {height: auto}: it encloses it's inner `<span>`'s 
inline box; therefore crimson box's height depends on {line-height}.

To verify that the wrapping crimson & purple `<span>`s don't alter their
content's behavior, <label>show unwrapped versions</label>
<input id='Ctr01chkUnwrapped' type='checkbox'> and adjust settings.
  
**Summary**

- {Height}'s effect on inline element: none.

- {Line-height}'s effect on inline element: doesn't change its
  visible height but change its invisible inline box's height.
  This has the potential to change the size of the containing
  line box and the inline element's vertical alignment within
  that line box.
  
- {Line-height}'s effect on inline-block element that contains text
  (textless example covered below): same as effect on inline,
  except at {height: auto} inline-block element adopts inline box
  height as its auto height (assuming no other content).
  
- {Height}'s effect on inline-block: sets its height, overriding
  inline box height.  Specified height > inline box height may
  also affect the containing line box.

<div class='mdCaptureEnd'></div>


**Textless contexts**

An element with no text doesn't generate an inline box or respond to
line-height.  This category includes 

- ____replaced____ elements, 'content is outside the scope of the CSS formatting 
  model' (spec 3.1), eg. `<img>` & `<iframe>`, whether inline / -block /
  block
- non-replaced elements (ie. anything else) without text
- I think: elements all of whose text is in sub-elements (which generate
  the inline boxes and respond to line-height.
  
Below, from left to right: 

- inline `<span>` for comparison with last example
- inline-block `<span>` with text; similar to last example, but with
  background matching `<img>` at right, instead of pink box above
- inline-block `<span>` without text
- `<img>` (a replaced element)  

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 2 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<section>
  <div id='Ex02row1'><p id='Ex02row1c1'>&lt;span>s</p><p id='Ex02row1c2'>&lt;img></p></div>
  <div id='Ex02row4'><p id='Ex02row4c1'>inl</p><p id='Ex02row4c2'>in-blk</p></div>
  <div id='Ex02row2'><p id='Ex02row2c1'>affected by<br>line-height</p></div>
  <div id='Ex02row3'><p id='Ex02row3c1'>affected by height</p></div>
  <div id='Ex02' class='exhibit'>
    <div id='Ex02container'>   
      <p><span id='Ex02s1'>il</span>                 </p><!--
   --><p><span id='Ex02s2'   class='beaver'>ib</span></p><!--
   --><p><span id='Ex02s3'   class='beaver'></span>  </p><!--
   --><p><img  id='Ex02img1' class='beaver'>         </p> 
    </div>
  </div>
</section>

<div id='Ctr02' class='controls'>
  <span>lh:</span> <input id='Ctr02rngLH'><br>
  <span>h: </span> <input id='Ctr02rngH' > / 
  <input type='checkbox' id='Ctr02chk1'> <label>auto</label>
</div>


Note above:

1\. The 2 textless elements are _bottom_-aligned with their `<p>`s' struts' 
_baselines_ - they can't be baseline-aligned, because they
have no baselines, because they have no text.  The struts' descents 
extend below the baseline and create the blue strips below the
images.  At {line-height: 1}, these blue strips are the same depth as the green space 
below the text 'il' in the 1st column, because it has the same size strut,
because it and the textless elements' `<p>` wrappers are all 25px Free Serif.

2\. The textless elements are also bottom-aligned with the baseline of the
text 'il' & 'ib', since all 4 `<p>`s are inside a single `<div>`,
the light blue block.  The only way {line-height} affects these items is 
indirectly:
  
- by pushing down the blue `<div>`'s baseline
- which is in turn done indirectly, by pushing down the 
  baselines of the 1st & 2nd `<span>`s (the ones with text)
- which drags down everything aligned with the blue container's
  baseline, including the bottoms of the textless `<span>` &
  the `<img>`.
  
_(Vertical-align of all elements has been left to default to 
baseline; other values discussed in &sect;4.)_{grey}
  
<div class='discloseC mdCaptureStart'></div>
 
**Data uri images**

All the beaver background images in these pages are being applied via
the following css rule:

.beaver{background: url(
  'data: image/jpeg;
         base64,<span>base64string</span>'
  )} <meta i='Ex03p' c='pre'>

(_Url()_ can't actually contain \n or \s.)  The data uri can be 
embedded directly in html:

        <img src='data:...'>

The drawback of that is repeating the string.  I haven't found that
one `<img>` can use _url()_ syntax to reference another...

        <img id='img1' src='data:...'>
        <img src=url(#img1)>

...the way svg elements can reference each other (see note on 
color-mapping in &sect;4).  Nor have I found that the _src_ 
attribute can be set via css.

All the beaver-background images used in these pages are also `<span>`s
except for the one at right in the graphic above.  `<Img>`s would be more
straightforward, but Chromium slaps a 1px grey place-holder border 
(<label>emphasize</label> <input type='checkbox' id='Ex03chk'>)
around the client area of `<img>`s with no _src_, which is in
addition to any 
<label>normal element border</label> <input id='Ex03chk2' type='checkbox'>
and can't be disabled afaik:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 3 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<p id='Ex03p2'><img id='Ex03img' class='beaver'></p>

Regarding the use of ur<span id='Ex03s'>i</span> vs url, I've seen
the following logic:

- 'Url' stands for 'uniform resource ____locator____' and implies an 
   address, and uris clearly aren't addresses.

- 'Uri' stands for 'uniform resource ____identifier____'.

That's not completely helpful, because

- Uris don't assign an id / label to the resource.

- Their syntax (cf. examples above) includes the keyword 'url'.

<div class='mdCaptureEnd'></div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: VERTICAL GAP BETWEEN IMAGES ---------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->

<div class='discloseC mdCaptureStart'></div>

**Vertical gap between images**

The alignment behavior above explains the gap that can appear
between rows of images:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 4 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex04' class='exhibit'>
  <span class='beaver'></span>
  <span id='Ex04s'></span>
  <span class='beaver'></span>
  <br>
  <span class='beaver'></span>
  <span class='beaver'></span>
</div>

The images align their bottoms with their line boxes' struts' 
baselines, as can be seen by adding text <input id='Ctr04txt1'>, 
particularly characters with descenders, which is what the space below
baseline is for.  Possible remedies:

- <input type='checkbox' id='Ctr04chk1'>
  Make the elements {vertical-align: bottom}: most straightforward solution.

- Make the elements {display: block}: radically changes the layout.

- <input type='checkbox' id='Ctr04chk2'>
  Make the container {line-height: 0}: compresses the strut's midline, 
  baseline, & bottom into a single 0-height line, past which any 
  characters' descenders will extend, potentially getting masked by the
  line below.
  
The horizontal gap is due to the tags' brackets (`</span><span>`) not 
touching (`</span>\s<span>`).

<div class='mdCaptureEnd'></div>








