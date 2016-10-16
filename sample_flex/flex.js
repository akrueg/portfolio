'use strict';

standardInit();

var continents = ['Africa', 'Antarctica', 'Australia', 'Asia', 'Europe', 'NorthAmerica', 'SouthAmerica'];
continents.forEach(function (continent) {
  return win['svg' + continent].onclick = showList;
});
function showList(ev) {
  // When called by closeList, ev===undefined.
  if (ev) {
    ev.stopPropagation();
    var thisContinent = ev.currentTarget.id.slice(3);
  }
  continents.filter(function (continent) {
    return continent !== thisContinent;
  }).forEach(function (continent) {
    // Reset other continents to css values:
    win['lst' + continent].style.display = '';
    win['svg' + continent].classList.remove('selected');
  });
  if (!thisContinent) return;
  win['lst' + thisContinent].style.display = modal.style.display = 'block';
  win['svg' + thisContinent].classList.add('selected');
}

// Closing modal blocks by clicking background or 'x':
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = modal.qsa('.btnX')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var btn = _step.value;

    btn.onclick = closeList;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

window.onclick = function (ev) {
  if (!modal.contains(ev.target)) closeList();
};
function closeList() {
  modal.style.display = '';
  showList();
}

var inCodePen = /codepen/i.test(doc.URL),
    lnkHome = spanHome.querySelector('a');
lnkHome.target = inCodePen ? '_blank' : '_self';
