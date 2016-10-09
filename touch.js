'use strict'
standardInit()

var inCodePen  = /codepen/i.test(doc.URL),
    lnkHome    = spanHome.querySelector('a')
lnkHome.target = inCodePen? '_blank' : '_self'

//Main functionality:
enableEventLogging()

//Controls (checkboxes, buttons, etc.):
chkTextLog.onclick=()=>dTextLog.style.display=(chkTextLog.checked?'':'none')
sliFS.oninput=()=>dTextLog.style.fontSize=sliFS.value+'em'
optCoords1.addEventListener('click',showCoords)
optCoords3.addEventListener('click',showCoords)
function showCoords(ev){
  var rule=matchCssRule('.coords > p:not(:first-of-type)')
  rule.style.display=ev.target===optCoords1?'none':'block' }
chkNonWhite.onclick=()=>html.style.background=(chkNonWhite.checked?'red':'')
btnSynthetic.onclick=tmoveSequence


//From here down, only function declarations:

//////////////////////////////////////////////////////////
// 
//  Initialization:
// 
//////////////////////////////////////////////////////////

//I need access to certain info between events to enable
//- gesture recognition
//- motion filter
//- updating coordinates on touchmove events
//- tracking time since event sequence started
//- determining end of sequence, so log can be refreshed.
//Method 1: Gobal vars would work, but I want to practice a more robust, 
//          encapsulated approach.
//Method 2: I could use local vars and place all the functionality in one
//          giant wrapper fxn, but I dislike giant fxns.
//Method 3: Use local vars as above, but instead of one giant wrapper fxn, 
//          pass the vars around as args.  That would be unweildy, but it's
//          the basis of the following approach:
//Method 4: Let a 'closure' object be the wrapper for the data to pass between
//          fxns.  As a bonus, make it a prop of the ev obj I was passing around anyway.
//          Now I have an enhanced ev obj, with awareness of its context.
//          Slight refinement: most of the data pertains to the last event.  Have one 
//          closed var 'last' for that and another 'closure' for anything else.
function enableEventLogging(){
  var last=initialLastObj(), closure=initialClosureObj()
  eventsToLog().forEach(listenForIt)
  function listenForIt(type) {dTouch.addEventListener(type,logIt)}
  function logIt(ev) {ev.closure=closure; ev.last=last; evalAndLog(ev)} }

function eventsToLog(){
        // mouse        pointer              touch
  return ['mouseover' ,'pointerover'       ,
          'mouseenter','pointerenter'      ,
          'mouseout'  ,'pointerout'        ,
          'mouseleave','pointerleave'      ,
          'mousedown' ,'pointerdown'       ,'touchstart' ,
          'mousemove' ,'pointermove'       ,'touchmove'  ,
          'mouseup'   ,'pointerup'         ,'touchend'   ,
                       'pointercancel'     ,'touchcancel',
          'click'     ,'gotpointercapture' ,
          'dblclick'  ,'lostpointercapture',
                       'pointerlockchange' ,
                       'pointerlockerror'] }

function initialLastObj(){
  return {t        :0 ,  // timeStamp
          type     :'',  // ev.type
          n        :0 ,  // # targetTouches
          //For info about specific touches, organize in arrays 
          //  indexed by touch.identifier:
          x        :[],  // Position of each target touch.
          y        :[], 
          marker   :[],  // Its marker div.
          tmoveDiv :[],  // For touchmove, div in dTextLog tracking it.
          //Used by motion filter:
          tMovement:[],  // Last time each touch moved.
          xStop    :[],  // Position of point where each touch stopped (if it stopped),
          yStop    :[]}} //   so filter can gage when significant movement has resumed.

function initialClosureObj(){
  var closure={t0       :0,   // Time of 1st event in this sequence (all the events logged 
                              // together in dTextLog), for logging ms between events.
               mrkRadius:0}   // Marker radius, so I only have to calculate it once.
                              // Have to calculate it since I specified it in ems.
  //Colors were just easier to store in an array, rather than have a switch statement:
  var colors={}
  //major mouse events:
  colors['mousedown'  ]=colors['mousemove'   ]= colors['mouseup']=
  colors['click'      ]=colors['dblclick'    ]='darkviolet'
  //minor mouse events:
  colors['mouseenter' ]=colors['mouseleave'  ]=
  colors['mouseover'  ]=colors['mouseout'    ]='grey'
  closure.colors=colors
  //touch events:
  closure.tColors=['blue','deepskyblue','red','orange']
  return closure }

//////////////////////////////////////////////////////////
// 
//  Main logging functionality:
// 
//////////////////////////////////////////////////////////

function evalAndLog(ev){
  ev.stopPropagation()
  //Here and in evalAndLogTouch(), tack some derived data onto ev:
  //ev.isTouch: Boolean, true if this is touch event.
  //ev.tch    : Each on-target changedTouch will be logged individually;
  //            this is shortcut for touch currently being logged.
  //ev.id     : Shortcut for .identifier of touch currently being logged.
  //ev.cti    : changedTouches index of touch currently being logged
  //            (not sure if I'll use this for anything).
  ev.isTouch=ev.changedTouches?true:false
  ev.t=timeStamp(ev) //Normalize timeStamp (see note at fxn below).
  //For non-touch, skip to logging.
  //For touch, first (optionally) evaluate gestures,
  //then separate into individual touches, then log:
  if (!ev.isTouch) logEv(ev); else evalAndLogTouch(ev) 
  //Save info potentially needed by next event:
  saveEventInfo(ev) }

function evalAndLogTouch(ev){
  //Check for gestures (code at end):
  if (chkGestures.checked && ev.type==='touchmove' && ev.last.type==='touchmove')
    if      (ev.touches      .length===1) eval1TouchGesture(ev)
    else if (ev.targetTouches.length===2) eval2TouchGesture(ev)
  //Log each touch separately:
  for (var i=0;i<ev.changedTouches.length;++i) {
    ev.cti=i
    ev.tch=ev.changedTouches[i]
    ev.id=ev.tch.identifier
    //Filter out remote touches:
    if (ev.tch.target!==dTouch) {
      //log('remote touch, id: '+ev.id+', target: '+idOf(ev.tch.target))
      continue }
    //Filter out 0-distance touchmoves if checkbox is checked (code at end):
    if (chkFilter.checked && ev.type==='touchmove') {
      determineSignificanceOf(ev)
      if (ev.significance===0) continue } //Continue to next for-iteration, skipping logging.
    //Else log:
    logEv(ev) }}

function logEv(ev){ //event, changedTouches index
  beginNewSequenceIfAppropriate(ev)
  //text log:
  if (chkTextLog.checked){
    switch (ev.type){
      case 'mousemove' : printMouseMove(ev)               ; break
      case 'touchstart': addCoords(ev,printOtherEvent(ev)); break
      case 'touchmove' : printTouchMove(ev)               ; break
      default          : printOtherEvent(ev)  }}
  //markers:
  switch (ev.type){
    case 'touchstart': addMarker(ev); break
    case 'touchmove' : setMarkerPos(ev,ev.last.marker[ev.id]) }
  //cleanup:
  switch (ev.type){
    case 'touchcancel':
      dTouch.removeChild(ev.last.marker[ev.id]); ev.last.marker[ev.id]=undefined
      //--> flow through -->
    case 'touchend': 
      //Unset all properties for this touch except .marker, which stays on screen
      //until next touch begins; it's removed by beginNewSequence() (or in 'case'
      //just before this, for touchcancel).
      for (var prop in ev.last) 
        if (prop!=='marker' && Array.isArray(ev.last[prop]))
          ev.last[prop][ev.id]=undefined }}

function beginNewSequenceIfAppropriate(ev){
//Clear text log and markers after logical sequence of events:
  //Beginning: clear the text 'no events fired':
  if (!ev.last.type) var newSequenceReason=1
  //After double-click, except when tapping off dTouch: 
  //let the mouseout/mouseleave remain as end of old event-sequence:
  else if (ev.last.type==='dblclick' && ev.type!=='mouseout') newSequenceReason=2
  //See note above:
  else if (ev.last.type==='mouseleave') newSequenceReason=3
  //Before 2nd click NOT forming double-click:
  else if (ev.last.type==='click' && ev.type==='mousedown' 
           && ev.t-ev.last.t>333) newSequenceReason=4
           //Double-click speed on my desktop: 
           // - 328ms between mousedowns -> dblclick
           // - 336ms '                     no dblclick
           //So probably 333 or 330?
  //Before 2nd touch NOT forming double-click:
  else if (ev.last.type==='click' && ev.type==='touchstart' 
           && ev.t-ev.last.t>300) newSequenceReason=5
           //Double-click speed on my phone: 
           // - 281ms between mousedown & touchstart -> dblclick
           // - 311ms '                                 no dblclick
           //So probably 300?

  //After click, before moving mouse:
  else if (ev.last.type==='click' && ev.type==='mousemove') newSequenceReason=6

  //After touchend with no fingers remaining on dTouch, followed by touchstart:
  else if (ev.last.type==='touchend' && ev.last.n===0 
           && ev.type==='touchstart') newSequenceReason=7
  
  //After cancel:
  else if (ev.last.type==='touchcancel') newSequenceReason=8
  
  if (!newSequenceReason) return
  //log('new sequence reason = '+newSequenceReason)
  //Reset values to begin logging new event:
  dTextLog.innerHTML=''
  //Clear background indicating gesture:
  dTouch.className=sp5.className=''
  //t0: time of 1st event (typically touchstart) in sequence as 
  //defined by this program:
  ev.closure.t0=ev.t
  for (var marker of ev.last.marker) marker&&dTouch.removeChild(marker)
  ev.last.marker=[]; ev.last.tmoveDiv=[] }

function printMouseMove(ev){
  if (ev.last.type!=='mousemove') { // add new div
    var d=printOtherEvent(ev)       // mousemove 134ms
  } else {                          // update previous div
    d=dTextLog.children[dTextLog.children.length-1] }
  addNewTime(ev,d)                  // mousemove 134-245ms
  addCoords (ev,d) }                // mousemove 134-245ms / coordinates

function printTouchMove(ev){
  if (chkFilter.checked && ev.significance<=2) return
  //Update text log:
  //Initialize if no div is logging this touch's movement yet:
  ev.last.tmoveDiv[ev.id]||(ev.last.tmoveDiv[ev.id]=printOtherEvent(ev))
  addNewTime(ev,ev.last.tmoveDiv[ev.id])
  addCoords(ev,ev.last.tmoveDiv[ev.id]) }

//For mousemove/touchmove events, add/update end of time range,
//eg '245ms' in 'mousemove 134-245ms':
function addNewTime(ev,div){
  //Argument div is the <div> logging info for this set of events,
  //either mousemoves or touchmoves by a particular touch:
  var s=div.innerHTML
  //Truncate at hyphen for already-updated values, eg '134-245ms',
  //or 'ms' for first-time values, eg '134ms';
  //this also truncates coordinates-table if present, 
  //which is re-added in addCoords()
  var pHyp=s.indexOf('-'), pMs=s.indexOf('ms'),
      pTrunc=pHyp===-1?pMs:Math.min(pHyp,pMs)
  s=s.substring(0,pTrunc)
  var dT=round(ev.t-ev.closure.t0)
  div.innerHTML=s+'-'+dT+'ms' }

function addCoords(ev,div){
  //For mousemove, coords are properties of ev;
  //for touchmove, of ev.changedTouches[cti].
  var obj=ev.isTouch?ev.tch:ev
  var bullet='<span>&#9656</span>'
  div.innerHTML+='<div class="coords">'
    + '<p>'+bullet+'x/y: '+ Math.round(obj.pageX)  +','+Math.round(obj.pageY)  +'</p>'
    + '<p>'+bullet+'cli: '+ Math.round(obj.clientX)+','+Math.round(obj.clientY)+'</p>'
    + '<p>'+bullet+'scr: '+ Math.round(obj.screenX)+','+Math.round(obj.screenY)+'</p></div>' } 

function printOtherEvent(ev){
  var eName=ev.type.replace('mouse','m').replace('touch','t')
  if (ev.isTouch){
    eName+=ev.id //eg tmove1
    var clr=ev.closure.tColors[ev.id]||'black'}
  else {clr=ev.closure.colors[ev.type]}
  //Synthetic events mousemove/down/mouseup/click always afaik occur together
  //with same timestamp.  Abbreviate / emphasize:
  if (ev.type==='click' && dTextLog.children.length>=3) {
    var d1=dTextLog.children[dTextLog.children.length-3],
        d2=dTextLog.children[dTextLog.children.length-2],
        d3=dTextLog.children[dTextLog.children.length-1],
        s1=d1.innerHTML.split(' '), //eg ["mmove","33-33ms"]
        s2=d2.innerHTML.split(' '), //eg ["mdown","33ms"   ]
        s3=d3.innerHTML.split(' ')  //eg ["mup"  ,"33ms"   ]
    if (s1[0]==='mmove' && s2[0]==='mdown' && s3[0]==='mup' 
        && s2[1]===s3[1]) { //abbreviate:
      //Keep the coordinates of d1; just replace the text before them:
      d1.childNodes[0].data='mmv/dn/up/click '+s2[1]
      dTextLog.removeChild(d2);dTextLog.removeChild(d3)
      return d1 }}
  var div=document.createElement('div'),
      dT=round(ev.t-ev.closure.t0)
  div.innerHTML+=eName+' '+dT+'ms'
  div.style.color=clr
  dTextLog.appendChild(div)
  return div}

function addMarker(ev){
  var mrk=ev.last.marker[ev.id] //Use already-existing marker or...
  if (!mrk) {                   //make and append new one:
    mrk=document.createElement('div')
    mrk.id='marker'+ev.id
    mrk.innerHTML=ev.id
    mrk.style.background=ev.closure.tColors[ev.id]||'black'
    mrk.className='marker'
    dTouch.appendChild(mrk) 
    ev.last.marker[ev.id]=mrk }
  setMarkerPos(ev,mrk) }

function setMarkerPos(ev,mrk){
  var x=ev.tch.pageX,
      y=ev.tch.pageY,
  //Translate page coords to be relative to dTouch:
      xRel=x-outputFrame.offsetLeft-dTouch.offsetLeft,
      yRel=y-outputFrame.offsetTop -dTouch.offsetTop
  //Align center of marker, not top-left corner;
  //I'm not sure how much I'm gaining by storing this, 
  //rather than just recalculating it each time:
  !ev.closure.mrkRadius&&(ev.closure.mrkRadius=parseInt(gcs(mrk).height)/2)
  var xMrk=xRel-ev.closure.mrkRadius,
      yMrk=yRel-ev.closure.mrkRadius
  mrk.style.left=xMrk+'px'                
  mrk.style.top =yMrk+'px' }

function saveEventInfo(ev){ //Record info for next event's use:
  ev.last.t=ev.t
  ev.last.type=ev.type
  if (!ev.isTouch) return
  ev.last.n=ev.targetTouches.length
  for (var i=0; i<ev.targetTouches.length;++i){
    var id=ev.targetTouches[i].identifier
    ev.last.x[id]=ev.targetTouches[i].pageX
    ev.last.y[id]=ev.targetTouches[i].pageY }}

function timeStamp(ev){
  if (ev.closure.reliableTimeStamp===undefined)
    ev.closure.reliableTimeStamp=
      (ev.timeStamp.toString().match(/\./)?true:false)
  return ev.closure.reliableTimStamp?ev.timeStamp:Date.now() }




//////////////////////////////////////////////////////////
// 
//  Gestures
// 
//////////////////////////////////////////////////////////

function eval1TouchGesture(ev){
  var tch=ev.touches[0],
      id=tch.identifier,
      dX=tch.pageX-ev.last.x[id], dY=tch.pageY-ev.last.y[id],
      dT=ev.t-ev.last.t,
      vX=dX/dT, vY=dY/dT,
      aVX=Math.abs(vX), aVY=Math.abs(vY),
      thresh=1
  if (aVX>thresh && aVY>thresh) return //diagonal
  if      (vX >  thresh) assignGesture(ev,'swipedRight')
  else if (vX < -thresh) assignGesture(ev,'swipedLeft' )
  else if (vY >  thresh) assignGesture(ev,'swipedDown' )
  else if (vY < -thresh) assignGesture(ev,'swipedUp'   ) }

function eval2TouchGesture(ev){
  if (ev.last.n!==2) return //Make sure last event was also 2-touch.
  var tch1=ev.touches[0],  tch2=ev.touches[1],
      id1=tch1.identifier, id2=tch2.identifier,
      //box formed by 2 fingers:
      wOld=ev.last.x[id1]-ev.last.x[id2], //width
      hOld=ev.last.y[id1]-ev.last.y[id2], //height
      dOld=hypotenuse(wOld, hOld),        //diagonal / distance
      wNew=tch1.pageX-tch2.pageX,
      hNew=tch1.pageY-tch2.pageY,
      dNew=hypotenuse(wNew, hNew),
      dD=dNew-dOld,
      dT=ev.t-ev.last.t,
      vD=dD/dT,
      thresh=.1
  if      (vD >  thresh) assignGesture(ev,'spread' )
  else if (vD < -thresh) assignGesture(ev,'pinched') }

function assignGesture(ev,type){
  //Set background of dTouch and span sp5 (in 1st line of text on page):
  dTouch.className=sp5.className=''
  dTouch.classList.add(type) 
  sp5.classList.add(type) }



//////////////////////////////////////////////////////////
// 
//  Motion filter
// 
//////////////////////////////////////////////////////////

function determineSignificanceOf(ev){
  ev.significance=significanceOf(ev)
  if (ev.significance>0) ev.last.tMovement[ev.id]=ev.t
  if (ev.significance>=3) //unset stop point:
    ev.last.xStop[ev.id]=ev.last.yStop[ev.id]=undefined }

//0: no motion; only radiusX/Y changed
//1: 1st very slow movement: signals stopping
//2: previously stopped; motion not past threshold
//3: previously stopped, 1st movement past threshold: signals resuming movement
//4: regular movement, including 1st movement
function significanceOf(ev){
var minVelocity=0.003,
    minRadius=8,
    dX=ev.tch.pageX-ev.last.x[ev.id], 
    dY=ev.tch.pageY-ev.last.y[ev.id]
if (dX===0 && dY===0) return 0 //0 movement
if (ev.last.tMovement[ev.id]===undefined) { //1st movement
  // log('motion filter: 1st movement')
  return 4 }
var dT=ev.t-ev.last.tMovement[ev.id]
var dP=hypotenuse(dX,dY), 
    v=dP/dT
if (ev.last.xStop[ev.id]===undefined){ //in motion
  if (v<minVelocity) { //this motion signals stopping
    ev.last.xStop[ev.id]=ev.last.x[ev.id]
    ev.last.yStop[ev.id]=ev.last.y[ev.id]
    // log('motion filter: stopping with v==='+round(v,5))
    return 1 }
  return 4 } //regular motion
else { //stopped
  var tmdStyle=ev.last.tmoveDiv[ev.id].style, //for toggling bold, to show filtered motion
      xFromStop=ev.tch.pageX-ev.last.xStop[ev.id],
      yFromStop=ev.tch.pageY-ev.last.yStop[ev.id],
      dFromStop=hypotenuse(xFromStop,yFromStop)
  if (dFromStop<minRadius) {//stopped, not past threshold
    // log('motion filter: insignificant movement')
    tmdStyle.fontWeight=(tmdStyle.fontWeight===''?'bold':'')
    return 2 }
  // log('motion filter: resuming because touch moved '+round(dFromStop,1)
  //     +', from '+round(ev.last.xStop[ev.id],1)+'/'+round(ev.last.yStop[ev.id],1)
  //     + ' to '  +round(ev.tch .pageX       ,1)+'/'+round(ev.tch .pageY       ,1))
  tmdStyle.fontWeight=''  
  return 3 }} //was stopped, has now passed threshold



//////////////////////////////////////////////////////////
// 
//  Raw Logging (used at an earlier stage)
// 
//////////////////////////////////////////////////////////

function enableRawLogging(){
  hookUp('mouse     : -over -enter -down -move -up click dblclick -out -leave wheel contextmenu show')
  //hookUp('drag      : - -start -enter -over -leave -exit -end drop')
  hookUp('touch     : -start -move -end -cancel')
  //hookUp('pointer   : -enter -over -move -down -up -out -leave -cancel got-capture lost-capture -lockchange -lockerror')
  //hookUp('key       : -down -up -press')
  //hookUp('focus     : - blur -in -out')
  //hookUp('fullscreen: -change -error scroll resize')
  //hookUp('select    : - -start -ionchange cut copy paste')
  //hookUp('device    : -orientation orientationchange compassneedscalibration -light -proximity userproximity')
  function hookUp(s){
    var root=s.match(/[^: ]*(?= *:)/)
    //[^: ]*  anything not colon or space
    //(?=     followed by
    // *:)    optional spaces then colon
    if (root) s=s.replace(/[^:]*:\s/,'')
    //[^:]* everything before colon
    //:\s   plus colon plus space
      .replace(/-/g, root)
    s.split(' ').forEach(hookItUp) }
  function hookItUp(evName){win.addEventListener(evName,logRaw,true)     }
  function logRaw  (ev    ){log(idOf(ev.target)+'.'+ev.type)             }}



//////////////////////////////////////////////////////////
// 
//  Synthetic events (experiment)
// 
//////////////////////////////////////////////////////////

function tmoveSequence(){
  scrollTo(0,0)
  var x=260, y=380, yMin=120, yStep=5
  syntheticTEv('start',x,y)
  requestAnimationFrame(nextSyntheticEv)
  function nextSyntheticEv(){
    y-=yStep
    if (y>yMin) { syntheticTEv('move',x,y)
                  requestAnimationFrame(nextSyntheticEv) }
    else          syntheticTEv('end',x,y) }}

function syntheticTEv(type,x,y){
  var tEv=new TouchEvent('touch'+type,{changedTouches: [syntheticTouch(x,y)]}),
      el=document.elementFromPoint(x,y)
  el.dispatchEvent(tEv) }
function syntheticTouch(x,y){
  return new Touch({identifier:0     ,
                    target    :dTouch,
                    pageX     :x     ,
                    pageY     :y     })}



