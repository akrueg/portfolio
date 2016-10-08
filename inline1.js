'use strict'
standardInit()
inlineFormattingInit()
//scrollToEl('18v')
var refresh=111111

// example 1
bindCheck(Ctr01chkS2Display,Ex01s2,'display','inline-block','inline')
Ctr01chkS3Display.onclick=()=>{
  debugger
  Ctr01chkS2Display.checked=false
  Ex01s2.style.display='inline'
  Ex01s1.style.display   =Ex01s3.style.display   =Ctr01chkS3Display.checked?'inline-block':'inline'
  Ex01s1.style.background=Ex01s3.style.background=Ctr01chkS3Display.checked?'pink':'#40bf77' }

// example 2 
bindCheck (Ctr02chkStrut      ,Ex02s1,'display'   ,'inline-block','none')
bindOption(Ctr02optFontFamily1,Ex02  ,'fontFamily','fs')
bindOption(Ctr02optFontFamily2,Ex02  ,'fontFamily','dj')
bindCheck (Ctr02chkNoStrut    ,Ex02  ,'fontSize'  ,'50px'        ,'80px')
Ctr02optDisplay1.onclick=()=>{
  Ex02s2.style.display   ='inline'
  Ex02s2.style.background='#40bf77' }
Ctr02optDisplay2.onclick=()=>{
  Ex02s2.style.display   ='inline-block'
  Ex02s2.style.background='pink' }
Ctr02slider1.oninput=()=>{
  Ctr02chkLineHeight.checked=false
  Ex02s2.style.lineHeight=Ctr02slider1.value+'px' }
Ctr02chkLineHeight.onclick=()=>
  Ex02s2.style.lineHeight=Ctr02chkLineHeight.checked? 'normal' : Ctr02slider1.value+'px'
Ctr02chkTriangles.onclick=()=>{
  // Strut full height:
  Ctr02chkNoStrut.checked=false
  Ex02    .style.fontSize  ='80px'
  // Strut visible:
  Ctr02chkStrut  .checked=true
  Ex02s1   .style.display   ='inline-block'
  // Free Sans:
  Ctr02optFontFamily1     .checked=true
  Ex02    .style.fontFamily='fs'
  // Show pink inline box:
  Ctr02optDisplay2     .checked=true
  Ex02s2    .style.display   ='inline-block'
  Ex02s2    .style.background='pink'
  // Line-height controlled by slider, not normal:
  Ctr02chkLineHeight      .checked=false
  Ex02s2          .style.lineHeight=Ctr02slider1     .value+'px'
  Ctr02spTriangles.style.color     =Ctr02chkTriangles.checked? 'red'   : 'rgba(0,0,0,0)'
  Ctr02p2         .style.display   =Ctr02chkTriangles.checked? 'unset' : 'none' }
Ctr02optPx1.onclick=()=>setCtr02optPx(74)
Ctr02optPx2.onclick=()=>setCtr02optPx(75)
Ctr02optPx3.onclick=()=>setCtr02optPx(76)
Ctr02optPx4.onclick=()=>setCtr02optPx(117)
Ctr02optPx5.onclick=()=>setCtr02optPx(118)
Ctr02optPx6.onclick=()=>setCtr02optPx(119)
function setCtr02optPx(lh){
  Ctr02slider1.value=lh
  Ex02s2.style.lineHeight=lh+'px' }

// Ruler:
enableDS(ruler,{sizeEdges:[0,0,0,0],sizeCorners:[0,0,0,0]})
btnRuler.onclick=()=>
  ruler.style.display=gcs(ruler).display==='none'? 'unset' : 'none'
ruler.ondblclick=()=>{
  log('dblclick')
  ruler.style.display='none'}

// example 3
Ctr03sel1.onchange=()=>{
  var l=labelOf(Ctr03sel1)
  Ex03s.style.display=l
  Ex03s.style.background=l==='inline'? '#40bf77' : 'pink' }
Ctr03slider1.oninput=()=>Ex03s .style.margin     =Ctr03slider1.value+'px'
Ctr03slider2.oninput=()=>Ex03s .style.borderWidth=Ctr03slider2.value+'px'
Ctr03slider3.oninput=()=>Ex03s .style.padding    =Ctr03slider3.value+'px'

// example 4
Ctr04slider1.oninput=()=>Ex04s .style.padding    =Ctr04slider1.value+'px'
Ctr04slider2.oninput=()=>Ex04p .style.lineHeight =Ctr04slider2.value



