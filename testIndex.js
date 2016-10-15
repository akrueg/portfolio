'use strict'
standardInit()

//This page lives on CodePen & GitHub.  On GitHub, make the blue
//links, which don't contain <span>s, target _self:
if (/github/i.test(doc.URL))
  qsa('a').filter (a=>!a.qs('span')   )
          .forEach(a=>a.target='_self')


