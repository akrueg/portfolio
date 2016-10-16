'use strict';

standardInit();
inlineFormattingInit();

// Example 1
setRange(Ctr01rngLH, 0, 5, 1, .1);
setRange(Ctr01rngH, 0, 200, 100, 2);
calc();

// Assign input handlers:
Ctr01rngLH.oninput = oninputLH;
Ctr01rngH.oninput = oninputH;
Ctr01chkNormal.onclick = onclickNormal;
Ctr01chkAuto.onclick = onclickAuto;

function oninputLH() {
  setStyles('line-height', this.value);calc();
  Ctr01chkNormal.checked = false;
}
function oninputH() {
  setStyles('height', this.value + 'px');calc();
  Ctr01chkAuto.checked = false;
}
function onclickNormal() {
  setStyles('line-height', this.checked ? 'normal' : Ctr01rngLH.value);calc();
}
function onclickAuto() {
  setStyles('height', this.checked ? 'auto' : Ctr01rngH.value + 'px');calc();
}

function setStyles(prop, val) {
  for (var i = 1; i <= 4; ++i) {
    win['Ex01s' + i].style[prop] = val;
  }
}

function calc() {
  Ctr01outLH.innerHTML = Ctr01rngLH.value;
  Ctr01outH.innerHTML = Ctr01rngH.value + 'px';
  var cs = gcs(Ex01s4);
  Ctr01compLH.innerHTML = 'computed: ' + cs.lineHeight;
  Ctr01compH.innerHTML = 'computed: ' + cs.height;
}

// Arrow keys:
Ctr01rngLH.keySteps = 4;Ctr01rngH.keySteps = 4;
Ctr01rngLH.onkeydown = Ctr01rngH.onkeydown = rngOnkeydown;
function rngOnkeydown(ev) {
  if (!eq(ev.keyCode, 37, 38, 39, 40)) return;
  var extra = 0;
  // Wrt note below, only make faster when not very low, under 20%.
  if (this.value / this.max > .2) extra = (this.keySteps - 1) * this.step;
  switch (ev.keyCode) {
    // For left & right, don't prevent default, else value isn't
    // committed / executed.  So, by default 1 step will be taken;
    // code below makes it faster:
    case 37:
      this.value -= extra;break;
    case 39:
      this.value = parseFloat(this.value) + extra;break;
    case 38:case 40:
      ev.preventDefault();(this === Ctr01rngLH ? Ctr01rngH : Ctr01rngLH).focus();}
}

//Controls contained in following analysis:
Ctr01chkMarker.onclick = function () {
  return Ex01s4.innerHTML = Ctr01chkMarker.checked ? 'Aib' : 'ib';
};
Ctr01btn1.onclick = function () {
  return btnSetStyles(.3, 'auto');
};
Ctr01btn2.onclick = function () {
  return btnSetStyles(2.5, 50);
};
Ctr01btn3.onclick = function () {
  return btnSetStyles(0, 0);
};
Ctr01btn4.onclick = function () {
  return btnSetStyles(0, 40);
};
Ctr01btn5.onclick = function () {
  return btnSetStyles(0, 60);
};
function btnSetStyles(lh, h) {
  if (lh === 'normal') {
    Ctr01chkNormal.checked = true;Ctr01chkNormal.onclick();
  } else {
    Ctr01chkNormal.checked = false;
    Ctr01rngLH.value = lh;Ctr01rngLH.oninput();
  }
  if (h === 'auto') {
    Ctr01chkAuto.checked = true;Ctr01chkAuto.onclick();
  } else {
    Ctr01chkAuto.checked = false;
    Ctr01rngH.value = h;Ctr01rngH.oninput();
  }
}
Ctr01chkUnwrapped.onclick = function () {
  Ex01s1.style.display = Ctr01chkUnwrapped.checked ? 'inline' : '';
  Ex01s3.style.display = Ctr01chkUnwrapped.checked ? 'inline-block' : '';
};

// example 2
setRange(Ctr02rngLH, 0, 3, 1, .1);
setRange(Ctr02rngH, 0, 50, 10, 1);
Ctr02chk1.onclick = function () {
  return setEx02(Ctr02chk1.checked ? 'auto' : Ctr02rngH.value + 'px');
};
Ctr02rngLH.oninput = function () {
  return setEx02(null, Ctr02rngLH.value);
};
Ctr02rngH.oninput = function () {
  setEx02(Ctr02rngH.value + 'px');Ctr02chk1.checked = false;
};
function setEx02(h, lh) {
  ;[Ex02s1, Ex02s2, Ex02s3, Ex02img1].forEach(function (el) {
    h && (el.style.height = h);
    lh && (el.style.lineHeight = lh);
  });
}

// Example 3:
bindCheck(Ex03chk, Ex03img, 'background', 'black', '');
bindCheck(Ex03chk2, Ex03img, 'border', '1px solid fuchsia', '');

// example 4
Ctr04txt1.oninput = function () {
  return Ex04s.innerHTML = Ctr04txt1.value;
};
Ctr04chk1.onclick = function () {
  return Array.from(document.querySelectorAll('#Ex04 span:not([id])')).forEach(function (el) {
    return el.style.verticalAlign = Ctr04chk1.checked ? 'bottom' : '';
  });
};
Ctr04chk2.onclick = function () {
  Ex04.style.lineHeight = Ctr04chk2.checked ? 0 : '';
  Ctr04txt1.value = Ex04s.innerHTML = 'p';
};
