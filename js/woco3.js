var prev_slide = 0;
var slide_start = 0;
var slide_end = 0;

// IE getElementsByClassName
if (typeof document.getElementsByClassName != 'function'){
  document.getElementsByClassName = function (className) {
    if (typeof document.querySelectorAll == 'function') {
      return document.querySelectorAll('.' + className)
    } else {
      var elms = document.getElementsByTagName('*');
      var ei = new Array();
      for (i=0;i<elms.length;i++) {
        if (elms[i].getAttribute('class')) {
          ecl = elms[i].getAttribute('class').split(' ');
          for (j=0; j < ecl.length; j++) {
            if (ecl[j].toLowerCase() == className) {
              ei.push(elms[i]);
            }
          }
        } else if (elms[i].className) {
          ecl = elms[i].className.split(' ');
          for (j=0; j < ecl.length; j++) {
            if (ecl[j].toLowerCase() == className) {
              ei.push(elms[i]);
            }
          }
        }
      }
      return ei;
    }
  }
}

function rebuildSlideshow(slides) {
  var slide_width = 0;
  var prev_width = 0;
  prev_slide = 0;
  for (var i = 0; i < slides.length; i++) {
    slides[i].className = slides[i].className.replace(' hide', '');
    if (slides[i + 1])
      slides[i + 1].className = slides[i + 1].className.replace(' hide', '');
    if (i < slide_start) {
      if (prev_width + slides[i].offsetWidth > document.getElementsByClassName('slides')[0].offsetWidth ||
        (slides[i + 1] && slides[i].offsetWidth + slides[i + 1].offsetWidth + 10 > document.getElementsByClassName('slides')[0].offsetWidth)
        ) {
        prev_width = 0;
        if (prev_slide < slide_start) {
          prev_slide = i;
        }
      } else {
        prev_width += slides[i].offsetWidth;
      }
      slides[i].className += ' hide';
      if (slides[i + 1])
        slides[i + 1].className += ' hide';
    } else if (slide_width + slides[i].offsetWidth > document.getElementsByClassName('slides')[0].offsetWidth) {
      slides[i].className += ' hide';
    } else {
      slide_end = i;
      slides[i].className = slides[i].className.replace(' hide', '');
      slide_width += slides[i].offsetWidth;
    }
  }
}

function next() {
  if (document.getElementsByClassName('slide')[slide_end + 1]) {
    slide_start = slide_end + 1;
    rebuildSlideshow(document.getElementsByClassName('slide'));
  }
}

function prev() {
  slide_start = prev_slide;
  rebuildSlideshow(document.getElementsByClassName('slide'));
}

window.onload = function(e) {
  rebuildSlideshow(document.getElementsByClassName('slide'));
}
window.onresize = function(e) {
  rebuildSlideshow(document.getElementsByClassName('slide'));
}

