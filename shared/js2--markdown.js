'use strict';

function addUnderlining() {
  // raw text:     RedCarpet / KramDown:             output of this fxn:
  // ____text____  _<strong><em>text</em></strong>_  <u>text</u>
  //                <strong>__4</strong>__
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = qsa('strong')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var st = _step.value;

      var em = st.querySelector('em');
      if (em) addUnderliningRedCarpet(st, em);else addUnderliningKramDown(st);
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
}

function addUnderliningKramDown(st) {
  // Must begin with __:
  var fc = st.firstChild;
  if (!fc || fc.nodeType !== 3) return;
  var data = fc.data;if (data.slice(0, 2) !== '__') return;
  // Must be followed by __:
  var ns = st.nextSibling;
  if (!ns || ns.nodeType !== 3) return;
  data = ns.data;if (data.slice(0, 2) !== '__') return;
  // Else found match.  Remove extra underscores:
  fc.data = fc.data.slice(2);ns.data = ns.data.slice(2);
  // Repackage in <u>:
  var parent = st.parentNode,
      u = doc.createElement('u');
  u.innerHTML = st.innerHTML;
  parent.insertBefore(u, st);
  parent.removeChild(st);
}

function addUnderliningRedCarpet(st, em) {
  // Must be preceded & followed by textnodes:
  var ps = st.previousSibling;if (!ps || ps.nodeType !== 3) return;
  // and bounded by _:
  var dta = ps.data;if (dta.slice(-1) !== '_') return;
  var ns = st.nextSibling;if (!ns || ns.nodeType !== 3) return;
  dta = ns.data;if (dta.slice(0, 1) !== '_') return;
  // Else found match.  Remove extra underscores:
  ps.data = ps.data.slice(0, -1);ns.data = ns.data.slice(1);
  // Repackage in <u>:
  var parent = st.parentNode,
      u = doc.createElement('u');
  u.innerHTML = em.innerHTML;
  parent.insertBefore(u, st);
  parent.removeChild(st);
}

function addMonospace() {
  // _.  text  ._ => 
  // Make text monospace-pre;
  // preserve leading / trailing spaces (trim periods).
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = qsa('em')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var el = _step2.value;

      // First (probably only) child must be textnode;
      // md <strong>s / <em>s can contain inline elements:
      // _<u>text</u>_ => <em><u>text</u></em>.
      // Textnode must start with '.':
      var fc = el.firstChild;
      if (!fc || fc.nodeType !== 3 || fc.data.slice(0, 1) !== '.') continue;
      var lc = el.lastChild;
      if (!lc || lc.nodeType !== 3 || lc.data.slice(-1) !== '.') continue;
      var sp = doc.createElement('span');
      sp.innerHTML = el.innerHTML.slice(1, -1); // Strip periods.
      sp.style.whiteSpace = 'pre';
      sp.style.fontFamily = 'monospace,monospace';
      sp.style.fontSize = '.92em';
      var par = el.parentNode;
      par.insertBefore(sp, el);
      par.removeChild(el);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function formatMdSpan() {
  // Hijack markdown's syntax _text_ / *text* 
  // (and __text__ / **text** for backwards compatibility)
  // when followed by {code}: #id.class1.classN color~!_|/
  // ~ ! _ | mean italic, bold, underlined, monospace-pre.
  // / also indicates mono, since | can't be escaped inside md table.
  // Eg. _red_{#span1 red!} => bold red, id='span1'.
  // OK to escape the underscore, which otherwise confuses CodePen's syntax highlighting:
  //   _text_{\_} => md strips to _text_{_} before I see it.
  var els = qsa('strong, em') // **text** = <strong></strong> or *text* = <em></em>
  .filter(function (el) {
    return !el.qsa('em').length;
  }); // not ***text*** = <strong><em></em></strong>
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = els[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var el = _step3.value;

      var ns = el.nextSibling;
      if (!ns || ns.nodeType !== 3) continue; // Must be followed by textnode.
      var dta = ns.data,
          match = dta.match(/^{[\S\s]*?}/);
      if (!match) continue; // Must be followed by {...}.
      addColorsToThis();
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  function addColorsToThis() {
    var code = match[0];
    ns.data = ns.data.slice(code.length);
    code = code.slice(1).slice(0, -1); // Strip {}
    // Extract id and classes if present:
    var id = '',
        classes = [],
        rxAny = /([\S\s]*)/,
        rxId = /#([^ \.]*)/,
        rxExtractId = newRx(rxAny, rxId, rxAny),
        rxClass = /\.([^ \.]*)/,
        rxExtractClasses = newRx(rxAny, rxClass, rxAny);
    if (match = rxExtractId.exec(code)) {
      id = match[2];code = match[1] + match[3];
    }
    while (match = rxExtractClasses.exec(code)) {
      classes.push(match[2]);code = match[1] + match[3];
    }
    // \s only necessary to separate id/class from color.  May now be stripped:
    code = code.replace(/[ ]/g, '');
    // Check for formatting chars:
    var bld = /!/.test(code),
        ital = /~/.test(code),
        under = /_/.test(code),
        mono = /\|/.test(code) || /\//.test(code);
    code = code.replace('!', '') // Strip ! ~ _ | /  
    .replace('~', '').replace('_', '').replace('|', '').replace('/', '');
    // Replace <em>/<strong> with <span>:
    var sp = doc.createElement('span'),
        parent = el.parentNode;
    parent.insertBefore(sp, el);parent.removeChild(el);
    // Apply text, id, classes, formatting, & color:
    sp.innerHTML = el.innerHTML;
    if (id) sp.id = id;
    classes.forEach(function (cls) {
      return sp.classList.add(cls);
    });
    if (bld) sp.style.fontWeight = 'bold';
    if (ital) sp.style.fontStyle = 'italic';
    if (under) sp.style.textDecoration = 'underline';
    if (mono) {
      sp.style.whiteSpace = 'pre';
      sp.style.fontFamily = 'monospace,monospace';
      sp.style.fontSize = '.92em';
    }
    if (code) sp.style.color = code; //Any residual text is color.
  }
}

function promoteCodeClasses() {
  // Md code fence applies classes to <code> in <pre><code> block; 
  // transfer classes to <pre>; suffix <code> classes with '_code':
  //   /([-\w]  \w = [A-Za-z0-9_]; legal css class characters = \w and hyphen
  //   +        any string of at least 1
  //   )        becomes capture group (implicitly group 1)
  //   /g       global: repeat for each match (each class)
  //   $1       replace with itself...
  //   _code    ...suffixed with '_code'  
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = doc.qsa('pre>code')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var el = _step4.value;

      var cn = el.className;
      if (cn !== '') {
        el.parentNode.className = cn;
        el.className = cn.replace(/([-\w]+)/g, '$1_code');
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
}

function applyClassesAndIds() {
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = body.qsa('meta')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var meta = _step5.value;
      applyMetaIC(meta);
    } //I'm no longer liking the methods below.
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = doc.qsa('cl')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var el = _step6.value;
      addClassTo(el);
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = doc.qsa('id')[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      el = _step7.value;
      addIdTo(el);
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return) {
        _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }
}

function applyMetaIC(meta) {
  //<meta i='id' c='c1 c2'> => Give top-level ancestor (under body)
  //that id and those classes:
  var i = meta.getAttribute('i') || '',
      c = meta.getAttribute('c') || '';
  if (!i && !c) return;
  var par = meta.parentNode;
  while (par && par.parentNode !== body) {
    par = par.parentNode;
  }if (!par.id && i) par.id = i;
  if (c) {
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = c.split(' ')[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var cl = _step8.value;
        par.classList.add(cl);
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }
  } // Remove <meta> and space before it, so that space doesn't get
  // counted toward margins; put margin-signalling spaces after <meta>:
  var sib = meta.previousSibling;
  if (sib && sib.nodeType === 3) {
    var s = /([ ]*)$/.exec(sib.data)[1].length; // num \s at end
    if (s) sib.data = sib.data.slice(0, -s);
  }
  meta.parentNode.removeChild(meta);
}

// Using custom <cl> tag with custom attributes a, b, etc (<cl a b>):
// for el containing <cl>: add classes a, b, etc.
// Note: el.attributes is not reports attribute.name as all lower-case:
//   <cl A> will add class 'a', not 'A'.
// Ancestors of separation N, up to but not including body:
// add classes a_N, b_N, etc; they can be styled: ancestor[class^=a]{}.
function addClassTo(el) {
  var classes = [],
      i;
  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = Array.from(el.attributes)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var att = _step9.value;
      classes.push(att.name);
    }
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9.return) {
        _iterator9.return();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }

  var i = 0;do {
    el = el.parentNode;
    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = classes[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var cl = _step10.value;
        el.classList.add(cl + (i === 0 ? '' : '_' + i));
      }
    } catch (err) {
      _didIteratorError10 = true;
      _iteratorError10 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion10 && _iterator10.return) {
          _iterator10.return();
        }
      } finally {
        if (_didIteratorError10) {
          throw _iteratorError10;
        }
      }
    }

    ++i;
  } while (el.parentNode.tagName !== 'BODY');
}
// custom <id> tag with custom attribute x (<id x>):
// el containing <id>: if no id, id=x
// ancestors of separation N, up to but not including body:
// if no id, id=x_N
function addIdTo(el) {
  var id = el.attributes[0].name;
  var i = 0;do {
    el = el.parentNode;
    if (el.id === '') el.id = id + (i === 0 ? '' : '_' + i);
    ++i;
  } while (el.parentNode.tagName !== 'BODY');
}

function captureMdBlocks() {
  //look for classes mdCaptureStart[optional suffix]
  var _iteratorNormalCompletion11 = true;
  var _didIteratorError11 = false;
  var _iteratorError11 = undefined;

  try {
    for (var _iterator11 = doc.qsa('[class*=mdCaptureStart]')[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
      var el = _step11.value;

      //extract the suffix:
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = Array.from(el.classList)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var cls = _step12.value;

          var suffix = '',
              matches = /^mdCaptureStart([\S\s]*)/.exec(cls);
          if (matches) {
            suffix = matches[1];
            // Replace mdCaptureStart* class with mdCaptor:
            el.classList.remove(cls);
            el.classList.add('mdCaptor');
            break;
          }
        }
        //Capture younger siblings until
        //- same-suffix capture-end flag is encountered
        //- same-suffix capture-start flag is encountered;
        //  different-suffix capture-start is sub block
        //- doc ends:
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      var sib = siblingToCapture(el);
      while (sib) {
        var captured = sib;
        sib = siblingToCapture(sib);
        captured.parentNode.removeChild(captured);
        el.appendChild(captured);
      }
    } //end of for-loop for one capturing el
  } catch (err) {
    _didIteratorError11 = true;
    _iteratorError11 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion11 && _iterator11.return) {
        _iterator11.return();
      }
    } finally {
      if (_didIteratorError11) {
        throw _iteratorError11;
      }
    }
  }

  function siblingToCapture(el) {
    var sib = el.nextSibling;

    // Case: doc ends without explicitly closing md capture block.
    // el is last element in doc.  Stop capturing.
    if (!sib) return null;

    // Case: text node / comment / exotic node.  Capture it in case it's
    // space after a closing tag (</tag>\s\s), which adjustMargins() makes use of.
    if (sib.nodeType !== 1) return sib;

    // Case: sib is a capture-end element (<div class='mdCaptureEnd'></div>),
    // with suffix (possibly '') matching capture-start element.  Remove 
    // sib and stop capturing:
    if (sib.classList.contains('mdCaptureEnd' + suffix)) {
      sib.parentNode.removeChild(sib);
      return null;
    }

    // Case: sib is another capture-start with same suffix as el.
    // Short-hand way of terminating one capture-block and starting another
    // (whereas different suffix indicates nested capture block).
    // Stop capturing:
    if (sib.classList.contains('mdCaptureStart' + suffix)) return null;

    // Case: otherwise, capture this sib:
    return sib;
  }
}

/* Markdown tag generation:
-> may contain
=> must contain

body -> h
     -> p     -> code
              -> br
     -> pre   => code
     -> table => thead => tr => th -> ?
              => tbody => tr => td -> ?
     -> u/ol  => li    -> p...
                       -> pre...
                       -> u/ol...
                       -> blockquote?...
                       -> br
     -> blockquote     => p...
                       -> blockquote...
     -> non-md block   -> anything

Positions in which I can place spaces as signals:

- <non-md>   : after closing tag: <div>x</div>\s
- <pre><code>: end of only (thus last) textnode: <pre><code>x \n</code></pre> (see note 1)
- <p>        : end of last textnode: <p>x </p>
                                   : <p>v<span>w</span>x </p>
                                   : <p><span>x</span> </p>                            (2)
- <li>       : end of last textnode: <li>x </li>                               
             : end of last textnode before sublist: <li>x \n\n<u|ol>                   (3)
Notes:
1) MD places </code></pre> after \n.  
   2 \ns before sublist after textnode: <li>x \n\n<ul>...</ul></li>
   Allow \n* after [ ]*: /[ ]*(?=\n*$)/.
2) In <li> & <p>, MD preserves \s after closing inline tag:
   - html: <li><span>x</span> </li>
   - md:   <li>`x` </li>, <li>*x* </li>
3) In either of the above cases, textnode can end with at most one \s or <br>.
   Md converts 2+ \s into <br> as it usually does before \n, though in these
   cases <br> collapses: <li>x<br></li> / <li>x<br><u|ol>.
*/

function adjustMargins() {
  detectSpacesIn(body);
} //Initiate recursion:

function detectSpacesIn(el) {
  var s = 0;
  // Check for non-markdown block:
  if (!(s = spacesAfterClosingTagOf(el)))
    // Else check for <pre><code>, <li>, or <p>:
    if (el.tagName === 'PRE' && el.children[0] && el.children[0].tagName === 'CODE') s = spacesAtEndOf(el.children[0]);else if (el.tagName === 'LI') {
      // If el contains a sublist,
      // a) don't need to checkfor spacesAtEndOf(el),
      //    because they'll be contained in the last <li> of the sublist 
      //    or a <p> after the sublist;
      // b) do need to check for the special textnode+sublist case (see below).
      if (!handleSublistCase(el)) // Retval 0 => no sublist; keep checking:
        s = spacesAtEndOf(el);
    } else if (el.tagName === 'P') s = spacesAtEndOf(el);
  if (s > 0) adjustBottomMarginOf(el, s);
  // Recurse:
  if (/^(BODY|BLOCKQUOTE|UL|OL|LI)$/.test(el.tagName) || el.classList.contains('mdCaptor')) // Also adjust margins inside capture blocks.
    detectSpacesInChildrenOf(el);
}

function detectSpacesInChildrenOf(el) {
  var rx = /a^/; //Always fail - seems like a reasonable way to initialize a regex var.
  switch (el.tagName) {
    case 'BODY':
      rx = /[\S\s]*/;break; //Always match: check all toplevel els.
    case 'UL':case 'OL':
      rx = /^LI$/;break;
    case 'LI':
      rx = /^(P|PRE|[OU]L|BLOCKQUOTE)$/;break;
    case 'BLOCKQUOTE':
      rx = /^(P|BLOCKQUOTE)$/;}
  if (el.classList.contains('mdCaptor')) rx = /[\S\s]*/; // Check everything in capture block.
  var _iteratorNormalCompletion13 = true;
  var _didIteratorError13 = false;
  var _iteratorError13 = undefined;

  try {
    for (var _iterator13 = Array.from(el.children)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
      var ch = _step13.value;

      if (rx.test(ch.tagName)) detectSpacesIn(ch);
    }
  } catch (err) {
    _didIteratorError13 = true;
    _iteratorError13 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion13 && _iterator13.return) {
        _iterator13.return();
      }
    } finally {
      if (_didIteratorError13) {
        throw _iteratorError13;
      }
    }
  }
}

function spacesAfterClosingTagOf(el) {
  var ns = el.nextSibling;
  if (!ns || ns.nodeType !== 3) return 0;
  return (/^[ ]*/.exec(ns.data)[0].length
  );
} // \s includes \n; [ ] doesn't.

// Count spaces at end of last textnode
// OR special <li>...<br></li> case:
function spacesAtEndOf(el) {
  var lc = el.lastChild;
  if (!lc) return 0;
  if (el.tagName === 'LI' && lc.tagName === 'BR') {
    el.removeChild(lc);
    return 2;
  }
  return spacesAtEndOfTextNode(lc);
}

// Spaces at end, after last \S (non-whitespace) content
// but on same line, not after \n; 
// spaces after \S and after \n are just tag indentation.
function spacesAtEndOfTextNode(tn) {
  if (!tn || tn.nodeType !== 3) return 0;
  var trailing = /(\s*)$/.exec(tn.data)[1]; // trailing whitespace
  return (/([ ]*)/.exec(trailing)[1].length
  );
} // \s at beginning of whitespace

/* Blank line before sublist => p+sublist case
No blank line before sublist => textnode+sublist case:

textnode+sublist:        

        RedCarpet:     KramDown:
        ----------     ----------------
- 1*    <ul>           <ul>
  - 2   <li>1**          <li>1**
                           <ul>
        <ul>                 <li>2</li>
        <li>2</li>         </ul>
        </ul></li>       </li>
        </ul>          </ul>

p+sublist:
        ------------   ----------------
- 1     <ul>           <ul> 
        <li><p>1</p>     <li>
  - 2                      <p>1</p>
        <ul>         
        <li>2</li>         <ul>
        </ul></li>           <li>2</li>
        </ul>              </ul>
                         </li>
                       </ul>
                         
* is a position in which I can put spaces
** is the position in which md puts either 1 \s or <br> as a result
Let these set the top margin of the sublist, interpreting <br> as 2 spaces. */
function handleSublistCase(el) {
  // Verify sublist:
  for (var i = 0; i < el.children.length; ++i) {
    if (/^[O|U]L$/.test(el.children[i].tagName)) {
      var sl = el.children[i],
          prev = sl.previousElementSibling;
      break;
    }
  }if (!sl) return 0; // Signal 'Keep checking.'
  if (prev && prev.tagName === 'P') return 1; // P+sublist case; signal 'Done.'
  if (prev && prev.tagName === 'BR') {
    el.removeChild(prev);
    adjustTopMarginOfSublist(sl, 2); // <Br> counts as 2 spaces.
    return 1;
  }
  // Else check for spaces at end of textnode before sublist:
  var s = spacesAtEndOfTextNode(sl.previousSibling);
  if (s) adjustTopMarginOfSublist(sl, s);
  return 1;
}

function adjustTopMarginOfSublist(sl, s) {
  sl.style.marginTop = s + 'em';
}

function adjustBottomMarginOf(el, s) {
  // and possibly top margin of next el.
  // Meaning of number of spaces depends on the two elements' default interaction:
  // Where default is 1 or 2em margin, 1 or 2 spaces signals no margin
  // (so 0 spaces can mean 'default', so things mostly space themselves with
  // minimal work by me).  Figure out how many lines would occur by default
  // between these els, then interpret how many spaces the number s indicates:
  var el2 = elAfter(el);
  if (!el2) return; // No point in adjusting bottom margin of last el.
  var l = linesBetween(el, el2, s);
  if (l === 0) //need to turn of both margins:
    el.style.marginBottom = el2.style.marginTop = 0;else el.style.marginBottom = l + 'rem';
}

function elAfter(el) {
  var sib = el.nextElementSibling;
  while (sib && gcs(sib).display === 'none') {
    sib = sib.nextElementSibling;
  } // If no (displaying) sib after el, check el's parent:  
  if (!sib && el.parentNode.tagName !== 'BODY') sib = elAfter(el.parentNode);
  return sib;
}

function linesBetween(el1, el2, s) {
  // Default lines between === the larger margin (not sum, due to collapse):
  var linesAfterEl1 = defaultLines(el1, true),
      linesBeforeEl2 = defaultLines(el2),
      def = Math.max(linesAfterEl1, linesBeforeEl2);
  // Specifying the default means '0':
  return s === def ? 0 : s;
}

function defaultLines(el, bottom) {
  // Convert px to em by dividing by font-size.
  // <H#> margins specified in rems; others in ems.
  // Round in case of calculation error (like 0.1 + 0.2 === 0.30000000000000004).
  var marginWidth = gcs(el)[bottom ? 'marginBottom' : 'marginTop'],
      baseEl = /^H[1-6]$/.test(el.tagName) ? html : el,
      fontSize = gcs(baseEl).fontSize;
  return round(parseFloat(marginWidth) / parseFloat(fontSize));
}
