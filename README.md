jQuery.bgsize Plugin
=====

Bringing cross-browser compatibility for background-size 'cover' and 'contain' modes

Features
------------
* Responsive
* CSS3 with JS fallback
* No extra markup than a JS initialization

Usage
------------
1. Include the jquery.bgsize.js script in your document.
2. Apply $(selector).bgsize(options) , normally, when the browser does not support background-size (e.g. using Modernizr like in the demo)
3. Add a data-bgsize-mode="contain" attribute to all elements that does not use the default 'cover' mode.
This is needed by browsers not supporting background-size.
4. You can also specify the image url using the data-bgsize-image attribute to tell bgsize to read the url from
there and not from css background-image property.

To-Do
------------
* background-position emulation
* background-size units (% and px) emulation (now it's centered by default)