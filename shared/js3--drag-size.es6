'use strict'

function enableDS (el,opts) { //enable Dragging & Sizing
  //
  // disabling / blocking
  //
  opts=opts||{}
  //If enableDS has been called on this el before, clear old handlers; 
  //set (below) and call (here) disableDS as a method on el so that it executes 
  //in the same closure as that in which the handlers were added:
  if (el.disableDS) el.disableDS()                       
  function disableDS (){
    //Remove all possibilities; there's no error raised by removing one that doesn't exist.
    el.removeEventListener('dragstart' ,pD                 ) 
    el.removeEventListener('mousedown' ,sP                 ) 
    el.removeEventListener('touchstart',sP                 ) 
    el.removeEventListener('mousemove' ,updateCursor       )
    el.removeEventListener('mouseleave',assignCursor       )
    el.removeEventListener('mousedown' ,startMoveOrResize_m)
    el.removeEventListener('touchstart',startMove_t       )
    el.disableDS=undefined} 
  //If this is a command to disable, {disable:true}, end here:
  if (opts.disable) return
  //Else set disableDS method to be used in future call to enableDS,
  //whether that's to disable dragging/sizing or switch to a different
  //type of dragging/sizing (eg from h to v resizing).
  el.disableDS=disableDS 
  //By default, if parent is draggable, and user drags child, parent moves.
  //Allow child to be designated as blocking:
  if (opts.block) {                     
    //Don't inherit {pointer-events:none} - see below.
    el.style.pointerEvents='auto'
    //Don't inherit ancestor's cursor type, like move/grab, since that funtionality
    //is blocked by el:
    el.style.cursor='auto'              
    //Don't pass through mousedown event, which would start parent dragging / resizing:
    el.addEventListener('mousedown' ,sP) 
    el.addEventListener('touchstart',sP) 
    return} //Functionality below not applicable to blocking element.
  //
  // initialization
  //
  'mar'         in opts||(opts.mar        =25       ) //width of resize margin
  'movable'     in opts||(opts.movable    =true     )
  'cb'          in opts||(opts.cb         =()=>{}   ) 
  'sizeEdges'   in opts||(opts.sizeEdges  =[0,0,0,0]) //edges in TRBL order, like css
  'sizeCorners' in opts||(opts.sizeCorners=[0,0,1,0]) //corners TL,TR,BR,BL
  //Preempt descendants' pointer events.  
  //Only need to set children, since this style is inherited.
  for (var ch of Array.from(el.children)) ch.style.pointerEvents='none'
  //Undo in case this was done to el by calling enableDS on ancestor of el:
  el.style.pointerEvents='auto'
  //See comment below about selection:
  var style=doc.createElement("style")
  doc.head.appendChild(style)
  var disableSelection = '*{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}' 
  //Disable native dragging, which happens intermittently when I start dragging 
  //at high velocity and interferes with other events:
  el.addEventListener('dragstart',pD)                                         
  //Store snapshot at beginning of drag/resize; called from startMoveOrResize()
  var old={}, cs=gcs(el)
  function readCS(){
    old.l   =parseInt(cs.left  )
    old.w   =parseInt(cs.width )
    old.maxL=old.l+old.w-opts.mar //See note in moveOrResize().
    old.t   =parseInt(cs.top   )
    old.h   =parseInt(cs.height)
    old.maxT=old.t+old.h-opts.mar} 
  //Change {left/height:auto} to explicit value I don't have to check for 'auto' later; 
  //don't need to worry about auto w/h, because they *compute* as explicit values, 
  //whereas auto l/r/t/b compute as 'auto':
  if (cs.position==='absolute'||cs.position==='fixed') {
    //For {position:auto/fixed}, convert auto left/top to explicit
    //(see explanation in 'dragging/sizing' page):
    if (cs.left==='auto') el.style.left=el.offsetLeft-parseInt(cs.marginLeft)+'px'
    if (cs.top ==='auto') el.style.top =el.offsetTop -parseInt(cs.marginTop )+'px'
  } else {
    //For {position:relative}, auto===0.  Disregard {static}, in which case changing l/t fails.
    if (cs.left==='auto') el.style.left=0 
    if (cs.top ==='auto') el.style.top =0 }
  //Not using afxns for these: I want them to have names I can later pass to removeEventListener, 
  //if enableDS is called with opts.disable:true:
  function pD(ev){ev.preventDefault ()}
  function sP(ev){ev.stopPropagation()} 
  //Figure out which version of grab/grabbing cursor is available, with move as fallback:
  var grab    =findFirstThatWorks('grab'    ,'-webkit-grab'    ,'-moz-grab'    ,'move'), 
      grabbing=findFirstThatWorks('grabbing','-webkit-grabbing','-moz-grabbing','move')
  function findFirstThatWorks(){
    var tmp=doc.createElement('div')
    for (var i=0;i<arguments.length-1;++i) {
      tmp.style.cursor=arguments[i]
      if (tmp.style.cursor) return arguments[i]} // Found one that works.
    return arguments[i]}                         // None work; return last.
  //
  // hover phase
  //
  el.addEventListener('mousemove',updateCursor)          
  function updateCursor(ev){
    //If dragging onto element, something else is going on; don't set cursor; 
    //don't block event - this may be the moving/resizing event, handled by window:
    if (ev.buttons) return       
    //Don't set parent cursor (effect not discernable, but it shouldn't be happening):
    ev.stopPropagation()                                 
    var bcr=el.getBoundingClientRect(), 
        x  =ev.clientX-bcr.left,
        y  =ev.clientY-bcr.top,
        //default cursor style:
        csr=cs.position==='static'&&opts.movable?'not-allowed':opts.movable?grab:'inherit'
    //Divide block horizontally into 4 logical strips: 
    //l marg | between l/r marg | r marg | vscroll (if present); likewise vertically.
    if (x>el.clientWidth || y>el.clientHeight) { //over scrollbars
      assignCursor(null); return 
    } else if (x<=opts.mar) {                    //in l margin; order of edge indices: t r b l
      opts.sizeEdges[3] && (csr='w-resize')      
      if (y<=opts.mar) {                         //in tl corner; order of corner indices: tl tr br bl
        opts.sizeCorners[0] && (csr='nw-resize') 
      } else if (y>=el.clientHeight-opts.mar) {  //in bl corner
        opts.sizeCorners[3] && (csr='sw-resize')}} 
    else if (x< el.clientWidth-opts.mar) {       //between l & r margins
      if (y<=opts.mar) {                         //top edge
        opts.sizeEdges  [0] && (csr= 'n-resize')
      } else if (y>=el.clientHeight-opts.mar) {  //bottom edge
        opts.sizeEdges[2] && (csr='s-resize')}} 
    else {                                       //in r marg
      opts.sizeEdges[1] && (csr='e-resize')
      if (y<=opts.mar) {                         //in tr corner
        opts.sizeCorners[1] && (csr='ne-resize')
      } else if (y>=el.clientHeight-opts.mar) {  //in br corner
        opts.sizeCorners[2] && (csr='se-resize')}}
    assignCursor(null,csr) } 
  el.addEventListener('mouseleave',assignCursor)              
  function assignCursor(ev,csr) {
    //Called from 
    //- updateCursor      when hovering mouse
    //- startMoveOrResize to set grabbing cursor
    //- stopMoveOrResize  to reset cursor to previous value (eg. move, sw-resize, et.)
    //- el.onmouseleave   to reset to 'inherit'.
    //Only in last case is this fxn called with an ev arg.  In this case,
    //make sure buttons aren't down, which indicates that el is being dragged
    //quickly, and mouse got ahead of el:
    if (ev && ev.buttons) return 
    //No second arg => unassign to 'inherit':
    csr=csr||'inherit'
    el.style.cursor=csr
    //During move/size operation, assign grabbing csr to el's ancestors, 
    //so that other els inherit it (unless they have a nondefault cursor of their own),
    //for the following cases:
    //- el is dragged / extended underneath unrelated higher-z el;
    //  don't want it to look like drag/size operation is interrupted;
    //- mouse moves fast and momentarily gets away from el.  
    //Include html's cursor, in case mouse moves off (typically below) body altogether.
    //Then undo, when csr==='inherit':
    if (csr===grabbing || csr==='inherit') {
      var par=el.parentNode
      while (par!==doc) {par.style.cursor=csr; par=par.parentNode} }} 
  //
  // moving / resizing
  //
  //_m functions for mouse, _t for touch.
  //Touch functionality is reduced from mouse:
  //- ignore cursor
  //- no resizing
  el.addEventListener('mousedown' ,startMoveOrResize_m) 
  el.addEventListener('touchstart',startMove_t        )
  var csrStart, efpStart //See note just below.
  function startMoveOrResize_m(ev){
    ev.stopPropagation() //For when one draggable element overlaps another.
    //Make note of what cursor was before drag/size operation began, to reset afterward.
    //Also note element mouse is directly over; if not over same element at end
    //(such as when dragging el underneath a higher-z element), reset cursor to 'inherit':
    csrStart=cs.cursor
    efpStart=doc.elementFromPoint(ev.clientX,ev.clientY)   
    assignCursor(null,grabbing)
    //While resizing, if i go past t/l edges and go over something selectable, 
    //it'll start a selection-drag; this css rule (defined above) halts all selection 
    //until removed in stopMoveOrResize():
    style.sheet.insertRule(disableSelection, 0)             
    //Take snapshot of mouse & element; track delta in pageX/Y, not clientX/Y, 
    //since dragging with cursor against b/r edge of screen triggers extra dragging & scrolling: 
    //no change in clientX/Y, but change in pageX/Y:
    old.x=ev.pageX; old.y=ev.pageY; readCS()             
    //Place listener on win for when mouse accelerates past box / when mouse moves into 
    //negative space while resizing.  With el as target, the mouse can 'escape' from the el, 
    //and the event will stop firing:
    win.addEventListener('mousemove',moveOrResize_m)   
    //Same need for detecting end of motion: if mouse is released after 'escaping' from element, 
    //el.onmouseup doesn't fire:
    win.addEventListener('mouseup',stopMoveOrResize_m) } 
  function startMove_t(ev){
    ev.stopPropagation()
    old.x=ev.changedTouches[0].pageX
    old.y=ev.changedTouches[0].pageY
    readCS()
    el.addEventListener('touchmove'  ,move_t)   
    el.addEventListener('touchend'   ,stopMove_t) 
    el.addEventListener('touchcancel',stopMove_t) 
  } 
  function moveOrResize_m(ev){
    var deltaX=ev.pageX-old.x,
        deltaY=ev.pageY-old.y
    function moveLEdge(){
      //When dragging left edge rightward, don't compress el to less than margin-width.
      //maxL/T set above in call to readCS():
      el.style.left  =Math.min(old.l+deltaX,old.maxL)+'px'
      el.style.width =Math.max(old.w-deltaX,opts.mar)+'px'}
    function moveTEdge(){
      //Same constraint when dragging top edge downward:
      el.style.top   =Math.min(old.t+deltaY,old.maxT)+'px'
      el.style.height=Math.max(old.h-deltaY,opts.mar)+'px'}
    function moveREdge(){
      el.style.width =Math.max(old.w+deltaX,opts.mar)+'px'}
    function moveBEdge(){
      el.style.height=Math.max(old.h+deltaY,opts.mar)+'px'}
    switch(csrStart){
      case  'n-resize':moveTEdge();              break
      case  's-resize':moveBEdge();              break 
      case  'w-resize':moveLEdge();              break 
      case  'e-resize':moveREdge();              break
      case 'nw-resize':moveTEdge(); moveLEdge(); break
      case 'ne-resize':moveTEdge(); moveREdge(); break
      case 'sw-resize':moveBEdge(); moveLEdge(); break
      case 'se-resize':moveBEdge(); moveREdge(); break
      case  grab      :el.style.left=old.l+deltaX+'px'
                       el.style.top =old.t+deltaY+'px'}
    opts.cb()} //Call callback if any.
  function move_t(ev){
    ev.preventDefault()
    var deltaX=ev.changedTouches[0].pageX-old.x,
        deltaY=ev.changedTouches[0].pageY-old.y
    el.style.left=old.l+deltaX+'px'
    el.style.top =old.t+deltaY+'px'
    opts.cb()}
  //
  // cleanup
  //
  function stopMoveOrResize_m(ev){
    win.removeEventListener('mousemove',moveOrResize_m)
    win.removeEventListener('mouseup'  ,stopMoveOrResize_m) 
    style.sheet.cssRules.length && style.sheet.deleteRule(0) //Reenable selection.
    if (doc.elementFromPoint(ev.clientX,ev.clientY) === efpStart) //See note above about efpStart.
         assignCursor(null,csrStart)
    else assignCursor(null) }
  function stopMove_t(ev){
    el.removeEventListener('touchmove'   ,move_t)
    el.removeEventListener('touchend'    ,stopMove_t) 
    el.removeEventListener('touchcancel' ,stopMove_t) }} 

