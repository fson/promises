'use strict';

var defer = require('../index').defer;

/**
 * Creates a promise that is already fulfilled with value.
 */
exports.fulfilled = function (value) {
  var deferred = defer();
  deferred.fulfill(value);
  return deferred.promise;
};

/**
 * creates a promise that is already rejected with reason.
 */
exports.rejected = function (reason) {
  var deferred = defer();
  deferred.reject(reason);
  return deferred.promise;
};

/**
 * Creates a promise that is already fulfilled with value.
 */
exports.pending = function () {
  return [];
};