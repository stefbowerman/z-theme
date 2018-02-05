/**
 * Animation Helper Functions / constants
 * -----------------------------------------------------------------------------
 * A collection of functions that help with animations in javascript
 *
 */

slate.animations = (function($) {

  // First add some extra easing equations
  // To add more see the full library - https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
  $.extend( $.easing, {
    // t: current time, b: begInnIng value, c: change In value, d: duration
    easeInQuint: function (x, t, b, c, d) {
      return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
      return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
      return c/2*((t-=2)*t*t*t*t + 2) + b;
    }
  });

  // Match those set in variables.scss
  var _transitionTimingDurations = {
    base:     300
 // fast:     150,
 // slow:     600
  };

 /**
  * Get one of the durations stored in the variable defined above
  * If the requested duration doesn't exist, fallback to the base
  *
  * @param {string} key - string matching one of the key names
  * @return {int} - duration in ms
  */
  function getTransitionTimingDuration(key) {
    var k = 'base';
    if(_transitionTimingDurations.hasOwnProperty(key)) {
      k = key;
    }
    return _transitionTimingDurations[k];
  }

  return {
    getTransitionTimingDuration: getTransitionTimingDuration
  };

}(jQuery));