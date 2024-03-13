/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 541:
/***/ (function() {

(function() {
  var MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Util = (function() {
    function Util() {}

    Util.prototype.extend = function(custom, defaults) {
      var key, value;
      for (key in defaults) {
        value = defaults[key];
        if (custom[key] == null) {
          custom[key] = value;
        }
      }
      return custom;
    };

    Util.prototype.isMobile = function(agent) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    };

    Util.prototype.createEvent = function(event, bubble, cancel, detail) {
      var customEvent;
      if (bubble == null) {
        bubble = false;
      }
      if (cancel == null) {
        cancel = false;
      }
      if (detail == null) {
        detail = null;
      }
      if (document.createEvent != null) {
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, bubble, cancel, detail);
      } else if (document.createEventObject != null) {
        customEvent = document.createEventObject();
        customEvent.eventType = event;
      } else {
        customEvent.eventName = event;
      }
      return customEvent;
    };

    Util.prototype.emitEvent = function(elem, event) {
      if (elem.dispatchEvent != null) {
        return elem.dispatchEvent(event);
      } else if (event in (elem != null)) {
        return elem[event]();
      } else if (("on" + event) in (elem != null)) {
        return elem["on" + event]();
      }
    };

    Util.prototype.addEvent = function(elem, event, fn) {
      if (elem.addEventListener != null) {
        return elem.addEventListener(event, fn, false);
      } else if (elem.attachEvent != null) {
        return elem.attachEvent("on" + event, fn);
      } else {
        return elem[event] = fn;
      }
    };

    Util.prototype.removeEvent = function(elem, event, fn) {
      if (elem.removeEventListener != null) {
        return elem.removeEventListener(event, fn, false);
      } else if (elem.detachEvent != null) {
        return elem.detachEvent("on" + event, fn);
      } else {
        return delete elem[event];
      }
    };

    Util.prototype.innerHeight = function() {
      if ('innerHeight' in window) {
        return window.innerHeight;
      } else {
        return document.documentElement.clientHeight;
      }
    };

    return Util;

  })();

  WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
    function WeakMap() {
      this.keys = [];
      this.values = [];
    }

    WeakMap.prototype.get = function(key) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          return this.values[i];
        }
      }
    };

    WeakMap.prototype.set = function(key, value) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          this.values[i] = value;
          return;
        }
      }
      this.keys.push(key);
      return this.values.push(value);
    };

    return WeakMap;

  })());

  MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
    function MutationObserver() {
      if (typeof console !== "undefined" && console !== null) {
        console.warn('MutationObserver is not supported by your browser.');
      }
      if (typeof console !== "undefined" && console !== null) {
        console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
      }
    }

    MutationObserver.notSupported = true;

    MutationObserver.prototype.observe = function() {};

    return MutationObserver;

  })());

  getComputedStyle = this.getComputedStyle || function(el, pseudo) {
    this.getPropertyValue = function(prop) {
      var ref;
      if (prop === 'float') {
        prop = 'styleFloat';
      }
      if (getComputedStyleRX.test(prop)) {
        prop.replace(getComputedStyleRX, function(_, _char) {
          return _char.toUpperCase();
        });
      }
      return ((ref = el.currentStyle) != null ? ref[prop] : void 0) || null;
    };
    return this;
  };

  getComputedStyleRX = /(\-([a-z]){1})/g;

  this.WOW = (function() {
    WOW.prototype.defaults = {
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      callback: null,
      scrollContainer: null
    };

    function WOW(options) {
      if (options == null) {
        options = {};
      }
      this.scrollCallback = bind(this.scrollCallback, this);
      this.scrollHandler = bind(this.scrollHandler, this);
      this.resetAnimation = bind(this.resetAnimation, this);
      this.start = bind(this.start, this);
      this.scrolled = true;
      this.config = this.util().extend(options, this.defaults);
      if (options.scrollContainer != null) {
        this.config.scrollContainer = document.querySelector(options.scrollContainer);
      }
      this.animationNameCache = new WeakMap();
      this.wowEvent = this.util().createEvent(this.config.boxClass);
    }

    WOW.prototype.init = function() {
      var ref;
      this.element = window.document.documentElement;
      if ((ref = document.readyState) === "interactive" || ref === "complete") {
        this.start();
      } else {
        this.util().addEvent(document, 'DOMContentLoaded', this.start);
      }
      return this.finished = [];
    };

    WOW.prototype.start = function() {
      var box, j, len, ref;
      this.stopped = false;
      this.boxes = (function() {
        var j, len, ref, results;
        ref = this.element.querySelectorAll("." + this.config.boxClass);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      this.all = (function() {
        var j, len, ref, results;
        ref = this.boxes;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      if (this.boxes.length) {
        if (this.disabled()) {
          this.resetStyle();
        } else {
          ref = this.boxes;
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            this.applyStyle(box, true);
          }
        }
      }
      if (!this.disabled()) {
        this.util().addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
        this.util().addEvent(window, 'resize', this.scrollHandler);
        this.interval = setInterval(this.scrollCallback, 50);
      }
      if (this.config.live) {
        return new MutationObserver((function(_this) {
          return function(records) {
            var k, len1, node, record, results;
            results = [];
            for (k = 0, len1 = records.length; k < len1; k++) {
              record = records[k];
              results.push((function() {
                var l, len2, ref1, results1;
                ref1 = record.addedNodes || [];
                results1 = [];
                for (l = 0, len2 = ref1.length; l < len2; l++) {
                  node = ref1[l];
                  results1.push(this.doSync(node));
                }
                return results1;
              }).call(_this));
            }
            return results;
          };
        })(this)).observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };

    WOW.prototype.stop = function() {
      this.stopped = true;
      this.util().removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
      this.util().removeEvent(window, 'resize', this.scrollHandler);
      if (this.interval != null) {
        return clearInterval(this.interval);
      }
    };

    WOW.prototype.sync = function(element) {
      if (MutationObserver.notSupported) {
        return this.doSync(this.element);
      }
    };

    WOW.prototype.doSync = function(element) {
      var box, j, len, ref, results;
      if (element == null) {
        element = this.element;
      }
      if (element.nodeType !== 1) {
        return;
      }
      element = element.parentNode || element;
      ref = element.querySelectorAll("." + this.config.boxClass);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        if (indexOf.call(this.all, box) < 0) {
          this.boxes.push(box);
          this.all.push(box);
          if (this.stopped || this.disabled()) {
            this.resetStyle();
          } else {
            this.applyStyle(box, true);
          }
          results.push(this.scrolled = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    WOW.prototype.show = function(box) {
      this.applyStyle(box);
      box.className = box.className + " " + this.config.animateClass;
      if (this.config.callback != null) {
        this.config.callback(box);
      }
      this.util().emitEvent(box, this.wowEvent);
      this.util().addEvent(box, 'animationend', this.resetAnimation);
      this.util().addEvent(box, 'oanimationend', this.resetAnimation);
      this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
      this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
      return box;
    };

    WOW.prototype.applyStyle = function(box, hidden) {
      var delay, duration, iteration;
      duration = box.getAttribute('data-wow-duration');
      delay = box.getAttribute('data-wow-delay');
      iteration = box.getAttribute('data-wow-iteration');
      return this.animate((function(_this) {
        return function() {
          return _this.customStyle(box, hidden, duration, delay, iteration);
        };
      })(this));
    };

    WOW.prototype.animate = (function() {
      if ('requestAnimationFrame' in window) {
        return function(callback) {
          return window.requestAnimationFrame(callback);
        };
      } else {
        return function(callback) {
          return callback();
        };
      }
    })();

    WOW.prototype.resetStyle = function() {
      var box, j, len, ref, results;
      ref = this.boxes;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        results.push(box.style.visibility = 'visible');
      }
      return results;
    };

    WOW.prototype.resetAnimation = function(event) {
      var target;
      if (event.type.toLowerCase().indexOf('animationend') >= 0) {
        target = event.target || event.srcElement;
        return target.className = target.className.replace(this.config.animateClass, '').trim();
      }
    };

    WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
      if (hidden) {
        this.cacheAnimationName(box);
      }
      box.style.visibility = hidden ? 'hidden' : 'visible';
      if (duration) {
        this.vendorSet(box.style, {
          animationDuration: duration
        });
      }
      if (delay) {
        this.vendorSet(box.style, {
          animationDelay: delay
        });
      }
      if (iteration) {
        this.vendorSet(box.style, {
          animationIterationCount: iteration
        });
      }
      this.vendorSet(box.style, {
        animationName: hidden ? 'none' : this.cachedAnimationName(box)
      });
      return box;
    };

    WOW.prototype.vendors = ["moz", "webkit"];

    WOW.prototype.vendorSet = function(elem, properties) {
      var name, results, value, vendor;
      results = [];
      for (name in properties) {
        value = properties[name];
        elem["" + name] = value;
        results.push((function() {
          var j, len, ref, results1;
          ref = this.vendors;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            vendor = ref[j];
            results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    WOW.prototype.vendorCSS = function(elem, property) {
      var j, len, ref, result, style, vendor;
      style = getComputedStyle(elem);
      result = style.getPropertyCSSValue(property);
      ref = this.vendors;
      for (j = 0, len = ref.length; j < len; j++) {
        vendor = ref[j];
        result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
      }
      return result;
    };

    WOW.prototype.animationName = function(box) {
      var animationName, error;
      try {
        animationName = this.vendorCSS(box, 'animation-name').cssText;
      } catch (error) {
        animationName = getComputedStyle(box).getPropertyValue('animation-name');
      }
      if (animationName === 'none') {
        return '';
      } else {
        return animationName;
      }
    };

    WOW.prototype.cacheAnimationName = function(box) {
      return this.animationNameCache.set(box, this.animationName(box));
    };

    WOW.prototype.cachedAnimationName = function(box) {
      return this.animationNameCache.get(box);
    };

    WOW.prototype.scrollHandler = function() {
      return this.scrolled = true;
    };

    WOW.prototype.scrollCallback = function() {
      var box;
      if (this.scrolled) {
        this.scrolled = false;
        this.boxes = (function() {
          var j, len, ref, results;
          ref = this.boxes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            if (!(box)) {
              continue;
            }
            if (this.isVisible(box)) {
              this.show(box);
              continue;
            }
            results.push(box);
          }
          return results;
        }).call(this);
        if (!(this.boxes.length || this.config.live)) {
          return this.stop();
        }
      }
    };

    WOW.prototype.offsetTop = function(element) {
      var top;
      while (element.offsetTop === void 0) {
        element = element.parentNode;
      }
      top = element.offsetTop;
      while (element = element.offsetParent) {
        top += element.offsetTop;
      }
      return top;
    };

    WOW.prototype.isVisible = function(box) {
      var bottom, offset, top, viewBottom, viewTop;
      offset = box.getAttribute('data-wow-offset') || this.config.offset;
      viewTop = (this.config.scrollContainer && this.config.scrollContainer.scrollTop) || window.pageYOffset;
      viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
      top = this.offsetTop(box);
      bottom = top + box.clientHeight;
      return top <= viewBottom && bottom >= viewTop;
    };

    WOW.prototype.util = function() {
      return this._util != null ? this._util : this._util = new Util();
    };

    WOW.prototype.disabled = function() {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent);
    };

    return WOW;

  })();

}).call(this);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXTERNAL MODULE: ./node_modules/wowjs/dist/wow.js
var wow = __webpack_require__(541);
;// CONCATENATED MODULE: ./src/js/pages/main-page.js



new wow.WOW({
  mobile: true
  // resetAnimation: false,
  // callback: function (box) {
  // 	if (box.classList.contains("request__content-text--anim")) {
  // 		setTimeout(() => {
  // 			box.classList.add("anim-fill-text");
  // 		}, 2200);
  // 	}
  // 	// the callback is fired every time an animation is started
  // 	// the argument that is passed in is the DOM node being animated
  // },
}).init();
if (window.innerWidth >= 769) {
  const banners = document.querySelectorAll(".banner");
  function handleScroll() {
    banners.forEach(banner => {
      const bannerHeight = banner.clientHeight;
      const bannerTop = banner.offsetTop;
      let scrollPosition = window.scrollY;
      let windowHeight = window.innerHeight;
      if (scrollPosition + windowHeight > bannerTop && scrollPosition < bannerTop + bannerHeight) {
        let position = (scrollPosition - bannerTop) / 2;
        banner.style.backgroundPosition = `center ${position}px`;
      } else {
        banner.style.backgroundPosition = "center 0";
      }
    });
  }
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("load", handleScroll);
}
;// CONCATENATED MODULE: ./src/js/app.js





}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsU0FBUztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsU0FBUztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxTQUFTO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsU0FBUztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVILENBQUM7Ozs7Ozs7VUNoZ0JEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7O0FDdEI0QjtBQUNQO0FBQ2U7QUFFcEMsSUFBSUEsT0FBRyxDQUFDO0VBQ1BDLE1BQU0sRUFBRTtFQUNSO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0FBQ0QsQ0FBQyxDQUFDLENBQUNDLElBQUksQ0FBQyxDQUFDO0FBRVQsSUFBSUMsTUFBTSxDQUFDQyxVQUFVLElBQUksR0FBRyxFQUFFO0VBQzdCLE1BQU1DLE9BQU8sR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7RUFFcEQsU0FBU0MsWUFBWUEsQ0FBQSxFQUFHO0lBQ3ZCSCxPQUFPLENBQUNJLE9BQU8sQ0FBQ0MsTUFBTSxJQUFJO01BQ3pCLE1BQU1DLFlBQVksR0FBR0QsTUFBTSxDQUFDRSxZQUFZO01BQ3hDLE1BQU1DLFNBQVMsR0FBR0gsTUFBTSxDQUFDSSxTQUFTO01BRWxDLElBQUlDLGNBQWMsR0FBR1osTUFBTSxDQUFDYSxPQUFPO01BQ25DLElBQUlDLFlBQVksR0FBR2QsTUFBTSxDQUFDZSxXQUFXO01BRXJDLElBQ0NILGNBQWMsR0FBR0UsWUFBWSxHQUFHSixTQUFTLElBQ3pDRSxjQUFjLEdBQUdGLFNBQVMsR0FBR0YsWUFBWSxFQUN4QztRQUNELElBQUlRLFFBQVEsR0FBRyxDQUFDSixjQUFjLEdBQUdGLFNBQVMsSUFBSSxDQUFDO1FBQy9DSCxNQUFNLENBQUNVLEtBQUssQ0FBQ0Msa0JBQWtCLEdBQUksVUFBU0YsUUFBUyxJQUFHO01BQ3pELENBQUMsTUFBTTtRQUNOVCxNQUFNLENBQUNVLEtBQUssQ0FBQ0Msa0JBQWtCLEdBQUcsVUFBVTtNQUM3QztJQUNELENBQUMsQ0FBQztFQUNIO0VBRUFsQixNQUFNLENBQUNtQixnQkFBZ0IsQ0FBQyxRQUFRLEVBQUVkLFlBQVksQ0FBQztFQUMvQ0wsTUFBTSxDQUFDbUIsZ0JBQWdCLENBQUMsTUFBTSxFQUFFZCxZQUFZLENBQUM7QUFDOUM7O0FDM0NvQjtBQUNPO0FBQ0M7QUFFQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy93b3dqcy9kaXN0L3dvdy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL3BhZ2VzL21haW4tcGFnZS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgdmFyIE11dGF0aW9uT2JzZXJ2ZXIsIFV0aWwsIFdlYWtNYXAsIGdldENvbXB1dGVkU3R5bGUsIGdldENvbXB1dGVkU3R5bGVSWCxcbiAgICBiaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBVdGlsKCkge31cblxuICAgIFV0aWwucHJvdG90eXBlLmV4dGVuZCA9IGZ1bmN0aW9uKGN1c3RvbSwgZGVmYXVsdHMpIHtcbiAgICAgIHZhciBrZXksIHZhbHVlO1xuICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgdmFsdWUgPSBkZWZhdWx0c1trZXldO1xuICAgICAgICBpZiAoY3VzdG9tW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgIGN1c3RvbVtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXN0b207XG4gICAgfTtcblxuICAgIFV0aWwucHJvdG90eXBlLmlzTW9iaWxlID0gZnVuY3Rpb24oYWdlbnQpIHtcbiAgICAgIHJldHVybiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoYWdlbnQpO1xuICAgIH07XG5cbiAgICBVdGlsLnByb3RvdHlwZS5jcmVhdGVFdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCBidWJibGUsIGNhbmNlbCwgZGV0YWlsKSB7XG4gICAgICB2YXIgY3VzdG9tRXZlbnQ7XG4gICAgICBpZiAoYnViYmxlID09IG51bGwpIHtcbiAgICAgICAgYnViYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoY2FuY2VsID09IG51bGwpIHtcbiAgICAgICAgY2FuY2VsID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoZGV0YWlsID09IG51bGwpIHtcbiAgICAgICAgZGV0YWlsID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIGN1c3RvbUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgIGN1c3RvbUV2ZW50LmluaXRDdXN0b21FdmVudChldmVudCwgYnViYmxlLCBjYW5jZWwsIGRldGFpbCk7XG4gICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0ICE9IG51bGwpIHtcbiAgICAgICAgY3VzdG9tRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgICAgICBjdXN0b21FdmVudC5ldmVudFR5cGUgPSBldmVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1c3RvbUV2ZW50LmV2ZW50TmFtZSA9IGV2ZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1c3RvbUV2ZW50O1xuICAgIH07XG5cbiAgICBVdGlsLnByb3RvdHlwZS5lbWl0RXZlbnQgPSBmdW5jdGlvbihlbGVtLCBldmVudCkge1xuICAgICAgaWYgKGVsZW0uZGlzcGF0Y2hFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBlbGVtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfSBlbHNlIGlmIChldmVudCBpbiAoZWxlbSAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gZWxlbVtldmVudF0oKTtcbiAgICAgIH0gZWxzZSBpZiAoKFwib25cIiArIGV2ZW50KSBpbiAoZWxlbSAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gZWxlbVtcIm9uXCIgKyBldmVudF0oKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVXRpbC5wcm90b3R5cGUuYWRkRXZlbnQgPSBmdW5jdGlvbihlbGVtLCBldmVudCwgZm4pIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmbiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGVsZW0uYXR0YWNoRXZlbnQoXCJvblwiICsgZXZlbnQsIGZuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbGVtW2V2ZW50XSA9IGZuO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBVdGlsLnByb3RvdHlwZS5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uKGVsZW0sIGV2ZW50LCBmbikge1xuICAgICAgaWYgKGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKGVsZW0uZGV0YWNoRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZWxlbS5kZXRhY2hFdmVudChcIm9uXCIgKyBldmVudCwgZm4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRlbGV0ZSBlbGVtW2V2ZW50XTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVXRpbC5wcm90b3R5cGUuaW5uZXJIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgnaW5uZXJIZWlnaHQnIGluIHdpbmRvdykge1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBVdGlsO1xuXG4gIH0pKCk7XG5cbiAgV2Vha01hcCA9IHRoaXMuV2Vha01hcCB8fCB0aGlzLk1veldlYWtNYXAgfHwgKFdlYWtNYXAgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gV2Vha01hcCgpIHtcbiAgICAgIHRoaXMua2V5cyA9IFtdO1xuICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBXZWFrTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBpLCBpdGVtLCBqLCBsZW4sIHJlZjtcbiAgICAgIHJlZiA9IHRoaXMua2V5cztcbiAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICAgIGl0ZW0gPSByZWZbaV07XG4gICAgICAgIGlmIChpdGVtID09PSBrZXkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgV2Vha01hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdmFyIGksIGl0ZW0sIGosIGxlbiwgcmVmO1xuICAgICAgcmVmID0gdGhpcy5rZXlzO1xuICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgaXRlbSA9IHJlZltpXTtcbiAgICAgICAgaWYgKGl0ZW0gPT09IGtleSkge1xuICAgICAgICAgIHRoaXMudmFsdWVzW2ldID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLnB1c2godmFsdWUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gV2Vha01hcDtcblxuICB9KSgpKTtcblxuICBNdXRhdGlvbk9ic2VydmVyID0gdGhpcy5NdXRhdGlvbk9ic2VydmVyIHx8IHRoaXMuV2Via2l0TXV0YXRpb25PYnNlcnZlciB8fCB0aGlzLk1vek11dGF0aW9uT2JzZXJ2ZXIgfHwgKE11dGF0aW9uT2JzZXJ2ZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignTXV0YXRpb25PYnNlcnZlciBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3Nlci4nKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignV09XLmpzIGNhbm5vdCBkZXRlY3QgZG9tIG11dGF0aW9ucywgcGxlYXNlIGNhbGwgLnN5bmMoKSBhZnRlciBsb2FkaW5nIG5ldyBjb250ZW50LicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIE11dGF0aW9uT2JzZXJ2ZXIubm90U3VwcG9ydGVkID0gdHJ1ZTtcblxuICAgIE11dGF0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgcmV0dXJuIE11dGF0aW9uT2JzZXJ2ZXI7XG5cbiAgfSkoKSk7XG5cbiAgZ2V0Q29tcHV0ZWRTdHlsZSA9IHRoaXMuZ2V0Q29tcHV0ZWRTdHlsZSB8fCBmdW5jdGlvbihlbCwgcHNldWRvKSB7XG4gICAgdGhpcy5nZXRQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24ocHJvcCkge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmIChwcm9wID09PSAnZmxvYXQnKSB7XG4gICAgICAgIHByb3AgPSAnc3R5bGVGbG9hdCc7XG4gICAgICB9XG4gICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZVJYLnRlc3QocHJvcCkpIHtcbiAgICAgICAgcHJvcC5yZXBsYWNlKGdldENvbXB1dGVkU3R5bGVSWCwgZnVuY3Rpb24oXywgX2NoYXIpIHtcbiAgICAgICAgICByZXR1cm4gX2NoYXIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKChyZWYgPSBlbC5jdXJyZW50U3R5bGUpICE9IG51bGwgPyByZWZbcHJvcF0gOiB2b2lkIDApIHx8IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBnZXRDb21wdXRlZFN0eWxlUlggPSAvKFxcLShbYS16XSl7MX0pL2c7XG5cbiAgdGhpcy5XT1cgPSAoZnVuY3Rpb24oKSB7XG4gICAgV09XLnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgICAgIGJveENsYXNzOiAnd293JyxcbiAgICAgIGFuaW1hdGVDbGFzczogJ2FuaW1hdGVkJyxcbiAgICAgIG9mZnNldDogMCxcbiAgICAgIG1vYmlsZTogdHJ1ZSxcbiAgICAgIGxpdmU6IHRydWUsXG4gICAgICBjYWxsYmFjazogbnVsbCxcbiAgICAgIHNjcm9sbENvbnRhaW5lcjogbnVsbFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBXT1cob3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLnNjcm9sbENhbGxiYWNrID0gYmluZCh0aGlzLnNjcm9sbENhbGxiYWNrLCB0aGlzKTtcbiAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlciA9IGJpbmQodGhpcy5zY3JvbGxIYW5kbGVyLCB0aGlzKTtcbiAgICAgIHRoaXMucmVzZXRBbmltYXRpb24gPSBiaW5kKHRoaXMucmVzZXRBbmltYXRpb24sIHRoaXMpO1xuICAgICAgdGhpcy5zdGFydCA9IGJpbmQodGhpcy5zdGFydCwgdGhpcyk7XG4gICAgICB0aGlzLnNjcm9sbGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY29uZmlnID0gdGhpcy51dGlsKCkuZXh0ZW5kKG9wdGlvbnMsIHRoaXMuZGVmYXVsdHMpO1xuICAgICAgaWYgKG9wdGlvbnMuc2Nyb2xsQ29udGFpbmVyICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb25maWcuc2Nyb2xsQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnNjcm9sbENvbnRhaW5lcik7XG4gICAgICB9XG4gICAgICB0aGlzLmFuaW1hdGlvbk5hbWVDYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICB0aGlzLndvd0V2ZW50ID0gdGhpcy51dGlsKCkuY3JlYXRlRXZlbnQodGhpcy5jb25maWcuYm94Q2xhc3MpO1xuICAgIH1cblxuICAgIFdPVy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICBpZiAoKHJlZiA9IGRvY3VtZW50LnJlYWR5U3RhdGUpID09PSBcImludGVyYWN0aXZlXCIgfHwgcmVmID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51dGlsKCkuYWRkRXZlbnQoZG9jdW1lbnQsICdET01Db250ZW50TG9hZGVkJywgdGhpcy5zdGFydCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hlZCA9IFtdO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW4sIHJlZjtcbiAgICAgIHRoaXMuc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5ib3hlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgICByZWYgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5cIiArIHRoaXMuY29uZmlnLmJveENsYXNzKTtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBib3ggPSByZWZbal07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGJveCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy5hbGwgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgICAgcmVmID0gdGhpcy5ib3hlcztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICBib3ggPSByZWZbal07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGJveCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9KS5jYWxsKHRoaXMpO1xuICAgICAgaWYgKHRoaXMuYm94ZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKCkpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0U3R5bGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWYgPSB0aGlzLmJveGVzO1xuICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYm94ID0gcmVmW2pdO1xuICAgICAgICAgICAgdGhpcy5hcHBseVN0eWxlKGJveCwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQoKSkge1xuICAgICAgICB0aGlzLnV0aWwoKS5hZGRFdmVudCh0aGlzLmNvbmZpZy5zY3JvbGxDb250YWluZXIgfHwgd2luZG93LCAnc2Nyb2xsJywgdGhpcy5zY3JvbGxIYW5kbGVyKTtcbiAgICAgICAgdGhpcy51dGlsKCkuYWRkRXZlbnQod2luZG93LCAncmVzaXplJywgdGhpcy5zY3JvbGxIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMuc2Nyb2xsQ2FsbGJhY2ssIDUwKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNvbmZpZy5saXZlKSB7XG4gICAgICAgIHJldHVybiBuZXcgTXV0YXRpb25PYnNlcnZlcigoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVjb3Jkcykge1xuICAgICAgICAgICAgdmFyIGssIGxlbjEsIG5vZGUsIHJlY29yZCwgcmVzdWx0cztcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWNvcmRzLmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgICAgICAgICByZWNvcmQgPSByZWNvcmRzW2tdO1xuICAgICAgICAgICAgICByZXN1bHRzLnB1c2goKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBsLCBsZW4yLCByZWYxLCByZXN1bHRzMTtcbiAgICAgICAgICAgICAgICByZWYxID0gcmVjb3JkLmFkZGVkTm9kZXMgfHwgW107XG4gICAgICAgICAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGwgPSAwLCBsZW4yID0gcmVmMS5sZW5ndGg7IGwgPCBsZW4yOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgIG5vZGUgPSByZWYxW2xdO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0czEucHVzaCh0aGlzLmRvU3luYyhub2RlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzMTtcbiAgICAgICAgICAgICAgfSkuY2FsbChfdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc3RvcHBlZCA9IHRydWU7XG4gICAgICB0aGlzLnV0aWwoKS5yZW1vdmVFdmVudCh0aGlzLmNvbmZpZy5zY3JvbGxDb250YWluZXIgfHwgd2luZG93LCAnc2Nyb2xsJywgdGhpcy5zY3JvbGxIYW5kbGVyKTtcbiAgICAgIHRoaXMudXRpbCgpLnJlbW92ZUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMuc2Nyb2xsSGFuZGxlcik7XG4gICAgICBpZiAodGhpcy5pbnRlcnZhbCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICBpZiAoTXV0YXRpb25PYnNlcnZlci5ub3RTdXBwb3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9TeW5jKHRoaXMuZWxlbWVudCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuZG9TeW5jID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIGJveCwgaiwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlIHx8IGVsZW1lbnQ7XG4gICAgICByZWYgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyB0aGlzLmNvbmZpZy5ib3hDbGFzcyk7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gcmVmW2pdO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKHRoaXMuYWxsLCBib3gpIDwgMCkge1xuICAgICAgICAgIHRoaXMuYm94ZXMucHVzaChib3gpO1xuICAgICAgICAgIHRoaXMuYWxsLnB1c2goYm94KTtcbiAgICAgICAgICBpZiAodGhpcy5zdG9wcGVkIHx8IHRoaXMuZGlzYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldFN0eWxlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlTdHlsZShib3gsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zY3JvbGxlZCA9IHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oYm94KSB7XG4gICAgICB0aGlzLmFwcGx5U3R5bGUoYm94KTtcbiAgICAgIGJveC5jbGFzc05hbWUgPSBib3guY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLmNvbmZpZy5hbmltYXRlQ2xhc3M7XG4gICAgICBpZiAodGhpcy5jb25maWcuY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbmZpZy5jYWxsYmFjayhib3gpO1xuICAgICAgfVxuICAgICAgdGhpcy51dGlsKCkuZW1pdEV2ZW50KGJveCwgdGhpcy53b3dFdmVudCk7XG4gICAgICB0aGlzLnV0aWwoKS5hZGRFdmVudChib3gsICdhbmltYXRpb25lbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcbiAgICAgIHRoaXMudXRpbCgpLmFkZEV2ZW50KGJveCwgJ29hbmltYXRpb25lbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcbiAgICAgIHRoaXMudXRpbCgpLmFkZEV2ZW50KGJveCwgJ3dlYmtpdEFuaW1hdGlvbkVuZCcsIHRoaXMucmVzZXRBbmltYXRpb24pO1xuICAgICAgdGhpcy51dGlsKCkuYWRkRXZlbnQoYm94LCAnTVNBbmltYXRpb25FbmQnLCB0aGlzLnJlc2V0QW5pbWF0aW9uKTtcbiAgICAgIHJldHVybiBib3g7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuYXBwbHlTdHlsZSA9IGZ1bmN0aW9uKGJveCwgaGlkZGVuKSB7XG4gICAgICB2YXIgZGVsYXksIGR1cmF0aW9uLCBpdGVyYXRpb247XG4gICAgICBkdXJhdGlvbiA9IGJveC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd293LWR1cmF0aW9uJyk7XG4gICAgICBkZWxheSA9IGJveC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd293LWRlbGF5Jyk7XG4gICAgICBpdGVyYXRpb24gPSBib3guZ2V0QXR0cmlidXRlKCdkYXRhLXdvdy1pdGVyYXRpb24nKTtcbiAgICAgIHJldHVybiB0aGlzLmFuaW1hdGUoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY3VzdG9tU3R5bGUoYm94LCBoaWRkZW4sIGR1cmF0aW9uLCBkZWxheSwgaXRlcmF0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5hbmltYXRlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIGluIHdpbmRvdykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgV09XLnByb3RvdHlwZS5yZXNldFN0eWxlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYm94LCBqLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMuYm94ZXM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYm94ID0gcmVmW2pdO1xuICAgICAgICByZXN1bHRzLnB1c2goYm94LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUucmVzZXRBbmltYXRpb24gPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIHRhcmdldDtcbiAgICAgIGlmIChldmVudC50eXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignYW5pbWF0aW9uZW5kJykgPj0gMCkge1xuICAgICAgICB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5jbGFzc05hbWUgPSB0YXJnZXQuY2xhc3NOYW1lLnJlcGxhY2UodGhpcy5jb25maWcuYW5pbWF0ZUNsYXNzLCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLmN1c3RvbVN0eWxlID0gZnVuY3Rpb24oYm94LCBoaWRkZW4sIGR1cmF0aW9uLCBkZWxheSwgaXRlcmF0aW9uKSB7XG4gICAgICBpZiAoaGlkZGVuKSB7XG4gICAgICAgIHRoaXMuY2FjaGVBbmltYXRpb25OYW1lKGJveCk7XG4gICAgICB9XG4gICAgICBib3guc3R5bGUudmlzaWJpbGl0eSA9IGhpZGRlbiA/ICdoaWRkZW4nIDogJ3Zpc2libGUnO1xuICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMudmVuZG9yU2V0KGJveC5zdHlsZSwge1xuICAgICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiBkdXJhdGlvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWxheSkge1xuICAgICAgICB0aGlzLnZlbmRvclNldChib3guc3R5bGUsIHtcbiAgICAgICAgICBhbmltYXRpb25EZWxheTogZGVsYXlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMudmVuZG9yU2V0KGJveC5zdHlsZSwge1xuICAgICAgICAgIGFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiBpdGVyYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLnZlbmRvclNldChib3guc3R5bGUsIHtcbiAgICAgICAgYW5pbWF0aW9uTmFtZTogaGlkZGVuID8gJ25vbmUnIDogdGhpcy5jYWNoZWRBbmltYXRpb25OYW1lKGJveClcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGJveDtcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS52ZW5kb3JzID0gW1wibW96XCIsIFwid2Via2l0XCJdO1xuXG4gICAgV09XLnByb3RvdHlwZS52ZW5kb3JTZXQgPSBmdW5jdGlvbihlbGVtLCBwcm9wZXJ0aWVzKSB7XG4gICAgICB2YXIgbmFtZSwgcmVzdWx0cywgdmFsdWUsIHZlbmRvcjtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIHZhbHVlID0gcHJvcGVydGllc1tuYW1lXTtcbiAgICAgICAgZWxlbVtcIlwiICsgbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdHMxO1xuICAgICAgICAgIHJlZiA9IHRoaXMudmVuZG9ycztcbiAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgdmVuZG9yID0gcmVmW2pdO1xuICAgICAgICAgICAgcmVzdWx0czEucHVzaChlbGVtW1wiXCIgKyB2ZW5kb3IgKyAobmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSkgKyAobmFtZS5zdWJzdHIoMSkpXSA9IHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICB9KS5jYWxsKHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLnZlbmRvckNTUyA9IGZ1bmN0aW9uKGVsZW0sIHByb3BlcnR5KSB7XG4gICAgICB2YXIgaiwgbGVuLCByZWYsIHJlc3VsdCwgc3R5bGUsIHZlbmRvcjtcbiAgICAgIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgICAgIHJlc3VsdCA9IHN0eWxlLmdldFByb3BlcnR5Q1NTVmFsdWUocHJvcGVydHkpO1xuICAgICAgcmVmID0gdGhpcy52ZW5kb3JzO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHZlbmRvciA9IHJlZltqXTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IHN0eWxlLmdldFByb3BlcnR5Q1NTVmFsdWUoXCItXCIgKyB2ZW5kb3IgKyBcIi1cIiArIHByb3BlcnR5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuYW5pbWF0aW9uTmFtZSA9IGZ1bmN0aW9uKGJveCkge1xuICAgICAgdmFyIGFuaW1hdGlvbk5hbWUsIGVycm9yO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYW5pbWF0aW9uTmFtZSA9IHRoaXMudmVuZG9yQ1NTKGJveCwgJ2FuaW1hdGlvbi1uYW1lJykuY3NzVGV4dDtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFuaW1hdGlvbk5hbWUgPSBnZXRDb21wdXRlZFN0eWxlKGJveCkuZ2V0UHJvcGVydHlWYWx1ZSgnYW5pbWF0aW9uLW5hbWUnKTtcbiAgICAgIH1cbiAgICAgIGlmIChhbmltYXRpb25OYW1lID09PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuY2FjaGVBbmltYXRpb25OYW1lID0gZnVuY3Rpb24oYm94KSB7XG4gICAgICByZXR1cm4gdGhpcy5hbmltYXRpb25OYW1lQ2FjaGUuc2V0KGJveCwgdGhpcy5hbmltYXRpb25OYW1lKGJveCkpO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLmNhY2hlZEFuaW1hdGlvbk5hbWUgPSBmdW5jdGlvbihib3gpIHtcbiAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbk5hbWVDYWNoZS5nZXQoYm94KTtcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5zY3JvbGxIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUuc2Nyb2xsQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBib3g7XG4gICAgICBpZiAodGhpcy5zY3JvbGxlZCkge1xuICAgICAgICB0aGlzLnNjcm9sbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm94ZXMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzO1xuICAgICAgICAgIHJlZiA9IHRoaXMuYm94ZXM7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYm94ID0gcmVmW2pdO1xuICAgICAgICAgICAgaWYgKCEoYm94KSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZShib3gpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvdyhib3gpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChib3gpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfSkuY2FsbCh0aGlzKTtcbiAgICAgICAgaWYgKCEodGhpcy5ib3hlcy5sZW5ndGggfHwgdGhpcy5jb25maWcubGl2ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5vZmZzZXRUb3AgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgdG9wO1xuICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0VG9wID09PSB2b2lkIDApIHtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIH1cbiAgICAgIHRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9wO1xuICAgIH07XG5cbiAgICBXT1cucHJvdG90eXBlLmlzVmlzaWJsZSA9IGZ1bmN0aW9uKGJveCkge1xuICAgICAgdmFyIGJvdHRvbSwgb2Zmc2V0LCB0b3AsIHZpZXdCb3R0b20sIHZpZXdUb3A7XG4gICAgICBvZmZzZXQgPSBib3guZ2V0QXR0cmlidXRlKCdkYXRhLXdvdy1vZmZzZXQnKSB8fCB0aGlzLmNvbmZpZy5vZmZzZXQ7XG4gICAgICB2aWV3VG9wID0gKHRoaXMuY29uZmlnLnNjcm9sbENvbnRhaW5lciAmJiB0aGlzLmNvbmZpZy5zY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wKSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICB2aWV3Qm90dG9tID0gdmlld1RvcCArIE1hdGgubWluKHRoaXMuZWxlbWVudC5jbGllbnRIZWlnaHQsIHRoaXMudXRpbCgpLmlubmVySGVpZ2h0KCkpIC0gb2Zmc2V0O1xuICAgICAgdG9wID0gdGhpcy5vZmZzZXRUb3AoYm94KTtcbiAgICAgIGJvdHRvbSA9IHRvcCArIGJveC5jbGllbnRIZWlnaHQ7XG4gICAgICByZXR1cm4gdG9wIDw9IHZpZXdCb3R0b20gJiYgYm90dG9tID49IHZpZXdUb3A7XG4gICAgfTtcblxuICAgIFdPVy5wcm90b3R5cGUudXRpbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3V0aWwgIT0gbnVsbCA/IHRoaXMuX3V0aWwgOiB0aGlzLl91dGlsID0gbmV3IFV0aWwoKTtcbiAgICB9O1xuXG4gICAgV09XLnByb3RvdHlwZS5kaXNhYmxlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICF0aGlzLmNvbmZpZy5tb2JpbGUgJiYgdGhpcy51dGlsKCkuaXNNb2JpbGUobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgfTtcblxuICAgIHJldHVybiBXT1c7XG5cbiAgfSkoKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBXT1cgfSBmcm9tIFwid293anNcIjtcclxuaW1wb3J0IFwiYW5pbWF0ZS5jc3NcIjtcclxuaW1wb3J0IFwid293anMvY3NzL2xpYnMvYW5pbWF0ZS5jc3NcIjtcclxuXHJcbm5ldyBXT1coe1xyXG5cdG1vYmlsZTogdHJ1ZSxcclxuXHQvLyByZXNldEFuaW1hdGlvbjogZmFsc2UsXHJcblx0Ly8gY2FsbGJhY2s6IGZ1bmN0aW9uIChib3gpIHtcclxuXHQvLyBcdGlmIChib3guY2xhc3NMaXN0LmNvbnRhaW5zKFwicmVxdWVzdF9fY29udGVudC10ZXh0LS1hbmltXCIpKSB7XHJcblx0Ly8gXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdC8vIFx0XHRcdGJveC5jbGFzc0xpc3QuYWRkKFwiYW5pbS1maWxsLXRleHRcIik7XHJcblx0Ly8gXHRcdH0sIDIyMDApO1xyXG5cdC8vIFx0fVxyXG5cdC8vIFx0Ly8gdGhlIGNhbGxiYWNrIGlzIGZpcmVkIGV2ZXJ5IHRpbWUgYW4gYW5pbWF0aW9uIGlzIHN0YXJ0ZWRcclxuXHQvLyBcdC8vIHRoZSBhcmd1bWVudCB0aGF0IGlzIHBhc3NlZCBpbiBpcyB0aGUgRE9NIG5vZGUgYmVpbmcgYW5pbWF0ZWRcclxuXHQvLyB9LFxyXG59KS5pbml0KCk7XHJcblxyXG5pZiAod2luZG93LmlubmVyV2lkdGggPj0gNzY5KSB7XHJcblx0Y29uc3QgYmFubmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmFubmVyXCIpO1xyXG5cclxuXHRmdW5jdGlvbiBoYW5kbGVTY3JvbGwoKSB7XHJcblx0XHRiYW5uZXJzLmZvckVhY2goYmFubmVyID0+IHtcclxuXHRcdFx0Y29uc3QgYmFubmVySGVpZ2h0ID0gYmFubmVyLmNsaWVudEhlaWdodDtcclxuXHRcdFx0Y29uc3QgYmFubmVyVG9wID0gYmFubmVyLm9mZnNldFRvcDtcclxuXHJcblx0XHRcdGxldCBzY3JvbGxQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cdFx0XHRsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHNjcm9sbFBvc2l0aW9uICsgd2luZG93SGVpZ2h0ID4gYmFubmVyVG9wICYmXHJcblx0XHRcdFx0c2Nyb2xsUG9zaXRpb24gPCBiYW5uZXJUb3AgKyBiYW5uZXJIZWlnaHRcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0bGV0IHBvc2l0aW9uID0gKHNjcm9sbFBvc2l0aW9uIC0gYmFubmVyVG9wKSAvIDI7XHJcblx0XHRcdFx0YmFubmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGBjZW50ZXIgJHtwb3NpdGlvbn1weGA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YmFubmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiY2VudGVyIDBcIjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBoYW5kbGVTY3JvbGwpO1xyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBoYW5kbGVTY3JvbGwpO1xyXG59XHJcbiIsImltcG9ydCBcInN3aXBlci9jc3NcIjtcclxuaW1wb3J0IFwic3dpcGVyL2Nzcy9idW5kbGVcIjtcclxuaW1wb3J0IFwiLi4vc2Nzcy9pbmRleC5zY3NzXCI7XHJcblxyXG5pbXBvcnQgXCIuL2NvbXBvbmVudHMvaGVhZGVyXCI7XHJcblxyXG5pbXBvcnQgXCIuL3BhZ2VzL21haW4tcGFnZVwiO1xyXG4iXSwibmFtZXMiOlsiV09XIiwibW9iaWxlIiwiaW5pdCIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJiYW5uZXJzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaGFuZGxlU2Nyb2xsIiwiZm9yRWFjaCIsImJhbm5lciIsImJhbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsImJhbm5lclRvcCIsIm9mZnNldFRvcCIsInNjcm9sbFBvc2l0aW9uIiwic2Nyb2xsWSIsIndpbmRvd0hlaWdodCIsImlubmVySGVpZ2h0IiwicG9zaXRpb24iLCJzdHlsZSIsImJhY2tncm91bmRQb3NpdGlvbiIsImFkZEV2ZW50TGlzdGVuZXIiXSwic291cmNlUm9vdCI6IiJ9