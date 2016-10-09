standardInit()
inlineFormattingInit()
formatFormulae()

// example 1
Ctr01chk1.onclick=()=>
  Ex01marker3.style.display=
  Ex01marker4.style.display=Ctr01chk1.checked?'unset':'none'
Ctr01chkIB.onclick=()=>{
  Ex01p1       .style.background=Ctr01chkIB.checked?'lightblue':''
  Ex01inlineBox.style.display   =Ctr01chkIB.checked?'inline':'' }
bindCheck(Ctr01chkNotIB,Ex01notInlineBox,'display','inline','')

// example 2
Ctr02rng1.oninput=()=>
  Ex02sLH.innerHTML=
  Ex02s1.style.lineHeight=Ctr02rng1.value + 'px'
bindCheck(Ex02chkVA,Ex02s1     ,'vertical-align','top','') 
bindCheck(Ex02chk1 ,Ex02marker1,'top'           ,'50%','')

// example 6
Ctr06rng1.oninput=()=>{
  Ex06s1.style.fontSize=Ctr06rng1.value+'px'
  Ex06s1.innerHTML=Ctr06rng1.value}
Ctr06chk1.onclick=()=>{ 
  Ex06strut.style.display   =Ctr06chk1.checked? 'inline-block' : ''
  Ex06s1   .style.background=Ctr06chk1.checked? 'pink'         : '' }
  



