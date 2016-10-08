'use strict'

function addUnderlining(){
  // raw text:     markdown:                         output of this fxn:
  // ____text____  _<strong><em>text</em></strong>_  <u>text</u>
  for(var em of qsa('strong>em')) {
    var strong=em.parentElement //Query returns the <em>s; I want the <strong>s.
    //must be preceded & followed by textnodes:
    var ps=strong.previousSibling; if (!ps || ps.nodeType!==3) continue
    //and bounded by _:
    var dta=ps.data; if (dta.slice(-1)!=='_') continue
    var ns=strong.nextSibling; if (!ns || ns.nodeType!==3) continue
    dta=ns.data; if (dta.slice(0,1)!=='_') continue
    //Else found match.  Remove extra underscores:
    ps.data=ps.data.slice(0,-1); ns.data=ns.data.slice(1)
    var parent=strong.parentNode,
        u=doc.createElement('u')
    u.innerHTML=em.innerHTML
    parent.insertBefore(u,strong)
    parent.removeChild(strong) }}

function addMonospace(){
  // _.  text  ._ => 
  // Make text monospace-pre;
  // preserve leading / trailing spaces (trim periods).
  for(var el of qsa('em')) {
    // First (probably only) child must be textnode;
    // md <strong>s / <em>s can contain inline elements:
    // _<u>text</u>_ => <em><u>text</u></em>.
    // Textnode must start with '.':
    var fc=el.firstChild
    if (!fc || fc.nodeType!==3 || fc.data.slice(0,1)!=='.') continue
    var lc=el.lastChild
    if (!lc || lc.nodeType!==3 || lc.data.slice(-1)!=='.') continue
    var sp=doc.createElement('span')
    sp.innerHTML=el.innerHTML.slice(1,-1) // Strip periods.
    sp.style.whiteSpace    ='pre';
    sp.style.fontFamily    ='monospace,monospace';
    sp.style.fontSize      ='.92em'
    var par=el.parentElement
    par.insertBefore(sp,el)
    par.removeChild(el) }}

function formatMdSpan(){
  // Hijack markdown's syntax _text_ / *text* 
  // (and __text__ / **text** for backwards compatibility)
  // when followed by {code}: #id.class1.classN color~!_|/
  // ~ ! _ | mean italic, bold, underlined, monospace-pre.
  // / also indicates mono, since | can't be escaped inside md table.
  // Eg. _red_{#span1 red!} => bold red, id='span1'.
  // OK to escape the underscore, which otherwise confuses CodePen's syntax highlighting:
  //   _text_{\_} => md strips to _text_{_} before I see it.
  var els=qsa('strong, em') // **text** = <strong></strong> or *text* = <em></em>
    .filter(el=>!el.qsa('em').length)   // not ***text*** = <strong><em></em></strong>
  for(var el of els) {
    var ns=el.nextSibling
    if (!ns || ns.nodeType!==3) continue // Must be followed by textnode.
    var dta=ns.data,
        match=dta.match(/^{[\S\s]*?}/)
    if (!match) continue                 // Must be followed by {...}.
    addColorsToThis() }

  function addColorsToThis(){
    var code=match[0]
    ns.data=ns.data.slice(code.length) 
    code=code.slice(1).slice(0,-1) // Strip {}
    // Extract id and classes if present:
    var id               = ''                         ,
        classes          = []                         ,
        rxAny            = /([\S\s]*)/                ,
        rxId             = /#([^ \.]*)/               ,
        rxExtractId      = newRx(rxAny,rxId,rxAny)    ,
        rxClass          = /\.([^ \.]*)/              ,
        rxExtractClasses = newRx(rxAny,rxClass,rxAny) 
    if (match=rxExtractId.exec(code)){
      id=match[2]; code=match[1] + match[3] }
    while (match=rxExtractClasses.exec(code)){
      classes.push(match[2]); code=match[1] + match[3] }
    // \s only necessary to separate id/class from color.  May now be stripped:
    code=code.replace(/[ ]/g,'') 
    // Check for formatting chars:
    var bld   =/!/ .test(code),
        ital  =/~/ .test(code),
        under =/_/ .test(code),
        mono  =/\|/.test(code) || /\//.test(code)
    code=code.replace('!','') // Strip ! ~ _ | /  
             .replace('~','')
             .replace('_','')
             .replace('|','').replace('/','')
    // Replace <em>/<strong> with <span>:
    var sp=doc.createElement('span'),
        parent=el.parentElement
    parent.insertBefore(sp,el); parent.removeChild(el)
    // Apply text, id, classes, formatting, & color:
    sp.innerHTML=el.innerHTML 
    if (id) sp.id=id
    classes.forEach(cls=>sp.classList.add(cls))
    if (bld  )  sp.style.fontWeight     = 'bold'
    if (ital )  sp.style.fontStyle      = 'italic'
    if (under)  sp.style.textDecoration = 'underline'
    if (mono ){ sp.style.whiteSpace     = 'pre'                 ; 
                sp.style.fontFamily     = 'monospace,monospace' ;
                sp.style.fontSize       = '.92em'               }
    if (code )  sp.style.color=code //Any residual text is color.
  }}

function promoteCodeClasses(){
// Md code fence applies classes to <code> in <pre><code> block; 
// transfer classes to <pre>; suffix <code> classes with '_code':
//   /([-\w]  \w = [A-Za-z0-9_]; legal css class characters = \w and hyphen
//   +        any string of at least 1
//   )        becomes capture group (implicitly group 1)
//   /g       global: repeat for each match (each class)
//   $1       replace with itself...
//   _code    ...suffixed with '_code'  
  for (var el of doc.qsa('pre>code')) {
    var cn=el.className
    if (cn!=='') {
      el.parentNode.className=cn
      el.className=cn.replace(/([-\w]+)/g,'$1_code') }}}

function applyClassesAndIds(){
  for (var meta of body.qsa('meta')) applyMetaIC(meta)
  //I'm no longer liking the methods below.
  for (var el of doc.qsa('cl')) addClassTo(el)
  for (el of doc.qsa('id')) addIdTo(el) }

function applyMetaIC(meta){
  //<meta i='id' c='c1 c2'> => Give top-level ancestor (under body)
  //that id and those classes:
  var i=meta.getAttribute('i')||'',
      c=meta.getAttribute('c')||''
  if (!i && !c) return
  var par=meta.parentElement
  while (par && par.parentElement!==body) par=par.parentElement
  if (!par.id && i) par.id=i 
  if (c) for (var cl of c.split(' ')) par.classList.add(cl) 
  // Remove <meta> and space before it, so that space doesn't get
  // counted toward margins; put margin-signalling spaces after <meta>:
  var sib=meta.previousSibling
  if (sib && sib.nodeType===3){
    var s=/([ ]*)$/.exec(sib.data)[1].length // num \s at end
    if (s) sib.data=sib.data.slice(0,-s) }
  meta.parentElement.removeChild(meta) }

// Using custom <cl> tag with custom attributes a, b, etc (<cl a b>):
// for el containing <cl>: add classes a, b, etc.
// Note: el.attributes is not reports attribute.name as all lower-case:
//   <cl A> will add class 'a', not 'A'.
// Ancestors of separation N, up to but not including body:
// add classes a_N, b_N, etc; they can be styled: ancestor[class^=a]{}.
function addClassTo(el){
  var classes=[], i
  for (var att of Array.from(el.attributes)) classes.push(att.name)
  var i=0; do {
    el=el.parentElement
    for (var cl of classes) el.classList.add(cl+(i===0?'':'_'+i))
    ++i
    } while (el.parentElement.tagName!=='BODY') }
// custom <id> tag with custom attribute x (<id x>):
// el containing <id>: if no id, id=x
// ancestors of separation N, up to but not including body:
// if no id, id=x_N
function addIdTo(el){
  var id=el.attributes[0].name
  var i=0; do {
    el=el.parentElement
    if (el.id==='') el.id = id+(i===0?'':'_'+i)
    ++i
    } while (el.parentElement.tagName!=='BODY') }
  
function captureMdBlocks(){
  //look for classes mdCaptureStart[optional suffix]
  for (var el of doc.qsa('[class*=mdCaptureStart]')) {
    //extract the suffix:
    for (var cls of Array.from(el.classList)) {
      var suffix  = '', 
          matches = /^mdCaptureStart([\S\s]*)/.exec(cls)
      if (matches) {
        suffix=matches[1]
        // Replace mdCaptureStart* class with mdCaptor:
        el.classList.remove(cls)
        el.classList.add('mdCaptor')
        break }}
    //Capture younger siblings until
    //- same-suffix capture-end flag is encountered
    //- same-suffix capture-start flag is encountered;
    //  different-suffix capture-start is sub block
    //- doc ends:
    var sib=siblingToCapture(el)
    while (sib) {
      var captured=sib
      sib=siblingToCapture(sib)
      captured.parentElement.removeChild(captured)
      el.appendChild(captured) }
    } //end of for-loop for one capturing el

  function siblingToCapture(el){
    var sib = el.nextSibling
    
    // Case: doc ends without explicitly closing md capture block.
    // el is last element in doc.  Stop capturing.
    if (!sib) return null 
    
    // Case: text node / comment / exotic node.  Capture it in case it's
    // space after a closing tag (</tag>\s\s), which adjustMargins() makes use of.
    if (sib.nodeType!==1) return sib
    
    // Case: sib is a capture-end element (<div class='mdCaptureEnd'></div>),
    // with suffix (possibly '') matching capture-start element.  Remove 
    // sib and stop capturing:
    if (sib.classList.contains('mdCaptureEnd'+suffix)) {
      sib.parentElement.removeChild(sib)
      return null }
    
    // Case: sib is another capture-start with same suffix as el.
    // Short-hand way of terminating one capture-block and starting another
    // (whereas different suffix indicates nested capture block).
    // Stop capturing:
    if (sib.classList.contains('mdCaptureStart'+suffix)) return null
    
    // Case: otherwise, capture this sib:
    return sib }}


/* Markdown tag generation:
-> may contain
=> must contain

body -> h
     -> p     -> code
              -> br
     -> pre   => code
     -> table => thead => tr => th -> ?
              => tbody => tr => td -> ?
     -> u/ol  => li    -> p...
                       -> pre...
                       -> u/ol...
                       -> blockquote?...
                       -> br
     -> blockquote     => p...
                       -> blockquote...
     -> non-md block   -> anything

Positions in which I can place spaces as signals:

- <non-md>   : after closing tag: <div>x</div>\s
- <pre><code>: end of only (thus last) textnode: <pre><code>x \n</code></pre> (see note 1)
- <p>        : end of last textnode: <p>x </p>
                                   : <p>v<span>w</span>x </p>
                                   : <p><span>x</span> </p>                            (2)
- <li>       : end of last textnode: <li>x </li>                               
             : end of last textnode before sublist: <li>x \n\n<u|ol>                   (3)
Notes:
1) MD places </code></pre> after \n.  
   2 \ns before sublist after textnode: <li>x \n\n<ul>...</ul></li>
   Allow \n* after [ ]*: /[ ]*(?=\n*$)/.
2) In <li> & <p>, MD preserves \s after closing inline tag:
   - html: <li><span>x</span> </li>
   - md:   <li>`x` </li>, <li>*x* </li>
3) In either of the above cases, textnode can end with at most one \s or <br>.
   Md converts 2+ \s into <br> as it usually does before \n, though in these
   cases <br> collapses: <li>x<br></li> / <li>x<br><u|ol>.
*/

function adjustMargins(){detectSpacesIn(body)}   //Initiate recursion:

function detectSpacesIn(el) {
  var s=0
  // Check for non-markdown block:
  if (!(s=spacesAfterClosingTagOf(el)))
    // Else check for <pre><code>, <li>, or <p>:
    if (el.tagName==='PRE' && el.children[0] && el.children[0].tagName==='CODE')
      s=spacesAtEndOf(el.children[0])
    else if (el.tagName==='LI') {
      // If el contains a sublist,
      // a) don't need to checkfor spacesAtEndOf(el),
      //    because they'll be contained in the last <li> of the sublist 
      //    or a <p> after the sublist;
      // b) do need to check for the special textnode+sublist case (see below).
      if (!handleSublistCase(el)) // Retval 0 => no sublist; keep checking:
        s=spacesAtEndOf(el) }
    else if (el.tagName==='P')
      s=spacesAtEndOf(el)
  if (s>0) adjustBottomMarginOf(el, s)
  // Recurse:
  if (/^(BODY|BLOCKQUOTE|UL|OL|LI)$/.test(el.tagName) || 
      el.classList.contains('mdCaptor')) // Also adjust margins inside capture blocks.
    detectSpacesInChildrenOf(el) }

function detectSpacesInChildrenOf(el) {
  var rx=/a^/ //Always fail - seems like a reasonable way to initialize a regex var.
  switch (el.tagName){
    case 'BODY'         : rx=/[\S\s]*/  ; break   //Always match: check all toplevel els.
    case 'UL': case 'OL': rx=/^LI$/; break
    case 'LI'           : rx=/^(P|PRE|[OU]L|BLOCKQUOTE)$/; break
    case 'BLOCKQUOTE'   : rx=/^(P|BLOCKQUOTE)$/ }
  if (el.classList.contains('mdCaptor')) rx=/[\S\s]*/ // Check everything in capture block.
  for (var ch of Array.from(el.children)) 
    if (rx.test(ch.tagName)) detectSpacesIn(ch) }

function spacesAfterClosingTagOf(el){
  var ns=el.nextSibling
  if (!ns || ns.nodeType!==3) return 0
  return /^[ ]*/.exec(ns.data)[0].length }  // \s includes \n; [ ] doesn't.
  
// Count spaces at end of last textnode
// OR special <li>...<br></li> case:
function spacesAtEndOf(el){
  var lc=el.lastChild
  if (!lc) return 0
  if (el.tagName==='LI' && lc.tagName==='BR') {
    el.removeChild(lc)
    return 2 }
  return spacesAtEndOfTextNode(lc) }

// Spaces at end, after last \S (non-whitespace) content
// but on same line, not after \n; 
// spaces after \S and after \n are just tag indentation.
function spacesAtEndOfTextNode(tn){
  if (!tn || tn.nodeType!==3) return 0
  var trailing=/(\s*)$/.exec(tn.data)[1]     // trailing whitespace
  return /([ ]*)/.exec(trailing)[1].length } // \s at beginning of whitespace

/* Blank line before sublist => p+sublist case
No blank line before sublist => textnode+sublist case:

textnode+sublist:        

        RedCarpet:     KramDown:
        ----------     ----------------
- 1*    <ul>           <ul>
  - 2   <li>1**          <li>1**
                           <ul>
        <ul>                 <li>2</li>
        <li>2</li>         </ul>
        </ul></li>       </li>
        </ul>          </ul>

p+sublist:
        ------------   ----------------
- 1     <ul>           <ul> 
        <li><p>1</p>     <li>
  - 2                      <p>1</p>
        <ul>         
        <li>2</li>         <ul>
        </ul></li>           <li>2</li>
        </ul>              </ul>
                         </li>
                       </ul>
                         
* is a position in which I can put spaces
** is the position in which md puts either 1 \s or <br> as a result
Let these set the top margin of the sublist, interpreting <br> as 2 spaces. */
function handleSublistCase(el) {
  // Verify sublist:
  for (var i=0;i<el.children.length;++i)
    if (/^[O|U]L$/.test(el.children[i].tagName)){
      var sl=el.children[i],
          prev=sl.previousElementSibling
      break }
  if (!sl) return 0 // Signal 'Keep checking.'
  if (prev && prev.tagName==='P') return 1 // P+sublist case; signal 'Done.'
  if (prev && prev.tagName==='BR') {
    el.removeChild(prev)
    adjustTopMarginOfSublist(sl, 2) // <Br> counts as 2 spaces.
    return 1 }
  // Else check for spaces at end of textnode before sublist:
  var s=spacesAtEndOfTextNode(sl.previousSibling)
  if (s) adjustTopMarginOfSublist(sl,s) 
  return 1 }

function adjustTopMarginOfSublist(sl, s){
  sl.style.marginTop=s+'em' }

function adjustBottomMarginOf(el, s){ // and possibly top margin of next el.
// Meaning of number of spaces depends on the two elements' default interaction:
// Where default is 1 or 2em margin, 1 or 2 spaces signals no margin
// (so 0 spaces can mean 'default', so things mostly space themselves with
// minimal work by me).  Figure out how many lines would occur by default
// between these els, then interpret how many spaces the number s indicates:
  var el2=elAfter(el)
  if (!el2) return // No point in adjusting bottom margin of last el.
  var l = linesBetween(el, el2, s)
  if (l===0) //need to turn of both margins:
    el.style.marginBottom=el2.style.marginTop=0
  else
    el.style.marginBottom=l+'rem' }

function elAfter(el){
  var sib=el.nextElementSibling
  while (sib && gcs(sib).display==='none') sib=sib.nextElementSibling
  // If no (displaying) sib after el, check el's parent:  
  if (!sib && el.parentElement.tagName!=='BODY') sib=elAfter(el.parentElement)
  return sib }

function linesBetween(el1, el2, s){
  // Default lines between === the larger margin (not sum, due to collapse):
  var linesAfterEl1 =defaultLines(el1,true),
      linesBeforeEl2=defaultLines(el2),
      def=Math.max(linesAfterEl1,linesBeforeEl2)
  // Specifying the default means '0':
  return (s===def)?0:s }

function defaultLines(el, bottom){
// Convert px to em by dividing by font-size.
// <H#> margins specified in rems; others in ems.
// Round in case of calculation error (like 0.1 + 0.2 === 0.30000000000000004).
  var marginWidth = gcs(el)[bottom?'marginBottom':'marginTop'],
      baseEl      = /^H[1-6]$/.test(el.tagName)?html:el,
      fontSize    = gcs(baseEl).fontSize
  return round(parseFloat(marginWidth) / parseFloat(fontSize)) }  
  
