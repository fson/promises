'use strict';

var promises = require('../index');

/**
 * Creates a promise that is already fulfilled with value.
 */
exports.fulfilled = promises.fulfilled;

/**
 * Creates a promise that is already rejected with reason.
 */
exports.rejected = promises.rejected;

/**
 * Creates a tuple consisting of { promise, fulfill, reject }.
 */
exports.pending = promises.defer;