_[&lt; Home.](https://akrueg.github.io/portfolio)_{#spanHome}
Colored bar registers <span id='sp1234'><span id='sp1'>tou</span><span id='sp2'>ch</span> / 
  <span id='sp3'>mou</span><span id='sp4'>se</span> events</span> & 
  <span id='sp5'>gestures</span>; see notes below.

<section id='outputFrame'>
  <div id='dTouch'></div>
  <div id='dTextLog'>no events fired</div>

<br><b>Options</b><br><br>

<!-- Text log?  Font size? -->
<input type='checkbox' id='chkTextLog' checked>
  <label for='chkTextLog'>Text log</label>:
  0 <input id='sliFS' type='range' min='0' value='1' step='.01' max='2'> 2em<br><br>
<!-- pageX/Y / all coordinates? -->
Display <input type='radio' id='optCoords1' name='coords' checked>
  <label for='optCoords1'>pageX/Y</label>
<input type='radio' id='optCoords3' name='coords'>
  <label for='optCoords3'>all</label> coordinates.<br><br>
<!-- Show gestures? -->
<input type='checkbox' id='chkGestures' checked>
  <label for='chkGestures'>Show</label> gestures via back color.<br><br>
<!-- Filter motion? -->
<input type='checkbox' id='chkFilter'>
  <label for='chkFilter'>Filter</label> motion.

</section>  


**Notes**

<div class='discloseC mdCaptureStart'></div>

**Event sequences**

____Without synthetic mouse events____:

<div class='discloseC mdCaptureStart1'></div>

**Move / drag** 

- **touchstart**
- **touchmove**s
- **touchend**

<div class='discloseC mdCaptureStart1'></div>

**Long tap** 

- **touchstart**
- **touchcancel**

<div class='mdCaptureEnd1'></div>

____With synthetic mouse events____, which have same timeStamp 
and screen- / client- / pageX/Y as last touch event (touchend):

<div class='discloseC mdCaptureStart1'></div>

**Tap** 

- nonsynthetic events:
  - **touchstart**
  - **touchend**
- focus sequence [if needed](https://codepen.io/akrueg/pen/yaZygY):
  - **mouseout**
  - **mouseleave**
  - **mouseover**
  - **mouseenter**
- click sequence:
  - **mousemove**
  - **mousedown**
  - **mouseup**
  - **click**

<div class='discloseC mdCaptureStart1'></div>

**Double-tap**

Meaning 2 taps in quick succession, not 2-finger tap: 

- **touchstart** & -**end**
- focus sequence if needed
- click sequence
- **touchstart** & -**end**
- click sequence
- **dblclick**

<div class='mdCaptureEnd1'></div>

____Pointer events____: so far, not showing up in Chrome for Android.





<div class='discloseC mdCaptureStart'></div>

**Gestures**

Not built into touch or pointer-events models.  Simple recognition
algorithms used here:

For 1-finger touchmove, compare to last touchmove to get horizontal and
vertical velocities.  By observation, 1000px/s indicates swiping:

- dX/dT > threshold => swiping right.
- dX/dT < -threshold => swiping left.
- dY/dT > threshold => swiping down.
- dY/dT < -threshold => swiping up.
- dX/dT & dY/dT over threshold => diagonal motion, not swiping.

For 2-target-touch motions:

- Increasing distance between fingers => spreading.
- Decreasing distance between fingers => pinching.





<div class='discloseC mdCaptureStart'></div>

**Coordinates & dimensions**

____page- vs client- vs screenX/Y____

pageX/Y:

- Distance from left/top of document.
- Relative to document, so a normal-flow element's pageX/Y
  (meaning pageX/Y of a touch on that element) is unaffected by scrolling.
- Units are logical.  After zooming, difference in pageX/Y
  of elements remains the same.

clientX/Y:

- Distance from left/top of viewport (browser client area, iframe, etc).
- Relative to viewport, so element's cleintX/Y (mainly Y) changes 
  with scrolling.
- Units are logical, as with pageX/Y.

screenX/Y:

- Distance from left/top of screen.
- Affected by scrolling similarly to clientX/Y.
- Units are physical.  After zooming in, screenX/Y distance
  between elements is greater.

Coordinates of touchstart, touchend, and slow touchmove events tend to
be reported with 0/1 decimal; during medium/fast touchmove events,
14 decimals (eg 104.89974975585938).  *Possibile explanation: slow
coords are direct measurements, while fast coords are being calculated 
/ interpolated, and they're reported in such detail to minimize 
compounding of rounding error.*

Without scrolling or zooming, the three x coordinate values should be
equal (on a phone where browser fills the horizontal space), and
screenY should equal p/cX + 142 (see note below on dimensions of my
phone).  However, I observe the following:

- cX/Y === pX/Y as expected.
- sX/Y tend to be ~.5px higher than expected:
- For touchstart, touchend, and slow touchmove events, sX-cX and
  sY-cY-142 usually = [0, .5, .75].
- For faster touchmoves, observing maxima/minima for several hundred events,

    ```
    sX-cX     = [-0.00049591064453125, 0.9384536743164062] 
    sY-cY-142 = [-0.00049591064453125, 0.97494506835938]
    ```

*Possible explanation:*

- *page/clientX/Y are derived from the browser's internal data;
  the browser has internal knowledge of which part of itself
  I just touched and what its current scroll offset is.*
  
- *screenX/Y involve a call to the os; the browser doesn't have
  internal knowledge of what part of the screen I just touched.*
  
- *The difference in algorithms is probably where the number 
  -0.00049591064453125 comes from.*


____Dimensions____

Vertical layout of CodePen page on desktop, from top to bottom:

- 24px window title bar
- 90px Chrome ui bar
- 69px CodePen top ui bar
- 801px pen viewport
- 40px CodePen bottom ui bar
  
On phone:

- 22?px Android status bar
- 58?px Chrome ui bar
- 62px CodePen ui bar
- 491px pen viewport
- 7px wasted space

22?/58?px:

- screen.height=640
- window.outerHeight=560
- The 80px above browser's client area is Android status bar
  & Chrome ui bar; inspecting with stylus, status bar seems to be
  about 22px high.

Wasted space:

- CodePen ui bar has (inspecting with DevTools) {height: 69px}.
- On the phone, that's overridden by @media (max-width: 400) {height: 62px}.
- But on both desktop & phone, my pen page is in iframe {height: calc(100%-69px)}.
- If I make my html background <label for='chkNonWhite'>non-white</label> 
  <input type='checkbox' id='chkNonWhite'>&nbsp;, I can see a 7px white bar below it,
  which is CodePen's html element, not mine.




<div class='discloseC mdCaptureStart'></div>

**Signal vs. noise**

When holding finger stationary on target above, I find it's difficult
not to produce occasional (frequency ~1/second) touchmove events that 
report either

- very short-distance movements or
- 0-distance movements, where the only change is in touch.radiusX/Y,
  indicating rotation / wobbling of my finger.

When another finger is moving anywhere on the screen, the frequency
of these events increases to ~10/second; I'm not sure whether that's
because the 2nd finger moves the phone, because it transmits motion
through my body to my other finger, or for some less-obvious reason.

The motion-filter option above makes guess at detecting noise (algorithm 
below), then uses a compromise approach to logging: 

- Text-logging is suppressed: it's disconcerting to hold finger stationary 
yet see a stream of messages that it's moving, whereas it's barely noticeable
to drop a few real signals and miss a few textual updates. 

- Movement of the circular markers follows the opposite logic: it's barely 
noticeable for the marker to move a fraction of a pixel, whereas dropping real 
signals produces choppy motion, especially when zoomed in.

Algorithm: 

1. Detect when motion stops.  By observation, a velocity < 3px/s almost
always indicates stopping. 

2. Once motion has stopped, wait for touch to move a minimum distance
before resuming logging.  By observation, a radius of 8px suppresses
most noise and imposes only a tiny delay in resuming logging of real
motion.





<div class='discloseC mdCaptureStart'></div>

**Responsiveness**

The movement of the circular markers on this page seems to be as 
responsive as in <span id='struckOut'><span>this example</span></span> 
from this [Google tutorial][] _(that's disappointing: they replaced 
the live / interactive examples with looping animations showing how 
the live examples used to work)_{grey} when I uncheck the options above:
don't log text, evaluate gestures, or filter motion.  With all those 
engaged, it's a little less responsive.  When it's synced with a Chrome 
DevTools tab on my desktop (via DevTools / Inspect Devices), it's much 
less responsive.  requestAnimationFrame doesn't seem to speed it up.
[Google tutorial]:https://developers.google.com/web/fundamentals/design-and-ui/input/touch/touch-events

However, I'm stumped in my attempt to *measure* / *quantify* responsiveness.
Every observation I make via js is 'taking the DOM's word for it.'  Example:
marker clearly lags behind finger when moving finger quickly; however, if I
position the marker at (x,y), then check doc<wbr>.elementFromPoint<wbr>(x,y), it always
reports the marker, even when (judging visually) the marker hasn't arrived
there yet.  OS functionality like querying the realtime color of a given screen 
pixel appears to be outside of js's jurisdiction, I think for security reasons.

DevTools has some performance-testing apparatus that I haven't explored.
This might provide a way to quantify responsiveness.

Synthetic Events: this didn't turn out to be helpful in my attempts to 
quantify responsiveness, but it's good to know about (the following
illustration doesn't fully register on a non-touch screen): 
<button id='btnSynthetic'>run</button>.






<div class='discloseC mdCaptureStart'></div>

**Event.timeStamp**

Event.timeStamp is

- in Chrome: ms since user navigated to page, with &mu;s accuracy
- in Firefox:
  - on mouseover / -out / -enter / -leave: 0
  - on mousemove / -down / -up / click: ms since system start.
  
Date.now() is ms since Unix epoch, 1/1/1970.

Algorithm used on this page:  check the timeStamp of the very first 
event logged after navigating to page.  If it has no decimals, degrade to
using Date.now().  I'm not sure if Chrome timeStamp is ever reported 
without decimals - if the event occurs on a whole millisecond, without 
&mu;s component.  The only drawback if that occurs will be degrading to 
Date.now.
  
That possibility is why I'm checking only the very first event.
What I want to avoid is

- checking each event for a decimal
- being in Chrome
- in the middle of an event sequence, receiving
  a whole-millisecond timeStamp, misinterpreting
  it as a Firefox timeStamp, substituting
  Date.now, and calculating that 46 years have passed
  (1970-2016) since start of event sequence.
  
Alternative: check browser type explicitly.

Alternative: ditch event.timeStamp and just use Date.now.




