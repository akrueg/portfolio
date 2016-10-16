'use strict';

standardInit();
inlineFormattingInit();

// example 1
populateSelect(Ctr01sel1, 'top,text-top,super,middle,*baseline,sub,text-bottom,bottom');
Ctr01txt1.oninput = function () {
  return Ex01.style.fontFamily = mapFont(Ctr01txt1.value);
};
Ctr01txt4.oninput = function () {
  return Ex01s2.style.fontFamily = mapFont(Ctr01txt4.value);
};
function mapFont(s) {
  //map appropriate fonts onto my base64 fonts
  switch (s.toLowerCase()) {
    case 'testfont':
      return 'tf';
    case 'dejavu sans':
      return 'dj';
    case 'freeserif':
      return 'fs';}
  return s;
}
bindText(Ctr01txt2, Ex01, 'fontSize');
bindText(Ctr01txt5, Ex01s2, 'fontSize');
bindText(Ctr01txt3, Ex01, 'lineHeight');
bindText(Ctr01txt6, Ex01s2, 'lineHeight');
bindSelect(Ctr01sel1, Ex01s2, 'verticalAlign', true);
bindText(Ctr01txt7, Ex01s2, 'verticalAlign');
