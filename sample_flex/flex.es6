'use strict'
standardInit()

var continents=['Africa', 'Antarctica', 'Australia', 'Asia', 'Europe', 'NorthAmerica', 'SouthAmerica']
continents.forEach(continent=>win['svg'+continent].onclick=showList)
function showList(ev) { // When called by closeList, ev===undefined.
  if (ev) {
    ev.stopPropagation()
    var thisContinent=ev.currentTarget.id.slice(3) }
  continents.filter (continent=>continent!==thisContinent)
            .forEach(continent=>{ // Reset other continents to css values:
        win['lst'+continent].style.display=''
        win['svg'+continent].classList.remove('selected') })
  if (!thisContinent) return
  win['lst'+thisContinent].style.display=modal.style.display='block'
  win['svg'+thisContinent].classList.add('selected') } 

// Closing modal blocks by clicking background or 'x':
for (var btn of modal.qsa('.btnX'))
  btn.onclick=closeList
  
window.onclick=ev=>{
  if (!modal.contains(ev.target)) closeList() }
function closeList() {
  modal.style.display=''
  showList() }

var inCodePen  = /codepen/i.test(doc.URL),
    lnkHome    = spanHome.querySelector('a')
lnkHome.target = inCodePen? '_blank' : '_self'
















