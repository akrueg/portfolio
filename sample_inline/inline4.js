'use strict'
standardInit()
inlineFormattingInit()

// example 2
Ctr02expand  .onclick=()=>{Ex02pane1.style.display='none';
                           Ex02pane2.style.display='block' }
Ctr02contract.onclick=()=> Ex02pane1.style.display=
                           Ex02pane2.style.display='' 
qsa('.Ex02tbl').forEach(tbl=>
  tbl.querySelector('tbody').children[0].children[2].classList.add('beaver') )
Ctr02rng.oninput=()=>{
  var n=7-Ctr02rng.value,
      vas=['top','super','text-bottom','baseline','middle','text-top','sub','bottom']
  setVA(vas[n])
  setOffsets(n); setBars(n) }
function setVA(va){
  Ctr02out.innerHTML=Ex02sMove.style.verticalAlign=Ex02sImg.style.verticalAlign=va }
function setOffsets(i){
  //          to  sp  tb  ba  mi  tt  sb  bo
  var offL1=[.60,.76,.30,.50,.56,.30,.76,.60],
      offR1=[.60,.00,.30,.00,.19,.30,.00,.60],
      offT1=[.60,.50,.80,.70,.46,.00,.85,.60],
      offB1=[.60,.40,.00,.20,.35,.80,.00,.60],
      offL2=[.60,.00,.60,.00,.00,.60,.00,.60],
      offR2=[.60,.50,.60,.50,.71,.60,.50,.60],
      offT2=[.60,.70,.60,.70,.43,.60,.70,.60],
      offB2=[.60,.20,.60,.20,.40,.60,.20,.60]
  setOffset(Svg02gradL1,offL1,i); setOffset(Svg02gradR1,offR1,i); setOffset(Svg02gradT1,offT1,i); setOffset(Svg02gradB1,offB1,i)
  setOffset(Svg02gradL2,offL2,i); setOffset(Svg02gradR2,offR2,i); setOffset(Svg02gradT2,offT2,i); setOffset(Svg02gradB2,offB2,i) }
function setOffset(grad,arr,i){grad.children[0].offset.baseVal=arr[i]}
function setBars(i){
  Ex02sTopBar.style.display=Ex02sBottomBar.style.display=Ex02sMoveBar1.style.display=Ex02sMoveBar2.style.display=Ex02sImgBar1.style.display=Ex02sImgBar2.style.display=Ex02sImgBar3.style.display='none'
  switch (i) {
    case 0:Ex02sTopBar   .style.display=Ex02sMoveBar1.style.display=Ex02sImgBar1.style.display='inline-block';break
    case 1:Ex02sImgBar3  .style.display='inline-block'; break
    case 2:Ex02sMoveBar2 .style.display=Ex02sImgBar3.style.display='inline-block';break
    case 3:Ex02sImgBar3  .style.display='inline-block'; break
    case 4:Ex02sImgBar2  .style.display='inline-block'; break
    case 5:Ex02sMoveBar1 .style.display=Ex02sImgBar1.style.display='inline-block';break
    case 6:Ex02sImgBar3  .style.display='inline-block'; break
    case 7:Ex02sBottomBar.style.display=Ex02sMoveBar2.style.display=Ex02sImgBar3.style.display='inline-block';break }}

Ctr02txt1.oninput=()=>{setVA('baseline'); setOffsets(3); setBars(3); setVA(Ctr02txt1.value)}



// example 3
bindSelect(Ctr03sel1,Ex03svg1,'verticalAlign',true)


formatFormulae()




