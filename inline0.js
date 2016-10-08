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
  log(doc.URL)
  }










