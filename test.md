---
layout: main
title: 'Inline formatting 1: box types'
css:
- inline0
- inline1
js: test
---

Having determined that, I hardcoded those fonts into my css:

- Open the ttf file in FontForge.
- Select all non-keyboard glyphs / right-click / clear - reduces file size from
  ~700k to ~40k; CodePen has a 1MB page limit.
- File menu / 'export' new ttf file (as opposed to saving in fontforge's .sfd format).
- Upload to [FontSquirrel's converter] (http://www.fontsquirrel.com/tools/webfont-generator) 
  with settings:
  - css: base64 encode
- Download kit; extract; open styles.css.
- use the following css:

