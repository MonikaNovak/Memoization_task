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

// cache for momized functions, using array with key-value
let cache = [];

function memoize(func, resolver, timeout) {
  // TODO resolver as optional argument

  // initialize key
  let key;

  // memoized function in which we have access to the object calling passed in function to access its arguments
  // memoize() returns a new function which wraps a caching mechanism around “func”
  memoized = function () {
    // (LEARN MORE what exactly is happening when you call function.prototype.apply() + "this")
    // TODO defining what types keys should have

    // console.log("arguments1: " + args[0]);
    // console.log("arguments2: " + args[1]);
    // console.log("arguments3: " + args[2]);

    if (resolver) {
      resolverKey = resolver.apply(this, arguments);
      // key = resolver.apply(this, arguments);
      console.log("key from resolver: " + resolverKey);
      // console.log("resolverKey typeof: " + typeof resolverKey);
      if (typeof resolverKey === "string") {
        key = resolverKey;
      } else {
        // TODO other types, or multiple parameters, for now only number

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

        let resolverKeyToString = resolverKey.toString();
        key = resolverKeyToString.hashCode();
        console.log("hashed key: " + hashedKey);
      }
    } else {
      // TODO use hashcode to create a key from args from passed func
      for (let i = 0; i < arguments.length; i++) {
        console.log("arguments " + i + ": " + arguments[i]);
      }

      key = null;
    }

    // console.log("hex? " + hex_md5("hi"));

    // if timeout is provided, cached item is deleted after
    if (timeout) {
      setTimeout(() => {
        console.log("timeout: " + timeout);
        console.log("deleting " + cache[key]);
        delete cache[key];
      }, timeout);
    }

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
