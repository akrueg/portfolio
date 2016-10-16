'use strict';

standardInit();
inlineFormattingInit();
formatFormulae();

// example 1
Ctr01chk1.onclick = function () {
  var bcr = Ctr01chk1.getBoundingClientRect(),
      oldTop = bcr.top;
  Ex01p.style.fontSize = Ctr01chk1.checked ? '2048px' : '';
  bcr = Ctr01chk1.getBoundingClientRect();
  scrollBy(0, bcr.top - oldTop);
};

// Example 2:
Ctr02optA.onclick = function () {
  return Ex02markersA.style.display = Ex02lblsA.style.display = Ex02markersD.style.display = Ex02lblsD.style.display = '';
};
Ctr02optD.onclick = function () {
  Ex02markersA.style.display = Ex02lblsA.style.display = 'none';
  Ex02markersD.style.display = Ex02lblsD.style.display = 'block';
};

// example 5
bindCheck(Ctr05chkBounding, Ex05bounding, 'display', 'block', '');
Ctr05chkEm.onclick = function () {
  if (Ctr05chkEm.checked) {
    // Checked 'em':
    if (gcs(Ex05s1).display === 'none') Ex05s1.style.display = 'inline';
    Ex05em.style.display = 'block';
  } else {
    // Unchecked 'em':
    if (!Ctr05chkInline.checked && !Ctr05chkContent.checked) Ex05s1.style.display = 'none';
    Ex05em.style.display = '';
  }
};
Ctr05chkInline.onclick = function () {
  if (Ctr05chkInline.checked) {
    // Checked 'inline':
    Ctr05chkContent.checked = false;
    Ex05s1.style.display = 'inline-block';
    Ex05s1.style.background = 'pink';
  } else {
    // Unchecked 'inline':
    Ex05s1.style.background = '';
    if (!Ctr05chkEm.checked) Ex05s1.style.display = 'none';
  }
};
Ctr05chkContent.onclick = function () {
  if (Ctr05chkContent.checked) {
    // Checked 'content':
    Ctr05chkInline.checked = false;
    Ex05s1.style.display = 'inline';
    Ex05s1.style.background = '#40bf77';
  } else {
    // Unchecked 'content':
    Ex05s1.style.background = '';
    if (!Ctr05chkEm.checked) Ex05s1.style.display = 'none';
  }
};

//scrollToEl('28v')
var refresh = 11111;
