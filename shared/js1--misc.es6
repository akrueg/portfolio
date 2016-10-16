'use strict'
console.clear()

//short names:
var log =console.log.bind(console),
    gcs =getComputedStyle   ,
    win =window             ,
    doc =document           ,
    html=doc.documentElement,
    body=doc.body

//querySelector shortcuts:
doc.qsa=Element.prototype.qsa=qsa
function qsa(sel){
  var el= (!this || this===win)? doc : this
  return Array.from(el.querySelectorAll(sel)) }
doc.qs=Element.prototype.qs=qs
function qs(sel){
  var el= (!this || this===win)? doc : this
  return el.querySelector(sel) }

//qsa minus - first query minus second
//eg: <a> not contained in <section>: qsam('a','section a')
function qsam(s1,s2,el1,el2){
  el1=el1||doc
  el2=el2||doc
  var q1=el1.qsa(s1),
      q2=el2.qsa(s2)
  return q1.filter(el=>!q2.includes(el)) }

//Give everybody an id, so I can do things like query event.target.id:
win.id='win'; doc.id='doc'; html.id='html';body.id='body'
function idOf(el) {return el.id||el.tagName||'unidentifiable'}

//Log html element as js object, not dom node:
// given < div id='d1'>,
// log(d1)                logs it as a node
// var v=d1;log(v)        logs it as a node
// var v={p:d1}; log(v.p) logs it as a node
// var v={p:d1}; log(v)   logs it as a js object
function logj(x) {var v={jsObject:x}; log(v)} 

function round(value, decimals) {
  if (decimals===undefined) decimals=0
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)}

function eq(){ //Check if 1st arg equals any subsequent arg.
  for (var i=1;i<=arguments.length;++i)
    if (arguments[0]===arguments[i]) return true
  return false }

function hypotenuse(a, b) {return Math.pow(Math.pow(a,2)+Math.pow(b,2),0.5)}

function trimWs(s){
  var rx=newRx(/\S/,        // Skip initial whitespace and match 1st nonwhitespace char
               /[\S\s]*?/,  // plus anything, including medial whitespace,
                            // lazily, so next condition has higher priority,
               /(?=\s*$)/)  // followed by (don't include) final whitespace.
  var match=rx.exec(s)
  return match?match[0]:'' }
var trimWS=trimWs // I keep forgetting which I named it; allow both.

function getCssRule(selectorText){
  for (var sheet of Array.from(doc.styleSheets))
    for (var rule of Array.from(sheet.cssRules))
      if (rule.selectorText===selectorText) return rule }
var matchCssRule=getCssRule //old name

function newCssRule(r, sheet){
  sheet=sheet||doc.styleSheets[0]
  var newIndex= sheet.insertRule(r,sheet.cssRules.length) 
  return sheet.cssRules[newIndex] }

function newRx(){
  var fullSource=Array.from(arguments)
                      .map(subRx=>subRx.source)
                      .join('')
  return new RegExp(fullSource) }

function timeoutSet(t, f){setTimeout(f,t)}

// .childNodes with comments & misc filtered out; just text & elements:
function TENodes(el){
  return Array.from(el.childNodes).filter(node=>
    (node.nodeType===1||node.nodeType===3)) }

function newEl(tag, id, classes, text, child1orArray, child2etc){ 
  var el=doc.createElement(tag)
  if (id) el.id=id
  if (classes){
    el.className=classes.replace(/\./g,' ')  // Accept delimiters , . \s
                        .replace(/,/g ,' ') }
  if (text) el.innerHTML=text
  if (child1orArray) {
    var children=Array.isArray(child1orArray)
                ? child1orArray
                : Array.from(arguments).slice(4)
    for (var ch of children) el.appendChild(ch) }
  return el }

function addChild(parent, child){
  if (typeof child==='string') child=doc.createElement(child)
  parent.appendChild(child)
  return child }

function addText(el,text){
  var tn=doc.createTextNode(text)
  el.appendChild(tn) }

function setRange(el, min, max, val, step){
  el.type='range'; el.min=min; el.max=max; el.value=val; el.step=step 
  //Add min/max labels before & after:
  var sib=el.previousSibling, par=el.parentNode
  if (!sib || sib.nodeType===1){
    var lbl=doc.createTextNode(min)
    par.insertBefore(lbl,el) }
  else sib.data+=' '+min
  sib=el.nextSibling
  if (!sib || sib.nodeType===1){
    lbl=doc.createTextNode(max)
    if (!sib) par.appendChild(lbl)
    else par.insertBefore(lbl,sib) }
  else sib.data=max+' '+sib.data }

function parseUrl(s){
  // Capture protocol://
  var rx=newRx( /(.*\/\/)?/ ,  // any + //
                /(.*)/      ), // any after //
      match=rx.exec(s),
      url={}
  url.protocol=match[1]||''; s=match[2]
  // Capture #fragment:
  rx=newRx( /([^#]*)/    , // Capture: any not #
            /((?:#.*)?)/ ) // Capture: (# + any) or ''
            // ( ?)             Capture: expression below or ''
            // (?:#.*)          Don't capture: # + any
  match=rx.exec(s)
  s=match[1]; url.fragment=match[2]
  // Capture ?query-string:
  rx=newRx( /([^\?]*)/,      // any not ?
            /((?:\?.*)?)/ )  // capture the following or match '':
           // (?:\?.*)          non-capture group matching the following:
           //    \?.*           ? + any
  match=rx.exec(s)
  s=match[1]; url.query=match[2]
  // In www.a.com/b/ and www.a.com/b, the resource is b.
  // Strip final /
  rx=newRx( /((?:.*[^\/])?)/ , // Capture '' or following:
           // (?:.*[^\/])         Match but don't capture following:
           //    .*[^\/]          Any not ending in /   
            /\/?$/           )
  s=rx.exec(s)[1]
  // Separate path/ & page (typically; technically 'resource'):
  rx=newRx( /((?:.*\/)?)/,  // Capture '' or following:
           // (?:.*\/)         Match but don't capture following:
           //    .*\/          any + /
            /(.*)/       ) 
  match=rx.exec(s)
  url.path=match[1]; url.resource=url.page=match[2] 
  var fileName=parseFileName(url.page)
  url.pageNoExt=fileName.noExt
  url.pageExt=fileName.ext
  return url }

function parseFileName(s){
  var rx=newRx( /(.*.(?=\.)|.*)/ ,  // Capture all before last .
              // (         |  )          Capture either of the following:
              //  .*.(?=\.)              - all + any followed by .
              //  .*                       all
              //    .                            any
              //     (?=\.)                          followed by .
              //            .*           - If that fails because there's no .
              //                           capture whole string
                /\.?/            ,  // Discard (match but don't capture) 
              //                       last . if there was one.
                /(.*)/           ), // Capture all after last . if there was one.
      match=rx.exec(s)
  return {noExt:match[1], ext:match[2]} }


/*************************************************************************************/

/*************************************************************************************/

/********************* DISCLOSURES ***************************************************/

/*************************************************************************************/

/*************************************************************************************/

function setDisclosures(){ 
  for (var el of doc.qsa('.disclose, .discloseC')) setDisclosure(el) 
  }

function setDisclosure(el){
  if (!configureDisclosureTitle(el)) return
  updateDisclosureClasses(el)
  indentDisclosureIfNested(el)
  addDisclosureMinLink(el)
  el.toggleDisclosure=toggleDisclosure_ }
  
function configureDisclosureTitle(el){
  var ti; if (!(ti=findDisclosureTitle(el))) return null // failure
  ti.classList.add('disclosureTitle')             
  ti.addEventListener('click', ev=>{
    ev.stopPropagation(); el.toggleDisclosure() })
  el.dTitle=ti                                           // save reference
  return true }                                          // success

function findDisclosureTitle(el) {
  var nds=TENodes(el)
  if (!nds.length) return null // Failure.
  var ch=nds[0]
  if (ch.nodeType===1) return ch
  // Else 1st node is text
  var txt=trimWs(ch.data)
  if (!txt){ //1st node is whitespace only; inspect 2nd node:
    if (nds[1]) return nds[1]
    else return null} // el contains only whitespace.
  // Else 1st node has nonwhite content.  Try splitting at \n:
  var match=/([^\n]*)\n?([\S\s]*)/.exec(txt),
      beforeN=match[1],
      afterN=match[2]
  if (beforeN!==txt){ // \n was present.  Extract beforeN into its own node:
    ch.data=afterN
    var p=doc.createElement('p')
    p.innerHTML=beforeN // If there was initial whitespace (before beforeN, trimmed above), ignore.
    el.insertBefore(p,ch)
    return p }
  // Else no \n.  Put txt in a <p> and return, after stripping following <br>s:
  el.removeChild(ch)
  while (el.firstElementChild && el.firstElementChild.tagName==='BR')
    el.removeChild(el.firstElementChild)
  p=doc.createElement('p')
  p.innerHTML=txt
  el.insertBefore(p,el.childNodes[0]) // OK if childNodes[0] is null.
  return p }
  
function updateDisclosureClasses(el){
  el.classList.remove('disclose'); el.classList.add('disclosure') 
  // Close the disclosure if indicated:
  if (!el.classList.contains('discloseC')) return
  el.classList.remove('discloseC'); el.classList.add('disclosureClosed')
  el.style.overflow='hidden'
  // Make disclosure height of title (so only title is showing).
  // Old IE lacks getComputedStyle, and newer IE returns baffling values
  // for height, influenced by styles of pseudo-elements; just use roughly
  // 1 normal line height (1.2em) with IE property .currentStyle is present;
  // ditto for gcs()height==='auto':
  var ti=el.dTitle,
      h=ti.currentStyle? '1.2em' : gcs(ti).height
  if (h==='auto') h='1.2em'
  el.style.height=h }

function indentDisclosureIfNested(el){
  //Check for ancestor with class .disclosure:
  var par=el, insideDisclosure=false; while(1){ 
    par=par.parentNode
    if (par.tagName==='BODY') break
    if (par.classList.contains('disclosure')) {
      insideDisclosure=true; break }}
  if (insideDisclosure) el.style.marginLeft='1em' }
  
function addDisclosureMinLink(el){
  if (el.classList.contains('discloseNoMin')) {
    el.classList.remove('discloseNoMin')
    return }
  el.classList.remove('discloseMin')
  var p=doc.createElement('p')
  el.appendChild(p)
  p.classList.add('disclosureMin')
  p.innerHTML='&#9650;Minimize'
  p.addEventListener('click', ev=>{
    ev.stopPropagation(); el.toggleDisclosure() })}
  
function toggleDisclosure_(){
  var el               =this,
      isOpening        =el.classList.contains('disclosureClosed'),
      exponent         =0.4,
      openingMultiplier=100,
      closingMultiplier=10
  if (isOpening) {openIt()} else {closeIt()}
  el.classList.toggle('disclosureClosed')
  if (el.disclosureCallback) el.disclosureCallback(isOpening)
  
  function openIt(){
    //1. discover what auto height will be
    var closedHeight= gcs(el).height
    el.style.height  = 'auto'; var openHeight   = gcs(el).height
    el.style.height = closedHeight; el.offsetHeight //reset & repaint before beginning transition
    var heightDiff    =parseFloat(openHeight)-parseFloat(closedHeight),
        heightDuration=Math.round(openingMultiplier*Math.pow(heightDiff,exponent))+'ms'
    el.style.transitionDuration=heightDuration
    //2. set that height explicitly, so transition works (can't transition to/from auto)
    el.style.height = openHeight
    //3. then set it back to auto
    el.transitionMessage='opening' //custom flag
    el.addEventListener('transitionend', onTransitionEnd)
    function onTransitionEnd(ev){
      if (ev.propertyName!=='height') return
      if (el.transitionMessage!=='opening') return
      el.style.height = 'auto'
      el.style.overflow='visible'
      el.removeEventListener('transitionend', onTransitionEnd) }}
  
  function closeIt(){
    el.style.overflow='hidden'
    //forestall resetting to auto, in case i start closing before opening has finished:
    el.transitionMessage='closing' 
    //make current height explicit:
    var openHeight=gcs(el).height
    el.style.height = openHeight
    //force repaint, else assignment above doesn't have to to become effective, 
    //and transition is still from auto to closed height, so transition aborts / is instant:
    el.offsetHeight 
    var closedHeight  =gcs(el.dTitle).height,
        heightDiff    =parseFloat(openHeight)-parseFloat(closedHeight),
        heightDuration=Math.round(closingMultiplier*Math.pow(heightDiff,exponent))+'ms'
    el.style.transitionDuration=heightDuration
    el.style.height=closedHeight 
    var top=el.getBoundingClientRect().top
    if (top<0) {
      var fs=parseFloat(gcs(el).fontSize),
      m =6*fs, 
      y =top-m
      win.scrollBy(0,y) }}
  } // end toggleDisclosure_()


  
/*************************************************************************************/

/********************* scrollToEl ****************************************************/

/*************************************************************************************/

function scrollToEl(s){
  if (s==='?') {setHandlerToPrintScrollString(); return}
  // Expected input string s: '1 2 3' or '1.2.3' =>
  //   scroll to (a bit above) body.children[0].children[1].chidlren[2]
  //   - numbers in s are 1-indexed.
  // '1 2 3v' (for 'visible / verbose') => also highlight el's background and
  //   log result (which may not be same as input, if requested dom-path was invalid)
  if (s.slice(-1)==='v') {var verbose=true; s=s.slice(0,-1)}
  var ret; if (!(ret=findElToScrollTo(s))) return
  var el=ret.el, msg=ret.msg
  // Scroll to a few lines above el - it helps orient me to see the bottom of previous el.
  var fs=parseFloat(gcs(el).fontSize),
      m =6*fs, // Px height of roughly 6 lines - a little less, if line-height is normal, not 1.
      y =el.getBoundingClientRect().top-m
  win.scrollTo(0,y) 
  if (verbose) {
    el.style.border='2px dotted fuchsia'
    log(msg) }}

function setHandlerToPrintScrollString(){
  var el // Closed var, so handler can *un*set background set during previous call.
  win.addEventListener('click',printScrollString)
  function printScrollString(ev){
    if (el) el.style.background='' // The unsetting just mentioned.
    el=ev.target
    el.style.background='red' 
    var msg=el.tagName+' '
    if (el.id) msg+='id:'+el.id+' '
    msg+=scrollString(el)
    log(msg) }}

function scrollString(el){
  if (el===body) return '(NA)'
  var ss='', par=el
  while (true){
    el=par
    par=el.parentNode
    for (var i=1;i<=par.children.length;++i)
      if (par.children[i-1]===el) {
        ss= i+' '+ss; break} //break for
    if (par===body) break} // break while
  return ss}

function findElToScrollTo(s){
  var arr=s.replace('.',' ') // Accept . or \s as delimiter.
           .split  (' ')
           .map    (el=>parseInt(el)) // Validate, mainly in case I
           .filter (el=>!isNaN(el))   // include multiple spaces.
  if (!arr.length) return
  var el=body, msg='scrolled to'
  for (var i=0;i<arr.length;++i){
    var n=arr[i],
        children=Array.from(el.children)
                 .filter(child=>gcs(child).display!=='none'),
        l=children.length
    // If no children, stop looking:
    if (l===0) {
      msg+=' - has no children'
      break }
    // If requested child is above max number, choose last:
    if (n>l) {n=l; msg+=' '+n+' = max'}
    else msg+=' '+n
    el=children[n-1]  }
  return {el, msg} }




/*************************************************************************************/

/********************* INITIALIZATION ************************************************/

/*************************************************************************************/

function standardInit(){ 
  noFouc()
  // Markdown-related:
  addUnderlining()
  addMonospace()  
  formatMdSpan()
  promoteCodeClasses() 
  applyClassesAndIds()
  captureMdBlocks()
  adjustMargins()
  // not md-related:
  attachLabels()
  populateSelects()
  setDisclosures()
  }

function noFouc(){
  timeoutSet(0,()=>{
    var rule
    if (rule= getCssRule('.discloseC::before'))
      rule.style.content='' })}

//Make label's .control be neighboring control.
//Not related to markdown.
function attachLabels(){
// Case: <label id='l' for='i'></label><input id='i'>
// Auto outcome: l.htmlFor==='i', l.control===i
// Case: <label id='l'><input id='i'></label>
// Auto outcome: l.htmlFor==='', l.control===i
// .control is read-only
// I can assign to .htmlFor: assign input el's id (string), not input el itself.
// Presumably input el will always have id, but if not there's no error.
  for (var lbl of qsa('label')) {
    if (lbl.control) continue // Already attached.
    var ps=lbl.previousElementSibling,
        ns=lbl.nextElementSibling
    isInput(ps)||(ps=null)
    isInput(ns)||(ns=null)
    if (!ns && !ps) continue
    if (ps && !ns) {lbl.htmlFor=ps.id; continue}
    if (ns && !ps) {lbl.htmlFor=ns.id; continue}
    // Else inputs immediately before & after:
    // Distinguish between presumed patterns:
    // - <label><input><label><input>...
    // - <input><label><input><label>...
    // If that presumption is wrong, don't rely on this fxn; set for attribute.
    for (var ch of Array.from(lbl.parentNode.children)) {
      if (ch.tagName==='LABEL') {var labelsBefore=true; break}
      if (isInput(ch))          {    labelsBefore=false; break} }
    lbl.htmlFor=(labelsBefore?ns:ps).id }
  
  function isInput(el){
    return (el && 
            /^(BUTTON|INPUT|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA)$/ // Also keygen, deprecated.
            .exec(el.tagName) )}}

//populateSelects() picks up the <select>s with data-opts attributes;
//populateSelect() can be called directly to load options from code.
function populateSelects(){
  for (var sel of qsa('select'))
    if (sel.dataset.opts) populateSelect(sel, sel.dataset.opts) }
  
function populateSelect(sel, opts){
  // Expected opts format: 'Option 1, *Option 2'; * = selected.
  var selected
  for (var opt of opts.split(',')) {
    opt=trimWs(opt)
    //selected = first opt, trumped by '*':
    if (opt.slice(0,1)==='*') {
      opt=opt.slice(1) 
      selected=opt }
    else if (!selected)
      selected=opt
    var optEl=doc.createElement('option')
    optEl.innerHTML=opt
    sel.appendChild(optEl) }
  sel.value=selected }


var htmlColors=[
// WHITE:
[ 'white'               , '#ffffff', 'rgb(255, 255, 255)' ],
[ 'ghostwhite'          , '#f8f8ff', 'rgb(248, 248, 255)' ],
[ 'whitesmoke'          , '#f5f5f5', 'rgb(245, 245, 245)' ],
[ 'mintcream'           , '#f5fffa', 'rgb(245, 255, 250)' ],
[ 'honeydew'            , '#f0fff0', 'rgb(240, 255, 240)' ],
[ 'azure'               , '#f0ffff', 'rgb(240, 255, 255)' ],
[ 'aliceblue'           , '#f0f8ff', 'rgb(240, 248, 255)' ],
[ 'ivory'               , '#fffff0', 'rgb(255, 255, 240)' ],
[ 'lightyellow'         , '#ffffe0', 'rgb(255, 255, 224)' ],
[ 'lemonchiffon'        , '#fffacd', 'rgb(255, 250, 205)' ],
[ 'lightgoldenrodyellow', '#fafad2', 'rgb(250, 250, 210)' ],
[ 'beige'               , '#f5f5dc', 'rgb(245, 245, 220)' ],
[ 'floralwhite'         , '#fffaf0', 'rgb(255, 250, 240)' ],
[ 'cornsilk'            , '#fff8dc', 'rgb(255, 248, 220)' ],
[ 'oldlace'             , '#fdf5e6', 'rgb(253, 245, 230)' ],
[ 'linen'               , '#faf0e6', 'rgb(250, 240, 230)' ],
[ 'antiquewhite'        , '#faebd7', 'rgb(250, 235, 215)' ],
[ 'snow'                , '#fffafa', 'rgb(255, 250, 250)' ],
[ 'seashell'            , '#fff5ee', 'rgb(255, 245, 238)' ],
[ 'papayawhip'          , '#ffefd5', 'rgb(255, 239, 213)' ],
[ 'blanchedalmond'      , '#ffebcd', 'rgb(255, 235, 205)' ],
[ 'bisque'              , '#ffe4c4', 'rgb(255, 228, 196)' ],
// PINK:
[ 'lavenderblush'       , '#fff0f5', 'rgb(255, 240, 245)' ],
[ 'mistyrose'           , '#ffe4e1', 'rgb(255, 228, 225)' ],
[ 'pink'                , '#ffc0cb', 'rgb(255, 192, 203)' ],
[ 'lightpink'           , '#ffb6c1', 'rgb(255, 182, 193)' ],
[ 'hotpink'             , '#ff69b4', 'rgb(255, 105, 180)' ],
[ 'deeppink'            , '#ff1493', 'rgb(255,  20, 147)' ],
[ 'fuchsia'             , '#ff00ff', 'rgb(255,   0, 255)' ],
[ 'magenta'             , '#ff00ff', 'rgb(255,   0, 255)' ],
[ 'mediumvioletred'     , '#c71585', 'rgb(199,  21, 133)' ],
// PURPLE:
[ 'lavender'            , '#e6e6fa', 'rgb(230, 230, 250)' ],
[ 'thistle'             , '#d8bfd8', 'rgb(216, 191, 216)' ],
[ 'plum'                , '#dda0dd', 'rgb(221, 160, 221)' ],
[ 'violet'              , '#ee82ee', 'rgb(238, 130, 238)' ],
[ 'orchid'              , '#da70d6', 'rgb(218, 112, 214)' ],
[ 'mediumorchid'        , '#ba55d3', 'rgb(186,  85, 211)' ],
[ 'blueviolet'          , '#8a2be2', 'rgb(138,  43, 226)' ],
[ 'darkviolet'          , '#9400d3', 'rgb(148,   0, 211)' ],
[ 'darkorchid'          , '#9932cc', 'rgb(153,  50, 204)' ],
[ 'darkmagenta'         , '#8b008b', 'rgb(139,   0, 139)' ],
[ 'purple'              , '#800080', 'rgb(128,   0, 128)' ],
[ 'rebeccapurple'       , '#663399', 'rgb(102,  51, 153)' ],
[ 'indigo'              , '#4b0082', 'rgb( 75,   0, 130)' ],
[ 'mediumpurple'        , '#9370db', 'rgb(147, 112, 219)' ],
[ 'mediumslateblue'     , '#7b68ee', 'rgb(123, 104, 238)' ],
[ 'slateblue'           , '#6a5acd', 'rgb(106,  90, 205)' ],
[ 'darkslateblue'       , '#483d8b', 'rgb( 72,  61, 139)' ],
// BLUE:
[ 'lightcyan'           , '#e0ffff', 'rgb(224, 255, 255)' ],
[ 'paleturquoise'       , '#afeeee', 'rgb(175, 238, 238)' ],
[ 'powderblue'          , '#b0e0e6', 'rgb(176, 224, 230)' ],
[ 'lightblue'           , '#add8e6', 'rgb(173, 216, 230)' ],
[ 'lightsteelblue'      , '#b0c4de', 'rgb(176, 196, 222)' ],
[ 'skyblue'             , '#87ceeb', 'rgb(135, 206, 235)' ],
[ 'lightskyblue'        , '#87cefa', 'rgb(135, 206, 250)' ],
[ 'aqua'                , '#00ffff', 'rgb(  0, 255, 255)' ],
[ 'cyan'                , '#00ffff', 'rgb(  0, 255, 255)' ],
[ 'turquoise'           , '#40e0d0', 'rgb( 64, 224, 208)' ],
[ 'mediumturquoise'     , '#48d1cc', 'rgb( 72, 209, 204)' ],
[ 'darkturquoise'       , '#00ced1', 'rgb(  0, 206, 209)' ],
[ 'deepskyblue'         , '#00bfff', 'rgb(  0, 191, 255)' ],
[ 'dodgerblue'          , '#1e90ff', 'rgb( 30, 144, 255)' ],
[ 'cornflowerblue'      , '#6495ed', 'rgb(100, 149, 237)' ],
[ 'royalblue'           , '#4169e1', 'rgb( 65, 105, 225)' ],
[ 'blue'                , '#0000ff', 'rgb(  0,   0, 255)' ],
[ 'mediumblue'          , '#0000cd', 'rgb(  0,   0, 205)' ],
[ 'darkblue'            , '#00008b', 'rgb(  0,   0, 139)' ],
[ 'navy'                , '#000080', 'rgb(  0,   0, 128)' ],
[ 'midnightblue'        , '#191970', 'rgb( 25,  25, 112)' ],
// YELLOW / ORANGE:
[ 'yellow'              , '#ffff00', 'rgb(255, 255,   0)' ],
[ 'gold'                , '#ffd700', 'rgb(255, 215,   0)' ],
[ 'orange'              , '#ffa500', 'rgb(255, 165,   0)' ],
[ 'darkorange'          , '#ff8c00', 'rgb(255, 140,   0)' ],
[ 'orangered'           , '#ff4500', 'rgb(255,  69,   0)' ],
// RED:
[ 'lightsalmon'         , '#ffa07a', 'rgb(255, 160, 122)' ],
[ 'salmon'              , '#fa8072', 'rgb(250, 128, 114)' ],
[ 'lightcoral'          , '#f08080', 'rgb(240, 128, 128)' ],
[ 'palevioletred'       , '#db7093', 'rgb(219, 112, 147)' ],
[ 'rosybrown'           , '#bc8f8f', 'rgb(188, 143, 143)' ],
[ 'coral'               , '#ff7f50', 'rgb(255, 127,  80)' ],
[ 'tomato'              , '#ff6347', 'rgb(255,  99,  71)' ],
[ 'red'                 , '#ff0000', 'rgb(255,   0,   0)' ],
[ 'crimson'             , '#dc143c', 'rgb(220,  20,  60)' ],
// BROWN:
[ 'peachpuff'           , '#ffdab9', 'rgb(255, 218, 185)' ],
[ 'moccasin'            , '#ffe4b5', 'rgb(255, 228, 181)' ],
[ 'navajowhite'         , '#ffdead', 'rgb(255, 222, 173)' ],
[ 'wheat'               , '#f5deb3', 'rgb(245, 222, 179)' ],
[ 'palegoldenrod'       , '#eee8aa', 'rgb(238, 232, 170)' ],
[ 'khaki'               , '#f0e68c', 'rgb(240, 230, 140)' ],
[ 'darkkhaki'           , '#bdb76b', 'rgb(189, 183, 107)' ],
[ 'burlywood'           , '#deb887', 'rgb(222, 184, 135)' ],
[ 'tan'                 , '#d2b48c', 'rgb(210, 180, 140)' ],
[ 'sandybrown'          , '#f4a460', 'rgb(244, 164,  96)' ],
[ 'darksalmon'          , '#e9967a', 'rgb(233, 150, 122)' ],
[ 'indianred'           , '#cd5c5c', 'rgb(205,  92,  92)' ],
[ 'firebrick'           , '#b22222', 'rgb(178,  34,  34)' ],
[ 'brown'               , '#a52a2a', 'rgb(165,  42,  42)' ],
[ 'darkred'             , '#8b0000', 'rgb(139,   0,   0)' ],
[ 'maroon'              , '#800000', 'rgb(128,   0,   0)' ],
[ 'goldenrod'           , '#daa520', 'rgb(218, 165,  32)' ],
[ 'darkgoldenrod'       , '#b8860b', 'rgb(184, 134,  11)' ],
[ 'chocolate'           , '#d2691e', 'rgb(210, 105,  30)' ],
[ 'peru'                , '#cd853f', 'rgb(205, 133,  63)' ],
[ 'sienna'              , '#a0522d', 'rgb(160,  82,  45)' ],
[ 'saddlebrown'         , '#8b4513', 'rgb(139,  69,  19)' ],
// GREEN:
[ 'palegreen'           , '#98fb98', 'rgb(152, 251, 152)' ],
[ 'lightgreen'          , '#90ee90', 'rgb(144, 238, 144)' ],
[ 'lime'                , '#00ff00', 'rgb(  0, 255,   0)' ],
[ 'limegreen'           , '#32cd32', 'rgb( 50, 205,  50)' ],
[ 'forestgreen'         , '#228b22', 'rgb( 34, 139,  34)' ],
[ 'green'               , '#008000', 'rgb(  0, 128,   0)' ],
[ 'darkgreen'           , '#006400', 'rgb(  0, 100,   0)' ],
[ 'aquamarine'          , '#7fffd4', 'rgb(127, 255, 212)' ],
[ 'mediumspringgreen'   , '#00fa9a', 'rgb(  0, 250, 154)' ],
[ 'springgreen'         , '#00ff7f', 'rgb(  0, 255, 127)' ],
[ 'mediumaquamarine'    , '#66cdaa', 'rgb(102, 205, 170)' ],
[ 'mediumseagreen'      , '#3cb371', 'rgb( 60, 179, 113)' ],
[ 'seagreen'            , '#2e8b57', 'rgb( 46, 139,  87)' ],
[ 'lightseagreen'       , '#20b2aa', 'rgb( 32, 178, 170)' ],
[ 'darkcyan'            , '#008b8b', 'rgb(  0, 139, 139)' ],
[ 'teal'                , '#008080', 'rgb(  0, 128, 128)' ],
[ 'greenyellow'         , '#adff2f', 'rgb(173, 255,  47)' ],
[ 'chartreuse'          , '#7fff00', 'rgb(127, 255,   0)' ],
[ 'lawngreen'           , '#7cfc00', 'rgb(124, 252,   0)' ],
[ 'yellowgreen'         , '#9acd32', 'rgb(154, 205,  50)' ],
[ 'olive'               , '#808000', 'rgb(128, 128,   0)' ],
[ 'olivedrab'           , '#6b8e23', 'rgb(107, 142,  35)' ],
[ 'darkolivegreen'      , '#556b2f', 'rgb( 85, 107,  47)' ],
// GREY:
[ 'darkseagreen'        , '#8fbc8b', 'rgb(143, 188, 139)' ],
[ 'cadetblue'           , '#5f9ea0', 'rgb( 95, 158, 160)' ],
[ 'lightslategrey'      , '#778899', 'rgb(119, 136, 153)' ],
[ 'slategrey'           , '#708090', 'rgb(112, 128, 144)' ],
[ 'steelblue'           , '#4682b4', 'rgb( 70, 130, 180)' ],
[ 'darkslategrey'       , '#2f4f4f', 'rgb( 47,  79,  79)' ],
[ 'gainsboro'           , '#dcdcdc', 'rgb(220, 220, 220)' ],
[ 'lightgrey'           , '#d3d3d3', 'rgb(211, 211, 211)' ],
[ 'silver'              , '#c0c0c0', 'rgb(192, 192, 192)' ],
[ 'darkgrey'            , '#a9a9a9', 'rgb(169, 169, 169)' ],
[ 'grey'                , '#808080', 'rgb(128, 128, 128)' ],
[ 'dimgrey'             , '#696969', 'rgb(105, 105, 105)' ],
[ 'black'               , '#000000', 'rgb(  0,   0,   0)' ]
]

function pickColor(el,property,initialColor){
  // Allow this fxn to be cancelled, which allows it 
  // to be called repeatedly with different args:
  if (el.removePCHandler) el.removePCHandler() // Assigned below
  if (property==='cancel') return // 'cancel' is flag
  // Determine property and initial value:
  property=property||'color'
  initialColor=initialColor||'black'
  // Find initial color in array:
  var iMax=htmlColors.length-1,
      iClr=iMax // Invalid color name => black, last in array
  for (var i=iMax;i>=0;--i){
    if (htmlColors[i][0]===initialColor){
      iClr=i; break }}
  // Set initial value:
  el.style[property]=htmlColors[iClr][0]
  // Set handler and removal fxn:
  win.addEventListener('keydown',pickColorHandler)
  // For removal, must save a reference to the instance of
  // pickColorHandler() in this closure:
  el.removePCHandler=()=>
    win.removeEventListener('keydown',pickColorHandler)
  // Handler:
  function pickColorHandler(ev){
    // Only handle up & down:
    if (!eq(ev.keyCode,38,40)) return
    ev.preventDefault()
    if (ev.keyCode===40 && iClr<iMax) ++iClr // up
    if (ev.keyCode===38 && iClr>0)    --iClr // down
    el.style[property]=htmlColors[iClr][0] 
    log(htmlColors[iClr].join(' ')) }} // Log name + hex + rgb.
