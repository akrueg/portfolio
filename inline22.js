standardInit()
inlineFormattingInit()
//scrollToEl('18 5 2 1v')
var refresh=11111

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
bindCheck(Ctr07chk1,Ex07p1s5,'display'   ,'inline-block','' )  
var lg='linear-gradient(to top right,'
                      +'#40bf77,'
                      +'#40bf77 20%,'
                      +'transparent 45%,'
                      +'transparent 65%,'
                      +'#40bf77 80%,'
                      +'#40bf77)'
Ctr07chk2.onclick=()=>{
  if (Ctr07chk2.checked){
    Ex07p1s2.style.display='inline'
    Ex07p1s2.style.background=Ctr07chk4.checked? lg : '#40bf77' }
  else {
    Ex07p1s2.style.display=Ex07p1s2.style.background='' }}

bindCheck(Ctr07chk3,Ex07p1s4,'display'   ,'inline-block','' )  

Ctr07chk4.onclick=()=>{
  if (Ctr07chk4.checked){
    Ctr07chk2.checked=true
    Ex07p1s2.style.display='inline'
    Ex07p1s2.style.background=lg }
  else {
    if (Ctr07chk2.checked) Ex07p1s2.style.background='#40bf77' }}




