### Inline formatting 2.2: line-height inheritance

The last section illustrated that the following line-height values

- {font-size: 40px; line-height: _1.5_{.parallel}}
- {font-size: 40px; line-height: _1.5em_{.parallel}}
- {font-size: 40px; line-height: _150%_{.parallel}}

result in an inline box height of _60px_{.parallel2}.  These line-height values
have the same effect on the element to which they're applied but are 
inherited differently by the element's children.  If parent's line-height is

- unitless scalar, child inherits that scalar and computes its own line-height;
  if child's font-size is changed, line-height will change to match;
  
- % / em (or I think ex / ch), child inherits parent's computed line-height;
  if child's font-size is changed, line-height won't (automatically) change.
  
Below: p {font-size: 10px} containing span {fs: 3em} (30px):


<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 1 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex01' class='exhibit'>
  <p id='Ex01p1'><span id='Ex01p1s1'>XXXX XXXX XXXX XXXX</span></p>
</div>

<div id='Ctr01' class='controls'>
  <p id='Ctr01p1'>
    <span id='Ctr01p1s1'>&lt;p> line-height:</span>
    <select id='Ctr01sel1' data-opts='1,*1em,100%'></select>
  </p>
  <p id='Ctr01P2'>
    <span id='Ctr01P2s1'>&lt;span> display:</span>
    <select id='Ctr01sel2' data-opts='inline,inline-block'></select>
  </p>
</div>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: DISPLAY -----------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Note01' class='discloseC mdCaptureStart'></div>

**Note about display**

The overlapping behavior, when line-height = 1em / 100%, results from the same
process of inline box interaction discussed elsewhere on this page, with the added
wrinkle of a multi-line inline box.  In this case, setting the `<span>` to
{display: inline-block} - the trick I'm using elsewhere to visualize inline boxes -
alters the layout.  In the visualizations below, I've kept many parameters the same,
but then I've hacked the pieces together to represent where I think the invisible
boxes are.  In the inline case, each line of the inline box flows into a separate
line box (light & medium blue below).  Within each line box, the inline box is 
baseline-aligned with that line box's strut (yellow):

<!-------------------------------------------------------------------
------------- EXAMPLE 2 ---------------------------------------------
-------------------------------------------------------------------->
<div class='exhibit'>
  <p id='Ex02p1'>
    <span id='Ex02p1s1'>x</span> <span id='Ex02p1s2'>XXXX XXXX</span>
  </p>
  <p id='Ex02p2'>
    <span id='Ex02p2s1'>x</span> <span id='Ex02p2s2'>XXXX XXXX</span>
  </p>
</div>

In the inline-block case, the `<span>` contains / generates a 'block-formatting context',
with two mini line boxes (pink & transparent red); together these form a single
inline box in the `<p>`'s formatting context, contained in a single (light blue)
line box, with a single (yellow) strut with which the inline box is baseline-
aligned:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 3 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='exhibit'>
  <p id='Ex03p1'>
    <span id='Ex03p1s1'>x</span> <span id='Ex03p1s2'>XXXX XXXX</span>
  </p>
  <p id='Ex03p2'>
    <span id='Ex03p2s1'>x</span> <span id='Ex03p2s2'>XXXX XXXX</span>
  </p>
</div>

In the non-overlapping case, with p {line-height: 1} and thus span {line-height: 1},
the layouts with span {display: inline} & inline-block} are the same, but the
internal configuration is different:

In the inline case, the `<p>` has 2 line boxes (illustrated below): 

- one for `<span>` '1' & the 'X' inline box of the center `<span>`
- one for the 'Y' inline box of the center `<span>` & `<span>` '2'. 

In this case, the green background fills the content boxes, not the inline boxes, 
of the center `<span>`; hence its overflow beyond the blue line boxes of the `<p>`.

In the :inline-block case, the `<p>` has only one line box, containing 

- `<span>` 1
- the block box of the center `<span>`, which contains 2 line boxes, one for the
  X inline box, one for the Y inline box
- `<span>` 2. 

In this case, the pink background covers the center `<span>`'s block box, which
determines the height of the `<p>`'s line box, so there's no vertical overflow.

Note that this example is not a hack like the ones above, except in one detail: I 
contrained the width of the center `<span>` so that it, `<span>` 1, & `<span>` 2 fit
on one line when it's displayed inline-block; otherwise it tries to occupy the
full width of the `<p>` and pushes `<span>` 1, itself, and `<span>` 2 onto 3 separate
lines.

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 4 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex04' class='exhibit'>
  <p id='Ex04p1'>
    <span id='Ex04p1s1'>1</span>
    <span id='Ex04p1s2'>XXXX XXXX YYYY YYYY</span>
    <span id='Ex04p1s3'>2</span>
  </p>
</div>

<div id='Ctr04' class='controls'>
  <select id='Ctr04sel1' data-opts='inline,inline-block'></select>
</div>

<div class='mdCaptureEnd'></div>


The above behavior of em / % values is the norm for inherited relative
values: the child inherits the calculated value, not the multiplier.
Below, 3 nested `<span>`s: 

- grandparent {font-size: 1.25em}
- parent,child {font-size: inherit}. 

Parent's & child's font-size don't compound:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 5 --------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<p id='Ex05' class='exhibit'>
  <span id='Ex05s1'>x <span>x <span>x</span></span></span>
</p>

They _will_ compound if each element is styled explicitly; this can be an
unintended consequence of styling by tag-name, span{fs:1.25em}:

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 6 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<p id='Ex06' class='exhibit'>
  <span id='Ex06s1'>
    x <span id='Ex06s2'>
        x <span id='Ex06s3'>
            x
          </span>
      </span>
  </span>
</p>

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- NOTE: DISPLAY -----------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div class='discloseC mdCaptureStart'></div>

**Note about display**

The previous example's inner-configuration is straightforward: with all spans' 
line-heights defaulting to normal, the 3rd inline box dominates and sets the 
top & bottom of the line box (<label>show</label> <input type='checkbox' id='Ex06chk1'>).

Below is a variation in which {display: inline vs inline-block} changes the 
layout, due to elements nested inside the inline box.  Line-heights are 
constrained to 1em; innermost span is {vertical-align: bottom}.

When all spans are inline-block:

- 1st span's inline box not shown explicitly 
  (<label>show</label> <input type='checkbox' id='Ctr07chk1'>). It's the height 
  of the pink & brown boxes.  The actual yellow _line_ box shown goes from the 
  bottom of 1st span's inline box to top of 2nd span's pink inline box.
  
- 2nd span's pink inline box is elevated because this span has greater font-size 
  while being baseline-aligned with 1st span.
  
- _3rd `<span>`'s_{.Ctr07s1} inline box bottom-aligned with 
  _2nd `<span>`_{.Ctr07s2}, since it's inline-block and creates its own block 
  formatting context.

When 2nd span is <label>inline</label> <input id='Ctr07chk2' type='checkbox'>:

- Green background now fills _content_ box of 2nd span;
  inline box no longer shown explicitly 
  (<label>show</label> <input type='checkbox' id='Ctr07chk3'>).
  
- 2nd span no longer creates a block formatting context; _3rd `<span>`_{.Ctr07s1}, even 
  though nested in 2nd, now ignores 2nd inline box's bottom and 
  bottom-aligns itself with _1st `<span>`_{.Ctr07s3} 
  (<label>cut away</label> <input id='Ctr07chk4' type='checkbox'>) - 
  or if that were inline, with  the containing `<p>`:  

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 7 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<div id='Ex07d1' class='exhibit'>
  <p id='Ex07p1'>
    <span id='Ex07p1s1'>
      x
      <span id='Ex07p1s2'>
        x
        <span id='Ex07p1s3'>x</span>
        x<!--
   --></span><!--
   --><span id='Ex07p1s4'>x</span>x
    </span><!--
 --><span id='Ex07p1s5'>x</span>
  </p>
</div>  

<div class='mdCaptureEnd'></div>

Conversely, styling each element explicitly is a solution to the 
above line-height problem.  Below, 

- p {font-size: 10px; line-height: 1em}
- span {font-size: 3em; ____line-height: 1em____}: 

<!-------------------------------------------------------------------
---------------------------------------------------------------------
------------- EXAMPLE 8 ---------------------------------------------
---------------------------------------------------------------------
-------------------------------------------------------------------->
<p id='Ex08p1' class='exhibit'>
  <span id='Ex08p1s1'>XXXX XXXX XXXX XXXX</span>
</p>

These converse problems with inherited em / %... 

- line-height not specified per element: child _stuck with_ parent's value
- font-size specified per element: child _fails to keep_ parent's value 

...reflect the fact that the base of a line-height multiplier is _own_{red}
font-size; multiplier doesn't compound:

- parent lh = m * parent fs
- child  lh = m * child  fs <meta c='preList'>

The base of a font-size multiplier is _parent's_{red} font-size; multiplier
compounds:

- parent fs = m * grandparent fs
- child  fs = m _* m_{red} * grandparent fs <meta c='preList'>  





