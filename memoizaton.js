/**
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
 * @param resolver  if provided gets called for each function call with the exact same set of parameters as the
 *                  original function, the resolver function should provide the memoization key.
 * @param timeout   timeout for cached values in milliseconds
 */

// cache for memoized functions, using array with key-value
let cache = [];

function memoize(func, timeout, resolver) {
  // initialize key
  let key;

  // memoized function in which we have access to the object calling passed in function to access its arguments
  // memoize() returns a new function which wraps a caching mechanism around “func”
  memoized = function () {
    // TODO defining what types keys should have

    // using hashCode as in Java
    // source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/

    String.prototype.hashCode = function () {
      var hash = 0;
      if (this.length == 0) return hash;
      for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    };

    if (resolver) {
      resolverKey = resolver.apply(this, arguments);
      // key = resolver.apply(this, arguments);
      console.log("key from resolver: " + resolverKey);
      // console.log("resolverKey typeof: " + typeof resolverKey);

      if (typeof resolverKey === "string") {
        key = resolverKey;
      } else {
        let resolverKeyToString = resolverKey.toString();
        key = resolverKeyToString.hashCode();
        console.log("hashed key: " + key);
      }
    } else {
      // use the first argument of the memoized function to create a cache key
      argForKey = arguments[0].toString();

      key = argForKey.hashCode();
    }

    // another option to hash the key, source http://pajhome.org.uk/crypt/md5/
    // console.log("hex? " + hex_md5("hi"));

    setTimeout(() => {
      console.log("timeout: " + timeout);
      console.log("deleting " + cache[key]);
      delete cache[key];
    }, timeout);

    if (typeof cache[key] == "undefined") {
      cache[key] = func.apply(this, arguments);
    }

    console.log("value of the key: " + cache[key]);

    return cache[key];
  };
  return memoized;
}

module.exports = {
  memoize,
};
