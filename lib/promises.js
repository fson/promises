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
    };
  }

  var isFunction = function (object) {
    return typeof object === 'function';
  };

  var identity = function (object) {
    return object;
  };

  var fulfilled = exports.fulfilled = function (value) {
    if (isPromise(value)) return value;
    return {
      then: function (onFulfilled) {
        var result = defer();
        if (typeof onFulfilled !== 'function') onFulfilled = identity;
        nextTick(function () {
          result.resolve(call(onFulfilled, value));
        });
        return result.promise;
      }
    };
  };
  var rejected = exports.rejected = function (reason) {
    if (isPromise(reason)) return reason;
    return {
      then: function (onFulfilled, onRejected) {
        var result = defer();
        if (typeof onRejected !== 'function') onRejected = rejected;
        nextTick(function () {
          result.resolve(call(onRejected, reason));
        });
        return result.promise;
      }
    };
  };

  var slice = [].slice;

  var call = function (fun) {
    var result;
    try {
      result = fun.apply(null, slice.call(arguments, 1));
    } catch (e) {
      result = rejected(e);
    }
    return result;
  };

  var defer = exports.defer = function () {
    var  value,
      pending = [],
      resolve = function (valueOrPromise) {
        value = fulfilled(valueOrPromise);
        for (var i = 0; i < pending.length; i++) {
          value.then.apply(value, pending[i]);
        }
        pending = null;
        return this;
      };
    var deferred = {
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
            result.resolve(call(onRejected, reason));
          };

          if (pending) {
            pending.push([fulfillCallback, rejectCallback]);
          } else {
            nextTick(function () {
              value.then(fulfillCallback, rejectCallback);
            });
          }
          return result.promise;
        }
      },
      resolve: resolve,
      fulfill: function (value) {
        resolve(value);
      },
      reject: function (reason) {
        resolve(rejected(reason));
      }
    };
    return deferred;
  };

})((typeof exports === 'object' && exports) || this);
