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
  + 'the browser, including the definition of {line-height:normal}, '
  + 'which affects most inline formatting calculations.'
  body.insertBefore(p,body.children[1])
  addNav() }


function addNav(){
  var slugs, slugIdx, protocol, path, slug, editors, iThis, isFirst, isLast
  init()
  if (iThis===-1) return // Can't identify current url.
  // <div id='dNav'>
  //   <a>Previous</a> - <a>Index</a> - <a>Next</a> - <span>  ?  </span>
  //   <div>
  //     Codepen forces links to open in new tab (or in this 
  //     <iframe> <label>recursively</label> <input>).  Copy
  //     & paste to navigate this tab:
  //     <div> <p>Prv:</p> <p>codepen.io/akrueg/pen/KgaEwP</p> </div>
  //     <div> <p>Idx:</p> <p>codepen.io/akrueg/pen/KgaEwP</p> </div>
  //     <div> <p>Nxt:</p> <p>codepen.io/akrueg/pen/KgaEwP</p> </div>
  //   </div>
  // </div>
  var dNav, url, links=[], sp, d2, d3, p, bullet=' \u2022 '
  dNav=doc.createElement('div'); dNav.id='dNav'
  body.insertBefore(dNav,body.children[1]) // Assume doc begins with <h#><p>
  addLinks()
  sp=addChild(dNav,'span')
  addText(sp,'   ?   ')
  d2=addChild(dNav,'div')
  d2.classList.add('displayNone')
  sp.addEventListener('click',()=>d2.classList.toggle('displayNone'))
  addManualLinks()
  
  function init(){
    slugIdx='BLoJxB'
    slugs=['rLxzdE','KgaEwP','mAWdYY','VKpjJq','RRGKqq','kkBjPW','VKpBaA','OXRWaY']
    var url=parseUrl(doc.referrer)
    protocol=url.protocol // https://
    path    =url.path     // codepen.io/akrueg/pen/
    slug    =url.page     // KgaEwP
    editors =url.query    // ?editors=1010
    iThis   = -1
    for (var i=0;i<slugs.length;++i){if (slugs[i]===slug) iThis=i}
    isFirst=(iThis===0)
    isLast =(iThis===slugs.length-1) }

  function addLinks(){
    if (!isFirst) {
      url=protocol+path+slugs[iThis-1]+editors
      links.push(addChild(dNav,link('Previous',url)))
      addText(dNav,bullet) } // bullet-divider
    url=protocol+path+slugIdx+editors
    links.push(addChild(dNav,link('Index',url)))
    addText(dNav,bullet)
    if (!isLast){
      url=protocol+path+slugs[iThis+1]+editors
      links.push(addChild(dNav,link('Next',url)))
      addText(dNav,bullet) }}
  
  function addManualLinks(){
    addText(d2,'CodePen forces links to open in new tabs '
             + '(or in this \u003ciframe> ') // I think I actually don't have to escape < in a call to doc.createTextNode.
    var lbl=addChild(d2,'label')
    addText(lbl,'recursively')
    addText(d2,' ')
    var chk=addChild(d2,'input')
    lbl.htmlFor=chk.id='dNavChk'
    chk.type='checkbox'
    chk.addEventListener('click',()=>
      links.forEach(l=>
        l.target=chk.checked?'_self':'_top' ))
    addText(d2,').  Copy & paste to navigate this tab:')
    if (!isFirst){
      d3=addChild(d2,'div')
      p=addChild(d3,'p'); addText(p,'Previous:')
      url=path+slugs[iThis-1]
      p=addChild(d3,'p'); addText(p,url) }
    d3=addChild(d2,'div')
    p=addChild(d3,'p'); addText(p,'Index:')
    url=path+slugIdx
    p=addChild(d3,'p'); addText(p,url)
    if (!isLast){
      d3=addChild(d2,'div')
      p=addChild(d3,'p'); addText(p,'Next:')
      url=path+slugs[iThis+1]
      p=addChild(d3,'p'); addText(p,url) }}

  function addChild(parent, child){
    if (typeof child==='string') child=doc.createElement(child)
    parent.appendChild(child)
    return child }
    
  function link(text, url){
    var a=doc.createElement('a')
    a.innerHTML=text
    a.href=url
    a.target='_blank'
    return a }
  
  function addText(el,text){
    var tn=doc.createTextNode(text)
    el.appendChild(tn)
    //el.innerHTML+=text 
    }
  }










