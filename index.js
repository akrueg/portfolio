'use strict';

standardInit();

//This page lives on CodePen & GitHub.  On GitHub, make the blue
//links, which don't contain <span>s, target _self:
if (/github/i.test(doc.URL)) qsa('a').filter(function (a) {
  return !a.qs('span');
}).forEach(function (a) {
  return a.target = '_self';
});
