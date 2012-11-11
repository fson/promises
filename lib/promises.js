(function (exports) {
  'use strict';

  var isPromise = function (value) {
    return !!(value && typeof value.then === 'function');
  };

  var nextTick;
  if (typeof process !== 'undefined') {
    // Node
    nextTick = process.nextTick;
  } else {
    // Browser
    nextTick = function (task) {
      setTimeout(task, 0);
    }
  }

  var isFunction = function (object) {
    return typeof object === 'function';
  };

  var fulfilled = function (value) {
    if (isPromise(value)) return value;
    return {
      then: function (onFulfilled) {
        return defer().resolve(call(onFulfilled, value));
      }
    };
  };
  var rejected = function (reason) {
    if (isPromise(value)) return value;
    return {
      then: function (onFulfilled, onRejected) {
        return defer().resolve(call(onRejected, value));
      }
    };
  };

  var call = function (fun) {
    var result;
    try {
      result = fun.apply(null, arguments);
    } catch (e) {
      result = rejected(e);
    }
    return result;
  };

  var defer = exports.defer = function () {
    var pending = [], value;
    return {
      promise: {
        then: function (onFulfilled, onRejected) {
          var result = defer(),
            fulfillCallback,
            rejectCallback;
          if (!isFunction(onFulfilled)) onFulfilled = fulfilled;
          if (!isFunction(onRejected)) onRejected = rejected;

          fulfillCallback = function (value) {
            result.resolve(call(onFulfilled, value));
          };

          rejectCallback = function (reason) {
            result.resolve(call(onRejected, value));
          };

          if (pending) {
            pending.push([fulfillCallback, rejectCallback]);
          } else {
            value.then(fulfillCallback, rejectCallback);
          }
          return result;
        }
      },
      resolve: function (valueOrPromise) {
        value = fulfilled(valueOrPromise);
        for (var i = 0; i < pending.length; i++) {
          value.then.apply(value, pending[i]);
        };
        pending = null;
        return this;
      }
    }
  };

})((typeof exports === 'object' && exports) || this));