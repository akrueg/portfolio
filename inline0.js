'use strict'

function bindSelect(sel,el,style,useLabels){
  sel.onchange=()=>
    el.style[style]=useLabels? labelOf(sel) : sel.value }
function labelOf(sel){
  return sel.options[sel.selectedIndex].value }
function bindText(txt,el,style){
  txt.oninput=()=>el.style[style]=txt.value }
function bindCheck(chk,el,style,tval,fval){
  chk.onclick=()=>el.style[style]=chk.checked? tval : fval }
function bindOption(opt,el,style,value){
  opt.onclick=()=>el.style[style]=value }

function formatFormulae(){
  for (var el of qsa('.formula, .formulaMain, .formulaTable')) {
    el.innerHTML=el.innerHTML
      // a_b_ => a<sub>b</sub>
      .replace(/_([^_]*)_/g,'<sub>$1</sub>') 
      // 10[cm] => 10<span class='units'>cm</span>
      .replace(/\[([^\]]*)\]/g,'<span class="units">$1</span>') }}

function inlineFormattingInit(){
  var p=doc.createElement('p')
  p.id='pDisclaimer'
  p.innerHTML=  
    'The observations below are based on the behavior of Chromium / '
  + 'Chrome browser.  The Spec leaves several implementation details to '
  + 'the browser, including the definition of {line-height: normal}, '
  + 'which affects most inline formatting calculations.'
  body.insertBefore(p,body.children[1])
  addNav() }

// Add links to GitHub versions of previous inline page / portfolio home / 
// next inline page.  Portfolio homepage will contain the links to CodePen
// and GitHub html / css / js files.  If this is the CodePen version of the 
// page, make links target '_blank', since CP doesn't allow pens to navigate
// current tab.
function addNav(){
  // Figure out which page this is, to determine 'previous' & 'next'.
  // Link formats:
  //   GitHub:  https://akrueg.github.io/portfolio/inline1.html
  //   CodePen: https://codepen.io/akrueg/pen/rLxzdE
  var inCodePen=/codepen/i.test(doc.URL),
      // The CodePen link format above is actually doc.referrer, while
      // doc.URL is a long, nasty string:
      url=parseUrl(inCodePen?doc.referrer : doc.URL),
      thisPg=url.pageNoExt             // Remove '.html' from GitHub.
                .replace('inline',''), // Remove 'inline' from GitHub.
      ppGitHub= ['1'     ,'21'    ,'22'    ,'23'    ,'31'    ,'32'    ,'33'    ,'4'     ],
      ppCodePen=['rLxzdE','KgaEwP','mAWdYY','VKpjJq','RRGKqq','kkBjPW','VKpBaA','OXRWaY'],
      i=(inCodePen? ppCodePen : ppGitHub).indexOf(thisPg)
  if (i===-1) return
  // Make:  <p id='pNav'>
  //          <a>Previous</a> - <a>Home</a> - <a>Next</a>
  //        </p>
  var pNav=newEl('p','pNav'),
      base='https://akrueg.github.io/portfolio/'
    // ,
    //   bullet=' \u2022 '
  body.insertBefore(pNav,body.children[1]) // Insert after <h>.
  // Previous:
  if (i>0){
    addChild(pNav,link('Previous',base+'inline'+ppGitHub[i-1]))
    // addText (pNav,bullet) 
    addChild(pNav,bullet())
  }
  // Home:
  addChild  (pNav,link('Home',    base))
  // Next:
  if (i<ppGitHub.length-1){
    addChild(pNav,bullet())
    // addText (pNav,bullet)
    addChild(pNav,link('Next'    ,base+'inline'+ppGitHub[i+1])) }
  
  function link(text, url){
    var a=newEl('a','','',text)
    a.href=url
    a.target=inCodePen? '_blank' : '_self'
    return a }

  function bullet(){
    return newEl('span','','','&bull;') }
}




