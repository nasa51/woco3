var prev_slide = 0;
var slide_start = 0;
var slide_end = 0;
var w_gallery;
var cSlide_set = 0;
var cSlide_display = 0;

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

function wGallery(slides, name) {
  window._wName = name;
  window._wGallery = new Array();
  this.slides = slides;
  window._wSpeed = 10;
  window._wDisplay = 0;
  window._wCurrent = 0;
  window._wInterval;


  this.nextShow = function() {
    console.log(window._wDisplay);
    console.log(window._wGallery[window._wCurrent]);
    if (typeof window._wGallery[window._wCurrent][window._wDisplay] != 'undefined') {
      var slide = window._wGallery[window._wCurrent][window._wDisplay];
      var left = document.getElementById('slide' + slide).style.left.replace('px', '');
      left -= window._wSpeed;

      if (left >= 0) {
        document.getElementById('slide' + slide).style.left = left + 'px';
      } else {
        window._wDisplay++;
      }

    } else {
      // Clear interval
      clearInterval(window._wInterval);
      window._wInterval = 0;
    }
  }

  this.nextHide = function() {
    if (typeof window._wGallery[window._wCurrent + 1] != 'undefined') {
      if (typeof window._wGallery[window._wCurrent][window._wDisplay] != 'undefined') {
        var slide = window._wGallery[window._wCurrent][window._wDisplay];
        var left = document.getElementById('slide' + slide).style.left.replace('px', '');
        left -= window._wSpeed;

        if (left >= -1 * document.getElementsByClassName('slides')[0].offsetWidth) {
          document.getElementById('slide' + slide).style.left = left + 'px';
        } else {
          window._wDisplay++;
        }

      } else {
        // Clear interval
        clearInterval(window._wInterval);
        window._wInterval = 0;
        if (typeof window._wGallery[window._wCurrent + 1] != 'undefined') {
          window._wCurrent++;
          window._wDisplay = 0;
          slide_start = window._wGallery[window._wCurrent][window._wDisplay];
          window[window._wName].build('left');
        }
      }
    } else {
      clearInterval(window._wInterval);
      window._wInterval = 0;
    }
  }

  this.prevShow = function() {
    if (typeof window._wGallery[window._wCurrent][window._wDisplay] != 'undefined') {
      var slide = window._wGallery[window._wCurrent][window._wDisplay];
      var left = document.getElementById('slide' + slide).style.left.replace('px', '') * 1;
      left += window._wSpeed * 1;

      if (left <= 0) {
        document.getElementById('slide' + slide).style.left = left + 'px';
      } else {
        window._wDisplay--;
      }

    } else {
      // Clear interval
      clearInterval(window._wInterval);
      window._wInterval = 0;
    }
  }

  this.prevHide = function() {
    if (window._wCurrent >= 0) {
      if (typeof window._wGallery[window._wCurrent][window._wDisplay] != 'undefined') {
        var slide = window._wGallery[window._wCurrent][window._wDisplay];
        var left = document.getElementById('slide' + slide).style.left.replace('px', '') * 1;
        left += window._wSpeed * 1;

        if (left <= document.getElementsByClassName('slides')[0].offsetWidth) {
          document.getElementById('slide' + slide).style.left = left + 'px';
        } else {
          window._wDisplay--;
        }

      } else {
        // Clear interval
        clearInterval(window._wInterval);
        window._wInterval = 0;
        window._wCurrent--;
        if (window._wCurrent >= 0) {
          window._wDisplay = window._wGallery[window._wCurrent].length - 1;
          slide_start = window._wGallery[window._wCurrent][0];
          window[window._wName].build('right');
        } else {
          window._wCurrent = 0;
        }
      }
    } else {
      clearInterval(window._wInterval);
      window._wInterval = 0;
    }
  }

  this.rebuildSlideshow = function (slides, direction) {
    var slide_width = 0;
    var prev_width = 0;
    prev_slide = 0;
    for (var i = 0; i < slides.length; i++) {
      slides[i].id = 'slide' + i;
      slides[i].className += ' hide';
      document.getElementById('slide' + i).style.left = '0px';
    }
    for (var i = 0; i < window._wGallery[window._wCurrent].length; i++) {
      document.getElementById('slide' + window._wGallery[window._wCurrent][i]).className =
        document.getElementById('slide' + window._wGallery[window._wCurrent][i]).className.replace(' hide', '');
      if (direction == 'left') {
        document.getElementById('slide' + window._wGallery[window._wCurrent][i]).style.left = document.getElementsByClassName('slides')[0].offsetWidth + 'px';
      } else {
        document.getElementById('slide' + window._wGallery[window._wCurrent][i]).style.left = -1 * document.getElementsByClassName('slides')[0].offsetWidth + 'px';
      }
    }
  }

  this.build = function(direction) {
    var slide_width = 0;
    var key = 0;
    window._wGallery[key] = new Array();
    prev_slide = 0;
    for (var i = 0; i < slides.length; i++) {
      slides[i].id = 'slide' + i;
      slides[i].className = slides[i].className.replace(' hide', '');
      if (slides[i + 1])
        slides[i + 1].className = slides[i + 1].className.replace(' hide', '');

      slide_width += slides[i].offsetWidth;

      if (slide_start == i) {
        window._wCurrent = key;
      }

      if (slides[i + 1] && slide_width + slides[i + 1].offsetWidth > document.getElementsByClassName('slides')[0].offsetWidth) {
        slide_width = 0;
        window._wGallery[key].push(i);
        key++;
        window._wGallery[key] = new Array();
      } else {
        window._wGallery[key].push(i);
      }

    }
    this.rebuildSlideshow(this.slides, direction);
    clearInterval(window._wInterval);
    if (direction == 'left') {
      console.log(window._wCurrent);
      window._wDisplay = 0;
      window._wInterval = setInterval(this.nextShow, 1);
    } else {
      window._wDisplay = window._wGallery[window._wCurrent].length - 1;
      window._wInterval = setInterval(this.prevShow, 1);
    }
  }
}

function next() {
  if (!window._wInterval) {
    if (typeof window._wGallery[window._wCurrent + 1] != 'undefined') {
      window._wDisplay = 0;
      window._wInterval = setInterval(w_gallery.nextHide, 1);
    }
  }
}

function prev() {
  if (!window._wInterval) {
    window._wDisplay--;
    window._wInterval = setInterval(w_gallery.prevHide, 1);
  }
}

window.onload = function(e) {
  w_gallery = new wGallery(document.getElementsByClassName('slide'), 'w_gallery');
  w_gallery.build('left');
}

window.onresize = function(e) {
  clearInterval(window._wInterval);
  w_gallery.build('left');
}
