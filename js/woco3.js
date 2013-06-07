var slide_start = 0;
var w_gallery;

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

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {

    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {
        },
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
              ? this
              : oThis,
              aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish  http://paulirish.com/
 */
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame           ||
    window.oRequestAnimationFrame             ||
    window.msRequestAnimationFrame            ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
      return window.setTimeout( callback, 1000 / 60 );
    };
  })();
}

if (!window.cancelRequestAnimFrame) {
  window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame       ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame    ||
    window.oCancelRequestAnimationFrame      ||
    window.msCancelRequestAnimationFrame     ||
    clearTimeout;
  })();
}

function wGallery(slides) {
  this.slides    = slides;
  this._wGallery = new Array();
  this._wSpeed   = this.slides[0].parentNode.offsetWidth * 0.05;
  this._wDisplay = 0;
  this._wCurrent = 0;
  this._wInterval;


  this.nextShow = function() {
    if (typeof this._wGallery[this._wCurrent][this._wDisplay] != 'undefined') {
      var slide = this._wGallery[this._wCurrent][this._wDisplay];
      var left = document.getElementById('slide' + slide).style.left.replace('px', '') - this._wSpeed;

      if (left >= 0) {
        document.getElementById('slide' + slide).style.left = left + 'px';
      } else {
        document.getElementById('slide' + slide).style.left = '0px';
        this._wDisplay++;
      }
      this._wInterval = window.requestAnimationFrame(this.nextShow.bind(this));

    } else {
      // Clear interval
      // clearInterval(window._wInterval);
      this._wInterval = false;
    }
  }

  this.nextHide = function() {
    if (typeof this._wGallery[this._wCurrent][this._wDisplay] != 'undefined') {
      var slide = this._wGallery[this._wCurrent][this._wDisplay];
      var left = document.getElementById('slide' + slide).style.left.replace('px', '');
      left -= this._wSpeed;

      if (left >= -1 * document.getElementsByClassName('slides')[0].offsetWidth) {
        document.getElementById('slide' + slide).style.left = left + 'px';
      } else {
        this._wDisplay++;
      }
      this._wInterval = window.requestAnimationFrame(this.nextHide.bind(this));

    } else {
      // Clear interval
      // clearInterval(this._wInterval);
      this._wInterval = false;
      if (typeof this._wGallery[this._wCurrent + 1] != 'undefined') {
        this._wCurrent++;
        this._wDisplay = 0;
        slide_start = this._wGallery[this._wCurrent][this._wDisplay];
      } else {
        this._wCurrent = 0;
        this._wDisplay = 0;
        slide_start = this._wGallery[this._wCurrent][this._wDisplay];
      }
      this.build('left');
    }
  }

  this.prevShow = function() {
    if (typeof this._wGallery[this._wCurrent][this._wDisplay] != 'undefined') {
      var slide = this._wGallery[this._wCurrent][this._wDisplay];
      var left = document.getElementById('slide' + slide).style.left.replace('px', '') * 1;
      left += this._wSpeed * 1;

      if (left <= 0) {
        document.getElementById('slide' + slide).style.left = left + 'px';
      } else {
        document.getElementById('slide' + slide).style.left = '0px';
        this._wDisplay--;
      }
      this._wInterval = window.requestAnimationFrame(this.prevShow.bind(this));

    } else {
      // Clear interval
      // clearInterval(this._wInterval);
      this._wInterval = false;
    }
  }

  this.prevHide = function() {
    if (typeof this._wGallery[this._wCurrent][this._wDisplay] != 'undefined') {
      var slide = this._wGallery[this._wCurrent][this._wDisplay];
      var left = document.getElementById('slide' + slide).style.left.replace('px', '') * 1;
      left += this._wSpeed * 1;

      if (left <= document.getElementsByClassName('slides')[0].offsetWidth) {
        document.getElementById('slide' + slide).style.left = left + 'px';
      } else {
        this._wDisplay--;
      }
      this._wInterval = window.requestAnimationFrame(this.prevHide.bind(this));

    } else {
      // Clear interval
      // clearInterval(this._wInterval);
      this._wInterval = false;
      this._wCurrent--;
      if (this._wCurrent >= 0) {
        this._wDisplay = this._wGallery[this._wCurrent].length - 1;
        slide_start = this._wGallery[this._wCurrent][0];
      } else {
        this._wCurrent = this._wGallery.length - 1;
        this._wDisplay = this._wGallery[this._wCurrent].length - 1;
        slide_start = this._wGallery[this._wCurrent][0];
      }
      this.build('right');
    }
  }

  this.rebuildSlideshow = function (slides, direction) {
    var slide_width = 0;
    var prev_width  = 0;
    this._wSpeed    = this.slides[0].parentNode.offsetWidth * 0.05;
    for (var i = 0; i < slides.length; i++) {
      slides[i].id = 'slide' + i;
      slides[i].className += ' hide';
      document.getElementById('slide' + i).style.left = '0px';
    }
    for (var i = 0; i < this._wGallery[this._wCurrent].length; i++) {
      document.getElementById('slide' + this._wGallery[this._wCurrent][i]).className =
        document.getElementById('slide' + this._wGallery[this._wCurrent][i]).className.replace(' hide', '');
      if (direction == 'left') {
        document.getElementById('slide' + this._wGallery[this._wCurrent][i]).style.left = document.getElementsByClassName('slides')[0].offsetWidth + 'px';
      } else {
        document.getElementById('slide' + this._wGallery[this._wCurrent][i]).style.left = -1 * document.getElementsByClassName('slides')[0].offsetWidth + 'px';
      }
    }
  }

  this.build = function(direction) {
    var slide_width = 0;
    var key = 0;
    this._wGallery      = new Array();
    this._wGallery[key] = new Array();
    for (var i = 0; i < slides.length; i++) {
      slides[i].id = 'slide' + i;
      slides[i].className = slides[i].className.replace(' hide', '');
      if (slides[i + 1])
        slides[i + 1].className = slides[i + 1].className.replace(' hide', '');

      slide_width += slides[i].offsetWidth;

      if (slide_start == i) {
        this._wCurrent = key;
      }

      if (slides[i + 1] && slide_width + slides[i + 1].offsetWidth > document.getElementsByClassName('slides')[0].offsetWidth) {
        slide_width = 0;
        this._wGallery[key].push(i);
        key++;
        this._wGallery[key] = new Array();
      } else {
        this._wGallery[key].push(i);
      }

    }

    this.rebuildSlideshow(this.slides, direction);
    // clearInterval(window._wInterval);
    if (direction == 'left') {
      this._wDisplay = 0;
      // window._wInterval = setInterval(this.nextShow, 1);
      this.nextShow();
    } else {
      this._wDisplay = this._wGallery[this._wCurrent].length - 1;
      this.prevShow();
    }
  }

  this.next = function () {
    if (!this._wInterval)
    {
      this._wDisplay = 0;
      this.nextHide();
    }
  }

  this.prev = function () {
    if (!this._wInterval)
    {
      this._wDisplay = this._wGallery[w_gallery._wCurrent].length - 1;
      this.prevHide();
    }
  }
}


window.onload = function(e) {
  w_gallery = new wGallery(document.getElementsByClassName('slide'));
  w_gallery.build('left');
}

window.onresize = function(e) {
  window.cancelRequestAnimFrame(w_gallery._wInterval);
  w_gallery.build('left');
}
