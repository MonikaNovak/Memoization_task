var md5 = require("md5");

/**
 * Task description:
 * Creates a function that memoizes the result of func. If resolver is provided,
 * it determines the cache key for storing the result based on the arguments provided to the memorized function.
 * By default, the first argument provided to the memorized function is used as the map cache key. The memorized values
 * timeout after the timeout exceeds. The timeout is in defined in milliseconds.
 *
 * Example:
 * function addToTime(year, month, day) {
 *  return Date.now() + Date(year, month, day);
 * }
 *
 * const memoized = memoization.memoize(addToTime, (year, month, day) => year + month + day, 5000)
 *
 * // call the provided function cache the result and return the value
 * const result = memoized(1, 11, 26); // result = 1534252012350
 *
 * // because there was no timeout this call should return the memorized value from the first call
 * const secondResult = memoized(1, 11, 26); // secondResult = 1534252012350
 *
 * // after 5000 ms the value is not valid anymore and the original function should be called again
 * const thirdResult = memoized(1, 11, 26); // thirdResult = 1534252159271
 *
 * @param func      the function for which the return values should be cached
 * @param timeout   timeout for cached values in milliseconds
 * @param resolver  if provided gets called for each function call with the exact same set of parameters as the
 *                  original function, the resolver function should provide the memoization key.
 */

// cache for memoized functions, using array with key as index and result as value
let cache = [];

function memoize(func, timeout, resolver) {
  // initialize key
  let key;

  // memoized function in which we have access to the object calling passed in function to access its arguments
  // so memoize() returns a new function which wraps the caching around “func”
  let memoized = function () {
    // TODO defining what types keys should have

    // determine cache key depending if resolver is provided
    if (
      resolver &&
      (typeof resolver.apply(this, arguments) === "string" || typeof resolver.apply(this, arguments) === "number")
    ) {
      // expected that resolver provides a valid (unique) cache key that is a string or a number
      key = resolver.apply(this, arguments);
      console.log("key from resolver: " + key + " type of: " + typeof key);
    } else {
      // using the md5 package to hash the input and create a unique cahce key

      // if following the task description, solution with using first argument of memoized function to create cache key would be:
      // key = md5(arguments[0].toString);
      // but considering that
      // 1. the argument can be any data type
      // 2. different memoized function can have identical first arguments
      // we can, for example, create unique string from combination of the function as a string and provided arguments and hash those:
      let stringFromFunc = func.toString() + "-" + Array.prototype.slice.call(arguments).join("-");
      key = md5(stringFromFunc);
      console.log("string created from function: " + stringFromFunc);
      console.log("created key: " + key);
    }

    // deleting result after timeout exceeds
    setTimeout(() => {
      console.log("timeout: " + timeout);
      console.log("deleting " + cache[key]);
      delete cache[key];
    }, timeout);

    if (typeof cache[key] == "undefined") {
      cache[key] = func.apply(this, arguments);
    }

    console.log("stored result: " + cache[key]);

    return cache[key];
  };
  return memoized;
}

module.exports = {
  memoize,
};
