'use strict'
standardInit()

function pickColor(el,property,initialColor){
  // Allow this fxn to be cancelled, which allows it 
  // to be called repeatedly with different args:
  if (el.removePCHandler) el.removePCHandler() // Assigned below
  if (property==='cancel') return // 'cancel' is flag
  // Determine property and initial value:
  property=property||'color'
  initialColor=initialColor||'black'
  // Find initial color in array (stored in _js1--misc page):
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

chkFore.onclick=()=>{
  if (!chkFore.checked){
    pickColor(spanMyName,'cancel'); return}
  chkBack.checked=false
  pickColor(spanMyName,'color','dodgerblue') }

chkBack.onclick=()=>{
  if (!chkBack.checked){
    pickColor(spanMyName,'cancel'); return}
  chkFore.checked=false
  pickColor(spanMyName,'background','white') }




