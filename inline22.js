standardInit()
inlineFormattingInit()

// example 1
bindSelect(Ctr01sel1,Ex01p1  ,'lineHeight',true)
bindSelect(Ctr01sel2,Ex01p1s1,'display'   ,true)

// example 4
Ctr04sel1.onchange=()=>{
  var l=labelOf(Ctr04sel1)
  Ex04p1s2.style.display=l
  Ex04p1s2.style.background=l==='inline'? '#40bf77' : 'pink' }

// example 6
bindCheck(Ex06chk1,Ex06s3,'background','pink'        ,'unset')  

// example 7
bindCheck(Ex07chk1,Ex07p1s5,'display'   ,'inline-block','none' )  
bindCheck(Ex07chk2,Ex07p1s4,'display'   ,'inline-block','none' )  
Ctr07sel1.onchange=()=>{
  var l=labelOf(Ctr07sel1)
  Ex07p1s2.style.display=l
  Ex07p1s2.style.background=l==='inline'? '#40bf77' : 'pink' }





