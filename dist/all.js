(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.async = {})));
}(this, function (exports) { 'use strict';

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply$1(func, thisArg, args) {
    var length = args.length;
    switch (length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  var funcTag = '[object Function]';
  var genTag = '[object GeneratorFunction]';
  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString$2 = objectProto$4.toString;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8 which returns 'object' for typed array constructors, and
    // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
    var tag = isObject(value) ? objectToString$2.call(value) : '';
    return tag == funcTag || tag == genTag;
  }

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3);
   * // => 3
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3');
   * // => 3
   */
  function toNumber(value) {
    if (isObject(value)) {
      var other = isFunction(value.valueOf) ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  var INFINITY = 1 / 0;
  var MAX_INTEGER = 1.7976931348623157e+308;
  /**
   * Converts `value` to an integer.
   *
   * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3');
   * // => 3
   */
  function toInteger(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    var remainder = value % 1;
    return value === value ? (remainder ? value - remainder : value) : 0;
  }

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * Creates a function that invokes `func` with the `this` binding of the
   * created function and arguments from `start` and beyond provided as an array.
   *
   * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var say = _.rest(function(what, names) {
   *   return what + ' ' + _.initial(names).join(', ') +
   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
   * });
   *
   * say('hello', 'fred', 'barney', 'pebbles');
   * // => 'hello fred, barney, & pebbles'
   */
  function rest(func, start) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      switch (start) {
        case 0: return func.call(this, array);
        case 1: return func.call(this, args[0], array);
        case 2: return func.call(this, args[0], args[1], array);
      }
      var otherArgs = Array(start + 1);
      index = -1;
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = array;
      return apply$1(func, this, otherArgs);
    };
  }

  function applyEach$1(eachfn) {
      return rest(function (fns, args) {
          var go = rest(function (args) {
              var that = this;
              var callback = args.pop();
              return eachfn(fns, function (fn, _, cb) {
                  fn.apply(that, args.concat([cb]));
              }, callback);
          });
          if (args.length) {
              return go.apply(this, args);
          } else {
              return go;
          }
      });
  }

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT$1 = 'Expected a function';

  /**
   * Creates a function that invokes `func`, with the `this` binding and arguments
   * of the created function, while it's called less than `n` times. Subsequent
   * calls to the created function return the result of the last `func` invocation.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {number} n The number of calls at which `func` is no longer invoked.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * jQuery(element).on('click', _.before(5, addContactToList));
   * // => allows adding up to 4 contacts to the list
   */
  function before(n, func) {
    var result;
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    n = toInteger(n);
    return function() {
      if (--n > 0) {
        result = func.apply(this, arguments);
      }
      if (n <= 1) {
        func = undefined;
      }
      return result;
    };
  }

  /**
   * Creates a function that is restricted to invoking `func` once. Repeat calls
   * to the function return the value of the first invocation. The `func` is
   * invoked with the `this` binding and arguments of the created function.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // `initialize` invokes `createApplication` once
   */
  function once(func) {
    return before(2, func);
  }

  /**
   * A no-operation function that returns `undefined` regardless of the
   * arguments it receives.
   *
   * @static
   * @memberOf _
   * @category Util
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.noop(object) === undefined;
   * // => true
   */
  function noop() {
    // No operation performed.
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * Gets the "length" property value of `object`.
   *
   * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
   * that affects Safari on at least iOS 8.1-8.3 ARM64.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {*} Returns the "length" value.
   */
  var getLength = baseProperty('length');

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null &&
      !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
  }

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Built-in value references. */
  var getPrototypeOf = Object.getPrototypeOf;

  /**
   * The base implementation of `_.has` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHas(object, key) {
    // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
    // that are composed entirely of index properties, return `false` for
    // `hasOwnProperty` checks of them.
    return hasOwnProperty.call(object, key) ||
      (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = Object.keys;

  /**
   * The base implementation of `_.keys` which doesn't skip the constructor
   * property of prototypes or treat sparse arrays as dense.
   *
   * @private
   * @type Function
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    return nativeKeys(Object(object));
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /** Used for built-in method references. */
  var objectProto$2 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto$2.toString;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty$1.call(value, 'callee') &&
      (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /** `Object#toString` result references. */
  var stringTag = '[object String]';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString$1 = objectProto$3.toString;

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' ||
      (!isArray(value) && isObjectLike(value) && objectToString$1.call(value) == stringTag);
  }

  /**
   * Creates an array of index keys for `object` values of arrays,
   * `arguments` objects, and strings, otherwise `null` is returned.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array|null} Returns index keys, else `null`.
   */
  function indexKeys(object) {
    var length = object ? object.length : undefined;
    if (isLength(length) &&
        (isArray(object) || isString(object) || isArguments(object))) {
      return baseTimes(length, String);
    }
    return null;
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$1;

    return value === proto;
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    var isProto = isPrototype(object);
    if (!(isProto || isArrayLike(object))) {
      return baseKeys(object);
    }
    var indexes = indexKeys(object),
        skipIndexes = !!indexes,
        result = indexes || [],
        length = result.length;

    for (var key in object) {
      if (baseHas(object, key) &&
          !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
          !(isProto && key == 'constructor')) {
        result.push(key);
      }
    }
    return result;
  }

  function keyIterator(coll) {
      var i = -1;
      var len;
      if (isArrayLike(coll)) {
          len = coll.length;
          return function next() {
              i++;
              return i < len ? i : null;
          };
      } else {
          var okeys = keys(coll);
          len = okeys.length;
          return function next() {
              i++;
              return i < len ? okeys[i] : null;
          };
      }
  }

  function onlyOnce(fn) {
      return function () {
          if (fn === null) throw new Error("Callback was already called.");
          fn.apply(this, arguments);
          fn = null;
      };
  }

  function eachOf(object, iterator, callback) {
      callback = once(callback || noop);
      object = object || [];

      var iter = keyIterator(object);
      var key,
          completed = 0;

      while ((key = iter()) != null) {
          completed += 1;
          iterator(object[key], key, onlyOnce(done));
      }

      if (completed === 0) callback(null);

      function done(err) {
          completed--;
          if (err) {
              callback(err);
          }
          // Check key is null in case iterator isn't exhausted
          // and done resolved synchronously.
          else if (key === null && completed <= 0) {
                  callback(null);
              }
      }
  }

  var applyEach = applyEach$1(eachOf);

  var _setImmediate = typeof setImmediate === 'function' && setImmediate;

  var _delay;
  if (_setImmediate) {
      _delay = function (fn) {
          // not a direct alias for IE10 compatibility
          _setImmediate(fn);
      };
  } else if (typeof process === 'object' && typeof process.nextTick === 'function') {
      _delay = process.nextTick;
  } else {
      _delay = function (fn) {
          setTimeout(fn, 0);
      };
  }

  var setImmediate$1 = _delay;

  function eachOfSeries(obj, iterator, callback) {
      callback = once(callback || noop);
      obj = obj || [];
      var nextKey = keyIterator(obj);
      var key = nextKey();

      function iterate() {
          var sync = true;
          if (key === null) {
              return callback(null);
          }
          iterator(obj[key], key, onlyOnce(function (err) {
              if (err) {
                  callback(err);
              } else {
                  key = nextKey();
                  if (key === null) {
                      return callback(null);
                  } else {
                      if (sync) {
                          setImmediate$1(iterate);
                      } else {
                          iterate();
                      }
                  }
              }
          }));
          sync = false;
      }
      iterate();
  }

  var applyEachSeries = applyEach$1(eachOfSeries);

  var apply = rest(function (fn, args) {
      return rest(function (callArgs) {
          return fn.apply(null, args.concat(callArgs));
      });
  });

  function asyncify(func) {
      return rest(function (args) {
          var callback = args.pop();
          var result;
          try {
              result = func.apply(this, args);
          } catch (e) {
              return callback(e);
          }
          // if result is Promise object
          if (isObject(result) && typeof result.then === 'function') {
              result.then(function (value) {
                  callback(null, value);
              })['catch'](function (err) {
                  callback(err.message ? err : new Error(err));
              });
          } else {
              callback(null, result);
          }
      });
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Creates a base function for methods like `_.forIn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * The base implementation of `baseForIn` and `baseForOwn` which iterates
   * over `object` properties returned by `keysFunc` invoking `iteratee` for
   * each property. Iteratee functions may exit iteration early by explicitly
   * returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  /**
   * This method returns the first argument given to it.
   *
   * @static
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Converts `value` to a function if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Function} Returns the function.
   */
  function toFunction(value) {
    return typeof value == 'function' ? value : identity;
  }

  /**
   * Iterates over own enumerable properties of an object invoking `iteratee`
   * for each property. The iteratee is invoked with three arguments:
   * (value, key, object). Iteratee functions may exit iteration early by
   * explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.forOwn(new Foo, function(value, key) {
   *   console.log(key);
   * });
   * // => logs 'a' then 'b' (iteration order is not guaranteed)
   */
  function forOwn(object, iteratee) {
    return object && baseForOwn(object, toFunction(iteratee));
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax$1 = Math.max;

  /**
   * Gets the index at which the first occurrence of `value` is found in `array`
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons. If `fromIndex` is negative, it's used as the offset
   * from the end of `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * _.indexOf([1, 2, 1, 2], 2);
   * // => 1
   *
   * // Search from the `fromIndex`.
   * _.indexOf([1, 2, 1, 2], 2, 2);
   * // => 3
   */
  function indexOf(array, value, fromIndex) {
    var length = array ? array.length : 0;
    if (!length) {
      return -1;
    }
    fromIndex = toInteger(fromIndex);
    if (fromIndex < 0) {
      fromIndex = nativeMax$1(length + fromIndex, 0);
    }
    return baseIndexOf(array, value, fromIndex);
  }

  function auto (tasks, concurrency, callback) {
      if (typeof arguments[1] === 'function') {
          // concurrency is optional, shift the args.
          callback = concurrency;
          concurrency = null;
      }
      callback = once(callback || noop);
      var keys$$ = keys(tasks);
      var remainingTasks = keys$$.length;
      if (!remainingTasks) {
          return callback(null);
      }
      if (!concurrency) {
          concurrency = remainingTasks;
      }

      var results = {};
      var runningTasks = 0;
      var hasError = false;

      var listeners = [];
      function addListener(fn) {
          listeners.unshift(fn);
      }
      function removeListener(fn) {
          var idx = indexOf(listeners, fn);
          if (idx >= 0) listeners.splice(idx, 1);
      }
      function taskComplete() {
          remainingTasks--;
          arrayEach(listeners.slice(), function (fn) {
              fn();
          });
      }

      addListener(function () {
          if (!remainingTasks) {
              callback(null, results);
          }
      });

      arrayEach(keys$$, function (k) {
          if (hasError) return;
          var task = isArray(tasks[k]) ? tasks[k] : [tasks[k]];
          var taskCallback = rest(function (err, args) {
              runningTasks--;
              if (args.length <= 1) {
                  args = args[0];
              }
              if (err) {
                  var safeResults = {};
                  forOwn(results, function (val, rkey) {
                      safeResults[rkey] = val;
                  });
                  safeResults[k] = args;
                  hasError = true;

                  callback(err, safeResults);
              } else {
                  results[k] = args;
                  setImmediate$1(taskComplete);
              }
          });
          var requires = task.slice(0, task.length - 1);
          // prevent dead-locks
          var len = requires.length;
          var dep;
          while (len--) {
              if (!(dep = tasks[requires[len]])) {
                  throw new Error('Has non-existent dependency in ' + requires.join(', '));
              }
              if (isArray(dep) && indexOf(dep, k) >= 0) {
                  throw new Error('Has cyclic dependencies');
              }
          }
          function ready() {
              return runningTasks < concurrency && !baseHas(results, k) && arrayEvery(requires, function (x) {
                  return baseHas(results, x);
              });
          }
          if (ready()) {
              runningTasks++;
              task[task.length - 1](taskCallback, results);
          } else {
              addListener(listener);
          }
          function listener() {
              if (ready()) {
                  runningTasks++;
                  removeListener(listener);
                  task[task.length - 1](taskCallback, results);
              }
          }
      });
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  function queue$1(worker, concurrency, payload) {
      if (concurrency == null) {
          concurrency = 1;
      } else if (concurrency === 0) {
          throw new Error('Concurrency must not be zero');
      }
      function _insert(q, data, pos, callback) {
          if (callback != null && typeof callback !== 'function') {
              throw new Error('task callback must be a function');
          }
          q.started = true;
          if (!isArray(data)) {
              data = [data];
          }
          if (data.length === 0 && q.idle()) {
              // call drain immediately if there are no tasks
              return setImmediate$1(function () {
                  q.drain();
              });
          }
          arrayEach(data, function (task) {
              var item = {
                  data: task,
                  callback: callback || noop
              };

              if (pos) {
                  q.tasks.unshift(item);
              } else {
                  q.tasks.push(item);
              }

              if (q.tasks.length === q.concurrency) {
                  q.saturated();
              }
          });
          setImmediate$1(q.process);
      }
      function _next(q, tasks) {
          return function () {
              workers -= 1;

              var removed = false;
              var args = arguments;
              arrayEach(tasks, function (task) {
                  arrayEach(workersList, function (worker, index) {
                      if (worker === task && !removed) {
                          workersList.splice(index, 1);
                          removed = true;
                      }
                  });

                  task.callback.apply(task, args);
              });
              if (q.tasks.length + workers === 0) {
                  q.drain();
              }
              q.process();
          };
      }

      var workers = 0;
      var workersList = [];
      var q = {
          tasks: [],
          concurrency: concurrency,
          payload: payload,
          saturated: noop,
          empty: noop,
          drain: noop,
          started: false,
          paused: false,
          push: function (data, callback) {
              _insert(q, data, false, callback);
          },
          kill: function () {
              q.drain = noop;
              q.tasks = [];
          },
          unshift: function (data, callback) {
              _insert(q, data, true, callback);
          },
          process: function () {
              while (!q.paused && workers < q.concurrency && q.tasks.length) {

                  var tasks = q.payload ? q.tasks.splice(0, q.payload) : q.tasks.splice(0, q.tasks.length);

                  var data = arrayMap(tasks, baseProperty('data'));

                  if (q.tasks.length === 0) {
                      q.empty();
                  }
                  workers += 1;
                  workersList.push(tasks[0]);
                  var cb = onlyOnce(_next(q, tasks));
                  worker(data, cb);
              }
          },
          length: function () {
              return q.tasks.length;
          },
          running: function () {
              return workers;
          },
          workersList: function () {
              return workersList;
          },
          idle: function () {
              return q.tasks.length + workers === 0;
          },
          pause: function () {
              q.paused = true;
          },
          resume: function () {
              if (q.paused === false) {
                  return;
              }
              q.paused = false;
              var resumeCount = Math.min(q.concurrency, q.tasks.length);
              // Need to call q.process once per concurrent
              // worker to preserve full concurrency after pause
              for (var w = 1; w <= resumeCount; w++) {
                  setImmediate$1(q.process);
              }
          }
      };
      return q;
  }

  function cargo(worker, payload) {
      return queue$1(worker, 1, payload);
  }

  function reduce(arr, memo, iterator, cb) {
      eachOfSeries(arr, function (x, i, cb) {
          iterator(memo, x, function (err, v) {
              memo = v;
              cb(err);
          });
      }, function (err) {
          cb(err, memo);
      });
  }

  function seq() /* functions... */{
      var fns = arguments;
      return rest(function (args) {
          var that = this;

          var cb = args[args.length - 1];
          if (typeof cb == 'function') {
              args.pop();
          } else {
              cb = noop;
          }

          reduce(fns, args, function (newargs, fn, cb) {
              fn.apply(that, newargs.concat([rest(function (err, nextargs) {
                  cb(err, nextargs);
              })]));
          }, function (err, results) {
              cb.apply(that, [err].concat(results));
          });
      });
  }

  var reverse = Array.prototype.reverse;

  function compose() /* functions... */{
      return seq.apply(null, reverse.call(arguments));
  }

  function concat$1(eachfn, arr, fn, callback) {
      var result = [];
      eachfn(arr, function (x, index, cb) {
          fn(x, function (err, y) {
              result = result.concat(y || []);
              cb(err);
          });
      }, function (err) {
          callback(err, result);
      });
  }

  function doParallel(fn) {
      return function (obj, iterator, callback) {
          return fn(eachOf, obj, iterator, callback);
      };
  }

  var concat = doParallel(concat$1);

  function doSeries(fn) {
      return function (obj, iterator, callback) {
          return fn(eachOfSeries, obj, iterator, callback);
      };
  }

  var concatSeries = doSeries(concat$1);

  var constant = rest(function (values) {
      var args = [null].concat(values);
      return function (cb) {
          return cb.apply(this, args);
      };
  });

  function _createTester(eachfn, check, getResult) {
      return function (arr, limit, iterator, cb) {
          function done(err) {
              if (cb) {
                  if (err) {
                      cb(err);
                  } else {
                      cb(null, getResult(false, void 0));
                  }
              }
          }
          function iteratee(x, _, callback) {
              if (!cb) return callback();
              iterator(x, function (err, v) {
                  if (cb) {
                      if (err) {
                          cb(err);
                          cb = iterator = false;
                      } else if (check(v)) {
                          cb(null, getResult(true, x));
                          cb = iterator = false;
                      }
                  }
                  callback();
              });
          }
          if (arguments.length > 3) {
              eachfn(arr, limit, iteratee, done);
          } else {
              cb = iterator;
              iterator = limit;
              eachfn(arr, iteratee, done);
          }
      };
  }

  function _findGetResult(v, x) {
      return x;
  }

  var detect = _createTester(eachOf, identity, _findGetResult);

  function _eachOfLimit(limit) {
      return function (obj, iterator, callback) {
          callback = once(callback || noop);
          obj = obj || [];
          var nextKey = keyIterator(obj);
          if (limit <= 0) {
              return callback(null);
          }
          var done = false;
          var running = 0;
          var errored = false;

          (function replenish() {
              if (done && running <= 0) {
                  return callback(null);
              }

              while (running < limit && !errored) {
                  var key = nextKey();
                  if (key === null) {
                      done = true;
                      if (running <= 0) {
                          callback(null);
                      }
                      return;
                  }
                  running += 1;
                  iterator(obj[key], key, onlyOnce(function (err) {
                      running -= 1;
                      if (err) {
                          callback(err);
                          errored = true;
                      } else {
                          replenish();
                      }
                  }));
              }
          })();
      };
  }

  function eachOfLimit(obj, limit, iterator, cb) {
      _eachOfLimit(limit)(obj, iterator, cb);
  }

  var detectLimit = _createTester(eachOfLimit, identity, _findGetResult);

  var detectSeries = _createTester(eachOfSeries, identity, _findGetResult);

  function consoleFunc(name) {
      return rest(function (fn, args) {
          fn.apply(null, args.concat([rest(function (err, args) {
              if (typeof console === 'object') {
                  if (err) {
                      if (console.error) {
                          console.error(err);
                      }
                  } else if (console[name]) {
                      arrayEach(args, function (x) {
                          console[name](x);
                      });
                  }
              }
          })]));
      });
  }

  var dir = consoleFunc('dir');

  function during(test, iterator, cb) {
      cb = cb || noop;

      var next = rest(function (err, args) {
          if (err) {
              cb(err);
          } else {
              args.push(check);
              test.apply(this, args);
          }
      });

      var check = function (err, truth) {
          if (err) return cb(err);
          if (!truth) return cb(null);
          iterator(next);
      };

      test(check);
  }

  function doDuring(iterator, test, cb) {
      var calls = 0;

      during(function (next) {
          if (calls++ < 1) return next(null, true);
          test.apply(this, arguments);
      }, iterator, cb);
  }

  function whilst(test, iterator, cb) {
      cb = cb || noop;
      if (!test()) return cb(null);
      var next = rest(function (err, args) {
          if (err) return cb(err);
          if (test.apply(this, args)) return iterator(next);
          cb.apply(null, [null].concat(args));
      });
      iterator(next);
  }

  function doWhilst(iterator, test, cb) {
      var calls = 0;
      return whilst(function () {
          return ++calls <= 1 || test.apply(this, arguments);
      }, iterator, cb);
  }

  function doUntil(iterator, test, cb) {
      return doWhilst(iterator, function () {
          return !test.apply(this, arguments);
      }, cb);
  }

  function _withoutIndex(iterator) {
      return function (value, index, callback) {
          return iterator(value, callback);
      };
  }

  function each(arr, iterator, cb) {
      return eachOf(arr, _withoutIndex(iterator), cb);
  }

  function eachLimit(arr, limit, iterator, cb) {
      return _eachOfLimit(limit)(arr, _withoutIndex(iterator), cb);
  }

  function eachSeries(arr, iterator, cb) {
      return eachOfSeries(arr, _withoutIndex(iterator), cb);
  }

  function ensureAsync(fn) {
      return rest(function (args) {
          var callback = args.pop();
          var sync = true;
          args.push(function () {
              var innerArgs = arguments;
              if (sync) {
                  setImmediate$1(function () {
                      callback.apply(null, innerArgs);
                  });
              } else {
                  callback.apply(null, innerArgs);
              }
          });
          fn.apply(this, args);
          sync = false;
      });
  }

  function notId(v) {
      return !v;
  }

  var every = _createTester(eachOf, notId, notId);

  var everyLimit = _createTester(eachOfLimit, notId, notId);

  function _filter(eachfn, arr, iterator, callback) {
      var results = [];
      eachfn(arr, function (x, index, callback) {
          iterator(x, function (err, v) {
              if (err) {
                  callback(err);
              } else {
                  if (v) {
                      results.push({ index: index, value: x });
                  }
                  callback();
              }
          });
      }, function (err) {
          if (err) {
              callback(err);
          } else {
              callback(null, arrayMap(results.sort(function (a, b) {
                  return a.index - b.index;
              }), baseProperty('value')));
          }
      });
  }

  var filter = doParallel(_filter);

  function doParallelLimit(fn) {
      return function (obj, limit, iterator, callback) {
          return fn(_eachOfLimit(limit), obj, iterator, callback);
      };
  }

  var filterLimit = doParallelLimit(_filter);

  var filterSeries = doSeries(_filter);

  function forever(fn, cb) {
      var done = onlyOnce(cb || noop);
      var task = ensureAsync(fn);

      function next(err) {
          if (err) return done(err);
          task(next);
      }
      next();
  }

  function iterator (tasks) {
      function makeCallback(index) {
          function fn() {
              if (tasks.length) {
                  tasks[index].apply(null, arguments);
              }
              return fn.next();
          }
          fn.next = function () {
              return index < tasks.length - 1 ? makeCallback(index + 1) : null;
          };
          return fn;
      }
      return makeCallback(0);
  }

  var log = consoleFunc('log');

  function _asyncMap(eachfn, arr, iterator, callback) {
      callback = once(callback || noop);
      arr = arr || [];
      var results = isArrayLike(arr) ? [] : {};
      eachfn(arr, function (value, index, callback) {
          iterator(value, function (err, v) {
              results[index] = v;
              callback(err);
          });
      }, function (err) {
          callback(err, results);
      });
  }

  var map = doParallel(_asyncMap);

  var mapLimit = doParallelLimit(_asyncMap);

  var mapSeries = doSeries(_asyncMap);

  /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Detect free variable `exports`. */
  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;

  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString$3 = objectProto$5.toString;

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString$3.call(value) == symbolTag);
  }

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined;
  var symbolToString = Symbol ? symbolProto.toString : undefined;
  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (value == null) {
      return '';
    }
    if (isSymbol(value)) {
      return Symbol ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  function stringToPath(string) {
    var result = [];
    toString(string).replace(rePropName, function(match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  }

  /**
   * The base implementation of `_.toPath` which only converts `value` to a
   * path if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Array} Returns the property path array.
   */
  function baseToPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }

  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (typeof value == 'number') {
      return true;
    }
    return !isArray(value) &&
      (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object)));
  }

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array ? array.length : 0;
    return length ? array[length - 1] : undefined;
  }

  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = isKey(path, object) ? [path + ''] : baseToPath(path);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[path[index++]];
    }
    return (index && index == length) ? object : undefined;
  }

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined` the `defaultValue` is used in its place.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  /**
   * Gets the parent value at `path` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} path The path to get the parent value of.
   * @returns {*} Returns the parent value.
   */
  function parent(object, path) {
    return path.length == 1 ? object : get(object, baseSlice(path, 0, -1));
  }

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    if (object == null) {
      return false;
    }
    var result = hasFunc(object, path);
    if (!result && !isKey(path)) {
      path = baseToPath(path);
      object = parent(object, path);
      if (object != null) {
        path = last(path);
        result = hasFunc(object, path);
      }
    }
    var length = object ? object.length : undefined;
    return result || (
      !!length && isLength(length) && isIndex(path, length) &&
      (isArray(object) || isString(object) || isArguments(object))
    );
  }

  /**
   * Checks if `path` is a direct property of `object`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = { 'a': { 'b': { 'c': 3 } } };
   * var other = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
   *
   * _.has(object, 'a');
   * // => true
   *
   * _.has(object, 'a.b.c');
   * // => true
   *
   * _.has(object, ['a', 'b', 'c']);
   * // => true
   *
   * _.has(other, 'a');
   * // => false
   */
  function has(object, path) {
    return hasPath(object, path, baseHas);
  }

  function memoize(fn, hasher) {
      var memo = Object.create(null);
      var queues = Object.create(null);
      hasher = hasher || identity;
      var memoized = rest(function memoized(args) {
          var callback = args.pop();
          var key = hasher.apply(null, args);
          if (has(memo, key)) {
              setImmediate$1(function () {
                  callback.apply(null, memo[key]);
              });
          } else if (has(queues, key)) {
              queues[key].push(callback);
          } else {
              queues[key] = [callback];
              fn.apply(null, args.concat([rest(function (args) {
                  memo[key] = args;
                  var q = queues[key];
                  delete queues[key];
                  for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, args);
                  }
              })]));
          }
      });
      memoized.memo = memo;
      memoized.unmemoized = fn;
      return memoized;
  }

  var nexTick = typeof process === 'object' && typeof process.nextTick === 'function' ? process.nextTick : setImmediate$1;

  function _parallel(eachfn, tasks, callback) {
      callback = callback || noop;
      var results = isArrayLike(tasks) ? [] : {};

      eachfn(tasks, function (task, key, callback) {
          task(rest(function (err, args) {
              if (args.length <= 1) {
                  args = args[0];
              }
              results[key] = args;
              callback(err);
          }));
      }, function (err) {
          callback(err, results);
      });
  }

  function parallel(tasks, cb) {
      return _parallel(eachOf, tasks, cb);
  }

  function parallelLimit(tasks, limit, cb) {
      return _parallel(_eachOfLimit(limit), tasks, cb);
  }

  function queue (worker, concurrency) {
      return queue$1(function (items, cb) {
          worker(items[0], cb);
      }, concurrency, 1);
  }

  function priorityQueue (worker, concurrency) {
      function _compareTasks(a, b) {
          return a.priority - b.priority;
      }

      function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
              var mid = beg + (end - beg + 1 >>> 1);
              if (compare(item, sequence[mid]) >= 0) {
                  beg = mid;
              } else {
                  end = mid - 1;
              }
          }
          return beg;
      }

      function _insert(q, data, priority, callback) {
          if (callback != null && typeof callback !== 'function') {
              throw new Error('task callback must be a function');
          }
          q.started = true;
          if (!isArray(data)) {
              data = [data];
          }
          if (data.length === 0) {
              // call drain immediately if there are no tasks
              return setImmediate$1(function () {
                  q.drain();
              });
          }
          arrayEach(data, function (task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : noop
              };

              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              setImmediate$1(q.process);
          });
      }

      // Start with a normal queue
      var q = queue(worker, concurrency);

      // Override push to accept second parameter representing priority
      q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
      };

      // Remove unshift function
      delete q.unshift;

      return q;
  }

  var slice = Array.prototype.slice;

  function reduceRight(arr, memo, iterator, cb) {
      var reversed = slice.call(arr).reverse();
      reduce(reversed, memo, iterator, cb);
  }

  function reject$1(eachfn, arr, iterator, callback) {
      _filter(eachfn, arr, function (value, cb) {
          iterator(value, function (err, v) {
              if (err) {
                  cb(err);
              } else {
                  cb(null, !v);
              }
          });
      }, callback);
  }

  var reject = doParallel(reject$1);

  var rejectLimit = doParallelLimit(reject$1);

  var rejectSeries = doSeries(reject$1);

  function series(tasks, cb) {
      return _parallel(eachOfSeries, tasks, cb);
  }

  function retry(times, task, callback) {
      var DEFAULT_TIMES = 5;
      var DEFAULT_INTERVAL = 0;

      var attempts = [];

      var opts = {
          times: DEFAULT_TIMES,
          interval: DEFAULT_INTERVAL
      };

      function parseTimes(acc, t) {
          if (typeof t === 'number') {
              acc.times = parseInt(t, 10) || DEFAULT_TIMES;
          } else if (typeof t === 'object') {
              acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
              acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
          } else {
              throw new Error('Unsupported argument type for \'times\': ' + typeof t);
          }
      }

      var length = arguments.length;
      if (length < 1 || length > 3) {
          throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
      } else if (length <= 2 && typeof times === 'function') {
          callback = task;
          task = times;
      }
      if (typeof times !== 'function') {
          parseTimes(opts, times);
      }
      opts.callback = callback;
      opts.task = task;

      function wrappedTask(wrappedCallback, wrappedResults) {
          function retryAttempt(task, finalAttempt) {
              return function (seriesCallback) {
                  task(function (err, result) {
                      seriesCallback(!err || finalAttempt, {
                          err: err,
                          result: result
                      });
                  }, wrappedResults);
              };
          }

          function retryInterval(interval) {
              return function (seriesCallback) {
                  setTimeout(function () {
                      seriesCallback(null);
                  }, interval);
              };
          }

          while (opts.times) {

              var finalAttempt = !(opts.times -= 1);
              attempts.push(retryAttempt(opts.task, finalAttempt));
              if (!finalAttempt && opts.interval > 0) {
                  attempts.push(retryInterval(opts.interval));
              }
          }

          series(attempts, function (done, data) {
              data = data[data.length - 1];
              (wrappedCallback || opts.callback)(data.err, data.result);
          });
      }

      // If a callback is passed, run this as a controll flow
      return opts.callback ? wrappedTask() : wrappedTask;
  }

  var some = _createTester(eachOf, Boolean, identity);

  var someLimit = _createTester(eachOfLimit, Boolean, identity);

  function sortBy(arr, iterator, cb) {
      map(arr, function (x, cb) {
          iterator(x, function (err, criteria) {
              if (err) return cb(err);
              cb(null, { value: x, criteria: criteria });
          });
      }, function (err, results) {
          if (err) return cb(err);
          cb(null, arrayMap(results.sort(comparator), baseProperty('value')));
      });

      function comparator(left, right) {
          var a = left.criteria,
              b = right.criteria;
          return a < b ? -1 : a > b ? 1 : 0;
      }
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeCeil = Math.ceil;
  var nativeMax$2 = Math.max;
  /**
   * The base implementation of `_.range` and `_.rangeRight` which doesn't
   * coerce arguments to numbers.
   *
   * @private
   * @param {number} start The start of the range.
   * @param {number} end The end of the range.
   * @param {number} step The value to increment or decrement by.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Array} Returns the new array of numbers.
   */
  function baseRange(start, end, step, fromRight) {
    var index = -1,
        length = nativeMax$2(nativeCeil((end - start) / (step || 1)), 0),
        result = Array(length);

    while (length--) {
      result[fromRight ? length : ++index] = start;
      start += step;
    }
    return result;
  }

  function times (count, iterator, callback) {
      map(baseRange(0, count, 1), iterator, callback);
  }

  function timeLimit(count, limit, iterator, cb) {
      return mapLimit(baseRange(0, count, 1), limit, iterator, cb);
  }

  function timesSeries (count, iterator, callback) {
      mapSeries(baseRange(0, count, 1), iterator, callback);
  }

  function transform(arr, memo, iterator, callback) {
      if (arguments.length === 3) {
          callback = iterator;
          iterator = memo;
          memo = isArray(arr) ? [] : {};
      }

      eachOf(arr, function (v, k, cb) {
          iterator(memo, v, k, cb);
      }, function (err) {
          callback(err, memo);
      });
  }

  function unmemoize(fn) {
      return function () {
          return (fn.unmemoized || fn).apply(null, arguments);
      };
  }

  function until(test, iterator, cb) {
      return whilst(function () {
          return !test.apply(this, arguments);
      }, iterator, cb);
  }

  function waterfall (tasks, cb) {
      cb = once(cb || noop);
      if (!isArray(tasks)) return cb(new Error('First argument to waterfall must be an array of functions'));
      if (!tasks.length) return cb();

      function wrapIterator(iterator) {
          return rest(function (err, args) {
              if (err) {
                  cb.apply(null, [err].concat(args));
              } else {
                  var next = iterator.next();
                  if (next) {
                      args.push(wrapIterator(next));
                  } else {
                      args.push(cb);
                  }
                  ensureAsync(iterator).apply(null, args);
              }
          });
      }
      wrapIterator(iterator(tasks))();
  }

  var index = {
      applyEach: applyEach,
      applyEachSeries: applyEachSeries,
      apply: apply,
      asyncify: asyncify,
      auto: auto,
      cargo: cargo,
      compose: compose,
      concat: concat,
      concatSeries: concatSeries,
      constant: constant,
      detect: detect,
      detectLimit: detectLimit,
      detectSeries: detectSeries,
      dir: dir,
      doDuring: doDuring,
      doUntil: doUntil,
      doWhilst: doWhilst,
      during: during,
      each: each,
      eachLimit: eachLimit,
      eachOf: eachOf,
      eachOfLimit: eachOfLimit,
      eachOfSeries: eachOfSeries,
      eachSeries: eachSeries,
      ensureAsync: ensureAsync,
      every: every,
      everyLimit: everyLimit,
      filter: filter,
      filterLimit: filterLimit,
      filterSeries: filterSeries,
      forever: forever,
      iterator: iterator,
      log: log,
      map: map,
      mapLimit: mapLimit,
      mapSeries: mapSeries,
      memoize: memoize,
      nextTick: nexTick,
      parallel: parallel,
      parallelLimit: parallelLimit,
      priorityQueue: priorityQueue,
      queue: queue,
      reduce: reduce,
      reduceRight: reduceRight,
      reject: reject,
      rejectLimit: rejectLimit,
      rejectSeries: rejectSeries,
      retry: retry,
      seq: seq,
      series: series,
      setImmediate: setImmediate$1,
      some: some,
      someLimit: someLimit,
      sortBy: sortBy,
      times: times,
      timesLimit: timeLimit,
      timesSeries: timesSeries,
      transform: transform,
      unmemoize: unmemoize,
      until: until,
      waterfall: waterfall,
      whilst: whilst,

      // aliases
      all: every,
      any: some,
      forEach: each,
      forEachSeries: eachSeries,
      forEachLimit: eachLimit,
      forEachOf: eachOf,
      forEachOfSeries: eachOfSeries,
      forEachOfLimit: eachOfLimit,
      inject: reduce,
      foldl: reduce,
      foldr: reduceRight,
      select: filter,
      selectLimit: filterLimit,
      selectSeries: filterSeries,
      wrapSync: asyncify
  };

  exports['default'] = index;
  exports.applyEach = applyEach;
  exports.applyEachSeries = applyEachSeries;
  exports.apply = apply;
  exports.asyncify = asyncify;
  exports.auto = auto;
  exports.cargo = cargo;
  exports.compose = compose;
  exports.concat = concat;
  exports.concatSeries = concatSeries;
  exports.constant = constant;
  exports.detect = detect;
  exports.detectLimit = detectLimit;
  exports.detectSeries = detectSeries;
  exports.dir = dir;
  exports.doDuring = doDuring;
  exports.doUntil = doUntil;
  exports.doWhilst = doWhilst;
  exports.during = during;
  exports.each = each;
  exports.eachLimit = eachLimit;
  exports.eachOf = eachOf;
  exports.eachOfLimit = eachOfLimit;
  exports.eachOfSeries = eachOfSeries;
  exports.eachSeries = eachSeries;
  exports.ensureAsync = ensureAsync;
  exports.every = every;
  exports.everyLimit = everyLimit;
  exports.filter = filter;
  exports.filterLimit = filterLimit;
  exports.filterSeries = filterSeries;
  exports.forever = forever;
  exports.iterator = iterator;
  exports.log = log;
  exports.map = map;
  exports.mapLimit = mapLimit;
  exports.mapSeries = mapSeries;
  exports.memoize = memoize;
  exports.nextTick = nexTick;
  exports.parallel = parallel;
  exports.parallelLimit = parallelLimit;
  exports.priorityQueue = priorityQueue;
  exports.queue = queue;
  exports.reduce = reduce;
  exports.reduceRight = reduceRight;
  exports.reject = reject;
  exports.rejectLimit = rejectLimit;
  exports.rejectSeries = rejectSeries;
  exports.retry = retry;
  exports.seq = seq;
  exports.series = series;
  exports.setImmediate = setImmediate$1;
  exports.some = some;
  exports.someLimit = someLimit;
  exports.sortBy = sortBy;
  exports.times = times;
  exports.timesLimit = timeLimit;
  exports.timesSeries = timesSeries;
  exports.transform = transform;
  exports.unmemoize = unmemoize;
  exports.until = until;
  exports.waterfall = waterfall;
  exports.whilst = whilst;
  exports.all = every;
  exports.any = some;
  exports.forEach = each;
  exports.forEachSeries = eachSeries;
  exports.forEachLimit = eachLimit;
  exports.forEachOf = eachOf;
  exports.forEachOfSeries = eachOfSeries;
  exports.forEachOfLimit = eachOfLimit;
  exports.inject = reduce;
  exports.foldl = reduce;
  exports.foldr = reduceRight;
  exports.select = filter;
  exports.selectLimit = filterLimit;
  exports.selectSeries = filterSeries;
  exports.wrapSync = asyncify;

}));
(function(){var d=null;function e(a){return function(b){this[a]=b}}function h(a){return function(){return this[a]}}var j;
function k(a,b,c){this.extend(k,google.maps.OverlayView);this.c=a;this.a=[];this.f=[];this.ca=[53,56,66,78,90];this.j=[];this.A=!1;c=c||{};this.g=c.gridSize||60;this.l=c.minimumClusterSize||2;this.J=c.maxZoom||d;this.j=c.styles||[];this.X=c.imagePath||this.Q;this.W=c.imageExtension||this.P;this.O=!0;if(c.zoomOnClick!=void 0)this.O=c.zoomOnClick;this.r=!1;if(c.averageCenter!=void 0)this.r=c.averageCenter;l(this);this.setMap(a);this.K=this.c.getZoom();var f=this;google.maps.event.addListener(this.c,
"zoom_changed",function(){var a=f.c.getZoom();if(f.K!=a)f.K=a,f.m()});google.maps.event.addListener(this.c,"idle",function(){f.i()});b&&b.length&&this.C(b,!1)}j=k.prototype;j.Q="https://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";j.P="png";j.extend=function(a,b){return function(a){for(var b in a.prototype)this.prototype[b]=a.prototype[b];return this}.apply(a,[b])};j.onAdd=function(){if(!this.A)this.A=!0,n(this)};j.draw=function(){};
function l(a){if(!a.j.length)for(var b=0,c;c=a.ca[b];b++)a.j.push({url:a.X+(b+1)+"."+a.W,height:c,width:c})}j.S=function(){for(var a=this.o(),b=new google.maps.LatLngBounds,c=0,f;f=a[c];c++)b.extend(f.getPosition());this.c.fitBounds(b)};j.z=h("j");j.o=h("a");j.V=function(){return this.a.length};j.ba=e("J");j.I=h("J");j.G=function(a,b){for(var c=0,f=a.length,g=f;g!==0;)g=parseInt(g/10,10),c++;c=Math.min(c,b);return{text:f,index:c}};j.$=e("G");j.H=h("G");
j.C=function(a,b){for(var c=0,f;f=a[c];c++)q(this,f);b||this.i()};function q(a,b){b.s=!1;b.draggable&&google.maps.event.addListener(b,"dragend",function(){b.s=!1;a.L()});a.a.push(b)}j.q=function(a,b){q(this,a);b||this.i()};function r(a,b){var c=-1;if(a.a.indexOf)c=a.a.indexOf(b);else for(var f=0,g;g=a.a[f];f++)if(g==b){c=f;break}if(c==-1)return!1;b.setMap(d);a.a.splice(c,1);return!0}j.Y=function(a,b){var c=r(this,a);return!b&&c?(this.m(),this.i(),!0):!1};
j.Z=function(a,b){for(var c=!1,f=0,g;g=a[f];f++)g=r(this,g),c=c||g;if(!b&&c)return this.m(),this.i(),!0};j.U=function(){return this.f.length};j.getMap=h("c");j.setMap=e("c");j.w=h("g");j.aa=e("g");
j.v=function(a){var b=this.getProjection(),c=new google.maps.LatLng(a.getNorthEast().lat(),a.getNorthEast().lng()),f=new google.maps.LatLng(a.getSouthWest().lat(),a.getSouthWest().lng()),c=b.fromLatLngToDivPixel(c);c.x+=this.g;c.y-=this.g;f=b.fromLatLngToDivPixel(f);f.x-=this.g;f.y+=this.g;c=b.fromDivPixelToLatLng(c);b=b.fromDivPixelToLatLng(f);a.extend(c);a.extend(b);return a};j.R=function(){this.m(!0);this.a=[]};
j.m=function(a){for(var b=0,c;c=this.f[b];b++)c.remove();for(b=0;c=this.a[b];b++)c.s=!1,a&&c.setMap(d);this.f=[]};j.L=function(){var a=this.f.slice();this.f.length=0;this.m();this.i();window.setTimeout(function(){for(var b=0,c;c=a[b];b++)c.remove()},0)};j.i=function(){n(this)};
function n(a){if(a.A)for(var b=a.v(new google.maps.LatLngBounds(a.c.getBounds().getSouthWest(),a.c.getBounds().getNorthEast())),c=0,f;f=a.a[c];c++)if(!f.s&&b.contains(f.getPosition())){for(var g=a,u=4E4,o=d,v=0,m=void 0;m=g.f[v];v++){var i=m.getCenter();if(i){var p=f.getPosition();if(!i||!p)i=0;else var w=(p.lat()-i.lat())*Math.PI/180,x=(p.lng()-i.lng())*Math.PI/180,i=Math.sin(w/2)*Math.sin(w/2)+Math.cos(i.lat()*Math.PI/180)*Math.cos(p.lat()*Math.PI/180)*Math.sin(x/2)*Math.sin(x/2),i=6371*2*Math.atan2(Math.sqrt(i),
Math.sqrt(1-i));i<u&&(u=i,o=m)}}o&&o.F.contains(f.getPosition())?o.q(f):(m=new s(g),m.q(f),g.f.push(m))}}function s(a){this.k=a;this.c=a.getMap();this.g=a.w();this.l=a.l;this.r=a.r;this.d=d;this.a=[];this.F=d;this.n=new t(this,a.z(),a.w())}j=s.prototype;
j.q=function(a){var b;a:if(this.a.indexOf)b=this.a.indexOf(a)!=-1;else{b=0;for(var c;c=this.a[b];b++)if(c==a){b=!0;break a}b=!1}if(b)return!1;if(this.d){if(this.r)c=this.a.length+1,b=(this.d.lat()*(c-1)+a.getPosition().lat())/c,c=(this.d.lng()*(c-1)+a.getPosition().lng())/c,this.d=new google.maps.LatLng(b,c),y(this)}else this.d=a.getPosition(),y(this);a.s=!0;this.a.push(a);b=this.a.length;b<this.l&&a.getMap()!=this.c&&a.setMap(this.c);if(b==this.l)for(c=0;c<b;c++)this.a[c].setMap(d);b>=this.l&&a.setMap(d);
a=this.c.getZoom();if((b=this.k.I())&&a>b)for(a=0;b=this.a[a];a++)b.setMap(this.c);else if(this.a.length<this.l)z(this.n);else{b=this.k.H()(this.a,this.k.z().length);this.n.setCenter(this.d);a=this.n;a.B=b;a.ga=b.text;a.ea=b.index;if(a.b)a.b.innerHTML=b.text;b=Math.max(0,a.B.index-1);b=Math.min(a.j.length-1,b);b=a.j[b];a.da=b.url;a.h=b.height;a.p=b.width;a.M=b.textColor;a.e=b.anchor;a.N=b.textSize;a.D=b.backgroundPosition;this.n.show()}return!0};
j.getBounds=function(){for(var a=new google.maps.LatLngBounds(this.d,this.d),b=this.o(),c=0,f;f=b[c];c++)a.extend(f.getPosition());return a};j.remove=function(){this.n.remove();this.a.length=0;delete this.a};j.T=function(){return this.a.length};j.o=h("a");j.getCenter=h("d");function y(a){a.F=a.k.v(new google.maps.LatLngBounds(a.d,a.d))}j.getMap=h("c");
function t(a,b,c){a.k.extend(t,google.maps.OverlayView);this.j=b;this.fa=c||0;this.u=a;this.d=d;this.c=a.getMap();this.B=this.b=d;this.t=!1;this.setMap(this.c)}j=t.prototype;
j.onAdd=function(){this.b=document.createElement("DIV");if(this.t)this.b.style.cssText=A(this,B(this,this.d)),this.b.innerHTML=this.B.text;this.getPanes().overlayMouseTarget.appendChild(this.b);var a=this;google.maps.event.addDomListener(this.b,"click",function(){var b=a.u.k;google.maps.event.trigger(b,"clusterclick",a.u);b.O&&a.c.fitBounds(a.u.getBounds())})};function B(a,b){var c=a.getProjection().fromLatLngToDivPixel(b);c.x-=parseInt(a.p/2,10);c.y-=parseInt(a.h/2,10);return c}
j.draw=function(){if(this.t){var a=B(this,this.d);this.b.style.top=a.y+"px";this.b.style.left=a.x+"px"}};function z(a){if(a.b)a.b.style.display="none";a.t=!1}j.show=function(){if(this.b)this.b.style.cssText=A(this,B(this,this.d)),this.b.style.display="";this.t=!0};j.remove=function(){this.setMap(d)};j.onRemove=function(){if(this.b&&this.b.parentNode)z(this),this.b.parentNode.removeChild(this.b),this.b=d};j.setCenter=e("d");
function A(a,b){var c=[];c.push("background-image:url("+a.da+");");c.push("background-position:"+(a.D?a.D:"0 0")+";");typeof a.e==="object"?(typeof a.e[0]==="number"&&a.e[0]>0&&a.e[0]<a.h?c.push("height:"+(a.h-a.e[0])+"px; padding-top:"+a.e[0]+"px;"):c.push("height:"+a.h+"px; line-height:"+a.h+"px;"),typeof a.e[1]==="number"&&a.e[1]>0&&a.e[1]<a.p?c.push("width:"+(a.p-a.e[1])+"px; padding-left:"+a.e[1]+"px;"):c.push("width:"+a.p+"px; text-align:center;")):c.push("height:"+a.h+"px; line-height:"+a.h+
"px; width:"+a.p+"px; text-align:center;");c.push("cursor:pointer; top:"+b.y+"px; left:"+b.x+"px; color:"+(a.M?a.M:"black")+"; position:absolute; font-size:"+(a.N?a.N:11)+"px; font-family:Arial,sans-serif; font-weight:bold");return c.join("")}window.MarkerClusterer=k;k.prototype.addMarker=k.prototype.q;k.prototype.addMarkers=k.prototype.C;k.prototype.clearMarkers=k.prototype.R;k.prototype.fitMapToMarkers=k.prototype.S;k.prototype.getCalculator=k.prototype.H;k.prototype.getGridSize=k.prototype.w;
k.prototype.getExtendedBounds=k.prototype.v;k.prototype.getMap=k.prototype.getMap;k.prototype.getMarkers=k.prototype.o;k.prototype.getMaxZoom=k.prototype.I;k.prototype.getStyles=k.prototype.z;k.prototype.getTotalClusters=k.prototype.U;k.prototype.getTotalMarkers=k.prototype.V;k.prototype.redraw=k.prototype.i;k.prototype.removeMarker=k.prototype.Y;k.prototype.removeMarkers=k.prototype.Z;k.prototype.resetViewport=k.prototype.m;k.prototype.repaint=k.prototype.L;k.prototype.setCalculator=k.prototype.$;
k.prototype.setGridSize=k.prototype.aa;k.prototype.setMaxZoom=k.prototype.ba;k.prototype.onAdd=k.prototype.onAdd;k.prototype.draw=k.prototype.draw;s.prototype.getCenter=s.prototype.getCenter;s.prototype.getSize=s.prototype.T;s.prototype.getMarkers=s.prototype.o;t.prototype.onAdd=t.prototype.onAdd;t.prototype.draw=t.prototype.draw;t.prototype.onRemove=t.prototype.onRemove;
})();
var GeoJSON = function( geojson, options ){

	var _geometryToGoogleMaps = function( geojsonGeometry, options, geojsonProperties ){
		
		var googleObj, opts = _copy(options);
		
		switch ( geojsonGeometry.type ){
			case "Point":
				opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
				googleObj = new google.maps.Marker(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPoint":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
					googleObj.push(new google.maps.Marker(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "LineString":
				var path = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var coord = geojsonGeometry.coordinates[i];
					var ll = new google.maps.LatLng(coord[1], coord[0]);
					path.push(ll);
				}
				opts.path = path;
				googleObj = new google.maps.Polyline(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiLineString":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var coord = geojsonGeometry.coordinates[i][j];
						var ll = new google.maps.LatLng(coord[1], coord[0]);
						path.push(ll);
					}
					opts.path = path;
					googleObj.push(new google.maps.Polyline(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "Polygon":
				var paths = [];
				var exteriorDirection;
				var interiorDirection;
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
						path.push(ll);
					}
					if(!i){
						exteriorDirection = _ccw(path);
						paths.push(path);
					}else if(i == 1){
						interiorDirection = _ccw(path);
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}else{
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}
				}
				opts.paths = paths;
				googleObj = new google.maps.Polygon(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPolygon":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var paths = [];
					var exteriorDirection;
					var interiorDirection;
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var path = [];
						for (var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++){
							var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
							path.push(ll);
						}
						if(!j){
							exteriorDirection = _ccw(path);
							paths.push(path);
						}else if(j == 1){
							interiorDirection = _ccw(path);
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}else{
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}
					}
					opts.paths = paths;
					googleObj.push(new google.maps.Polygon(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "GeometryCollection":
				googleObj = [];
				if (!geojsonGeometry.geometries){
					googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
				}else{
					for (var i = 0; i < geojsonGeometry.geometries.length; i++){
						googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
					}
				}
				break;
				
			default:
				googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
		}
		
		return googleObj;
		
	};
	
	var _error = function( message ){
	
		return {
			type: "Error",
			message: message
		};
	
	};

	var _ccw = function( path ){
		var isCCW;
		var a = 0;
		for (var i = 0; i < path.length-2; i++){
			a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
		}
		if(a > 0){
			isCCW = true;
		}
		else{
			isCCW = false;
		}
		return isCCW;
	};
  
  var _copy = function(obj){
    var newObj = {};
    for(var i in obj){
      if(obj.hasOwnProperty(i)){
        newObj[i] = obj[i];
      }
    }
    return newObj;
  };
		
	var obj;
	
	var opts = options || {};
	
	switch ( geojson.type ){
	
		case "FeatureCollection":
			if (!geojson.features){
				obj = _error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
			}else{
				obj = [];
				for (var i = 0; i < geojson.features.length; i++){
					obj.push(_geometryToGoogleMaps(geojson.features[i].geometry, opts, geojson.features[i].properties));
				}
			}
			break;
		
		case "GeometryCollection":
			if (!geojson.geometries){
				obj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
			}else{
				obj = [];
				for (var i = 0; i < geojson.geometries.length; i++){
					obj.push(_geometryToGoogleMaps(geojson.geometries[i], opts));
				}
			}
			break;
		
		case "Feature":
			if (!( geojson.properties && geojson.geometry )){
				obj = _error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
			}else{
				obj = _geometryToGoogleMaps(geojson.geometry, opts, geojson.properties);
			}
			break;
		
		case "Point": case "MultiPoint": case "LineString": case "MultiLineString": case "Polygon": case "MultiPolygon":
			obj = geojson.coordinates
				? obj = _geometryToGoogleMaps(geojson, opts)
				: _error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
			break;
		
		default:
			obj = _error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");
	
	}
	
	return obj;
	
};

/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file implements the pluginLoader object, which provides hooks to add additional 
 * functionality to the map application.
 * @author davidschuld@gmail.com (David Schuld)
 */
var s11 = s11 || {};
s11.plugin = s11.plugin || {};

s11.plugin.STATES = {
    REGISTERED: "REGISTERED",
    LOADING: "LOADING",
    FAILED: "FAILED",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
};

var STATES = s11.plugin.STATES;

/**
 * This object is the central registry for all aditional functionality of the map. Plugins can register at any time 
 * via the addPlugin() function. When the map is loaded, the init() function is called and the map data is dispatched 
 * to all registered plugins.
 * 
 */
s11.pluginLoader = function () {

    var pluginCallbacks = {};
    var pluginStates = {};

    var data;
    var doLoad = function () {
        var id;
        for (id in pluginCallbacks) {
            setState(id, STATES.LOADING);
            pluginCallbacks[id](data);
        }
    };

    var setState = function (id, state) {
        pluginStates[id] = state;
        if (data) {
            data.log(id + ": " + state);
        }
    };

    return {
        addPlugin: function (id, callback) {
            pluginCallbacks[id] = callback;
            setState(id, STATES.REGISTERED);
            if (data) {
                setState(id, STATES.LOADING);
                callback(data);
            }
        },
        logPluginList: function () {
            data.log(this.listPlugins());
        },
        listPlugins: function () {
            var message = "Plugins: ";
            var id;
            for (id in pluginCallbacks) {
                message += id + ":" + pluginStates[id] + ", ";
            }

            return message;
        },
        init: function (dataObject) {
            data = dataObject;
            data.log("Initialized plugin loader");
            this.logPluginList();
            doLoad();
        },
        onLoad: function (id, result) {
            if (result) {
                setState(id, STATES.ACTIVE);
            } else {
                setState(id, STATES.FAILED);
            }
        }
    };

}();



/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file connects to the Wordpress REST API.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
s11.wpapi = s11.wpapi  || {};
/**
 * 
 * @constructor 
 */
s11.wpapi.WordpressConnector = function (baseUrl, restApiPath) {

    /**
     * @type {String}
     */
    var restUrl = baseUrl + restApiPath;
    
    var baseUrl = baseUrl;
    


    return {
        getRestUrl: function () {
            return restUrl;
        },
        getBaseUrl: function() {
            return baseUrl;
        },
        getPost: function (slug, callback) {
            $.ajax({
                url: restUrl + '?slug=' + slug,
                type: 'get',
                beforeSend: function () {
                    //
                },
                success: function (result) {
                   callback(result[0].excerpt.rendered);
                }
            });
        }



    };



};



/* 
 * Copyright 2015 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file contains FuTaJS, an object-oriented API for Google Fusion Tables.
 * @author davidschuld@gmail.com (David Schuld)
 */
var s11 = s11 || {};

s11.data = s11.data || {};
s11.data.FusionTable = function (id, fusionTableOpts) {

    var tableId = id;

    if (fusionTableOpts) {
        var bearerId = fusionTableOpts.bearerId;
        var key = fusionTableOpts.key;

    }

    this.select = function (selectStatement) {
        var statement = "SELECT " + selectStatement + " FROM " + tableId;

        var statementExecutor = {
            where: function (whereClause) {
                statement += " WHERE " + whereClause;
                return this;
            },
            groupBy: function (groupByClause) {
                statement += " GROUP BY " + groupByClause;
                return this;
            },
            orderBy: function (orderByClause) {
                statement += " ORDER BY " + orderByClause;
                return this;
            },
            execute: function (callback) {

                var uri = makeURI(statement, key);
                $.get(uri, function (data, status) {
                    if (status === 'success') {
                        callback(data);
                    }
                });

            }

        };

        return statementExecutor;

    };

};

var makeURI = function (statement, key) {
    var address = "https://www.googleapis.com/fusiontables/v2/query?sql=" + statement;
    if (key) {
        address += "&key=" + key;
    }
    return address;
};

/* 
 * Copyright 2015 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file defines the FeatureFactory component, which encapsulates the functionalities that are
 * specific to a certain mapping API. Currently only Google Maps API is supported.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
s11.geomodel = s11.geomodel || {};


//+++++++++++++++++++++++++++++++
//Google Maps specifics
//+++++++++++++++++++++++++++++++


//A factory object that encapsulates the functionality specific to a certain mapping API, in this case Google Maps.
var factory = {
    addEventListener: function (component, eventName, action) {
        google.maps.event.addListener(component, eventName, action);
    },
    clearListeners: function (component, eventName) {
        google.maps.event.clearListeners(component, eventName);
    },
    addDomListener: function (component, eventName, action) {
        google.maps.event.addDomListener(component, eventName, action);
    },
    getInfoWindow: function (forceNew) {
        return createInfoWindow(forceNew);
    },
    //TODO merge to getInfoWindow when all references have been solved
    createInfoWindow: function (forceNew) {
        if (!this.infoWindow || forceNew) {
            this.infoWindow = new google.maps.InfoWindow();
            return this.infoWindow;
        }
        return this.infoWindow;
    },
    createMarker: function (markerOpts) {
        return new google.maps.Marker(markerOpts);
    },
    createPolyline: function (polylineOpts) {
        return new google.maps.Polyline(polylineOpts);
    },
    createPolygon: function (polygonOpts) {
        return new google.maps.Polygon(polygonOpts);
    },
    createLatLng: function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },
    createLatLngBounds: function () {
        return  new google.maps.LatLngBounds();
    },
    createMVCObject: function () {
        return new google.maps.MVCObject();
    },
    computeLength: function (path) {
        return google.maps.geometry.spherical.computeLength(path);
    },
    decodePath: function (encodedPath) {
        return google.maps.geometry.encoding.decodePath(encodedPath);
    },
    encodePath: function (path) {
        return google.maps.geometry.encoding.encodePath(path);
    },
    createMap: function (lat, lng, zoom, mapDivId, mapboxKey) {
        if (!zoom) {
            zoom = 3;
        }

        //TODO config on server
        var styles = [{"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {"featureType": "transit.station", "stylers": [{"visibility": "off"}]}, {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"visibility": "on"}, {"weight": 0.5}]}, {"featureType": "road", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "landscape", "elementType": "labels", "stylers": [{"visibility": "off"}]}];


        var mapProp = {
            center: new google.maps.LatLng(lat, lng),
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            rotateControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_LEFT,
                mapTypeIds: [
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.TERRAIN,
//                    s11.util.MapTypeId.OSM,
//                    s11.util.MapTypeId.HIKEBIKE,
//                    s11.util.MapTypeId.LANDSCAPE,
                    s11.util.MapTypeId.MAPBOX,
                    s11.util.MapTypeId.MAPBOX_SATELLITE,
                    s11.util.MapTypeId.MAPBOX_STREETS,
                    s11.util.MapTypeId.MAPBOX_OUTDOORS,
                    s11.util.MapTypeId.MAPBOX_CUST,
                    s11.util.MapTypeId.MAPBOX_CUST_OUT,
                    s11.util.MapTypeId.PIONEER,
                    s11.util.MapTypeId.OTM,
                    s11.util.MapTypeId.OUTDOORS




                ]

            },
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            styles: styles,
            disableDoubleClickZoom: true
        };

        var map = new google.maps.Map(document.getElementById(mapDivId), mapProp);





        //TODO include attribution div on map, see http://www.thunderforest.com/terms/
//        var osmOptions = createMapTypeOptions("OSM", function (coord, zoom) {
//            return "http://otile1.mqcdn.com/tiles/1.0.0/osm/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
//        });
//        registerMapType(map, osmOptions, s11.util.MapTypeId.OSM);
//
//
//        var hikeBikeOptions = createMapTypeOptions("Hike & Bike", function (coord, zoom) {
//            return "http://a.tiles.wmflabs.org/hikebike/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
//        });
//        registerMapType(map, hikeBikeOptions, s11.util.MapTypeId.HIKEBIKE);
//
//
//        var landscapeOptions = createMapTypeOptions("Landscape", function (coord, zoom) {
//            return "https://a.tile.thunderforest.com/landscape/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
//        });
//        registerMapType(map, landscapeOptions, s11.util.MapTypeId.LANDSCAPE);




        var pioneerMap = createMapTypeOptions("Pioneer", function (coord, zoom) {
            return "https://a.tile.thunderforest.com/pioneer/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        });
        registerMapType(map, pioneerMap, s11.util.MapTypeId.PIONEER);


        var mapboxMap = createMapTypeOptions("Mapbox", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=pk.eyJ1IjoiZHNjaHVsZCIsImEiOiJjaXA4Mm5xazkwMDJwdXRubXBxa25peTV4In0.uCnPaGteG5-H80uO13RiOw";
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX);


        var mapboxMap = createMapTypeOptions("Mapbox-Sat", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=pk.eyJ1IjoiZHNjaHVsZCIsImEiOiJjaXA4Mm5xazkwMDJwdXRubXBxa25peTV4In0.uCnPaGteG5-H80uO13RiOw";
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_SATELLITE);


        var mapboxMap = createMapTypeOptions("Mapbox-Streets", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_STREETS);

        var mapboxMap = createMapTypeOptions("Mapbox-Outdoors", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_OUTDOORS);

        var mapboxMap = createMapTypeOptions("Mapbox-Cust", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/dschuld/cip80f3cr0023cunsqdt0leuz/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_CUST);



        var mapboxMap = createMapTypeOptions("Mapbox-Cust-Out", function (coord, zoom) {
            return "https://api.mapbox.com/styles/v1/dschuld/cip57q2p9000hdiluvwbmnoqp/tiles/" + zoom + "/" + coord.x + "/" + coord.y + "?access_token=" + mapboxKey;
        });
        registerMapType(map, mapboxMap, s11.util.MapTypeId.MAPBOX_CUST_OUT);

        var openTopoMap = createMapTypeOptions("OpenTopoMap", function (coord, zoom) {
            return "https://a.tile.opentopomap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        });
        registerMapType(map, openTopoMap, s11.util.MapTypeId.OTM);


        var outdoorsMap = createMapTypeOptions("Outdoors", function (coord, zoom) {
            return "https://a.tile.thunderforest.com/outdoors/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        });
        registerMapType(map, outdoorsMap, s11.util.MapTypeId.OUTDOORS);

        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

        return map;
    }
};

var registerMapType = function (map, options, mapTypeId) {

    var mapTypeOsm = new google.maps.ImageMapType(options);
    map.mapTypes.set(mapTypeId, mapTypeOsm);
};

var createMapTypeOptions = function (mapTypeName, makeUrl) {

    return {
        getTileUrl: function (coord, zoom) {
            return makeUrl(coord, zoom);
        },
        tileSize: new google.maps.Size(256, 256),
        name: mapTypeName,
        maxZoom: 18
    };

};

s11.geomodel.getFactory = function () {
    return factory;
};



/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file implements common helper functions.
 * @author davidschuld@gmail.com (David Schuld)
 */


var s11 = s11 || {};
s11.util = s11.util || {};


var factory = s11.geomodel.getFactory();

s11.util.geocodeLatLng = function (latlng, callback) {

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                callback(results);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
};

s11.util.loadGeoJSON = function (json, style) {
    var features = new GeoJSON(json, style);
    return features;
};




s11.util.encodePathFromGeoJson = function (json, style) {
    var path = loadGeoJSON(json, style);
};

s11.util.encodePathFromGeoJsonString = function (jsonString, style) {
    var path = parseGeoJson(jsonString, style);
    return s11.util.encodePath(path[0].getPath());
};

s11.util.encodePath = function (path) {
    return google.maps.geometry.encoding.encodePath(path);
};

s11.util.parseGeoJson = function (jsonString) {
    var json = $.parseJSON(jsonString);
    return s11.util.loadGeoJSON(json, {
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#AAAAAA",
        fillOpacity: 0.5
    });
};

s11.util.fromLatLngToPoint = function (latLng, map) {
    var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
    var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
    return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
};

s11.util.MapTypeId = {};
s11.util.MapTypeId.OSM = "osm";
s11.util.MapTypeId.HIKEBIKE = "hikebike";
s11.util.MapTypeId.LANDSCAPE = "thunderforst-landscape";
s11.util.MapTypeId.OUTDOORS = "thunderforst-outdoors";
s11.util.MapTypeId.OTM = "opentopomap";
s11.util.MapTypeId.PIONEER = "thunderforst-pioneer";
s11.util.MapTypeId.MAPBOX = "mapbox-terrain";
s11.util.MapTypeId.MAPBOX_SATELLITE = "mapbox-satellite";
s11.util.MapTypeId.MAPBOX_STREETS = "mapbox-streets";
s11.util.MapTypeId.MAPBOX_CUST = "mapbox-cust";
s11.util.MapTypeId.MAPBOX_OUTDOORS = "mapbox-outdoors";
s11.util.MapTypeId.MAPBOX_CUST_OUT = "mapbox-cust-out";



/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var s11 = s11 || {};
s11.ui = s11.ui || {};


var factory = s11.geomodel.getFactory();

var configureInfowindow = function (infoWindow) {

    // Copied from http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
    /*
     * The google.maps.event.addListener() event waits for
     * the creation of the infowindow HTML structure 'domready'
     * and before the opening of the infowindow defined styles
     * are applied.
     */
    factory.addEventListener(infoWindow, 'domready', function () {

//TODO probably better to do it without infowindow
//http://stackoverflow.com/questions/19497727/how-do-i-create-a-tooltip-with-overflow-visible-in-google-maps-v3
        var container = $('#iw-container');

        var iwOuter = container.parent().parent().parent();
        var iwOuterChild = container.parent().parent();
        iwOuterChild.css({overflow: 'hidden'});

        iwOuter.attr("class", "gm-style-iw");

        // Reference to the DIV which receives the contents of the infowindow using jQuery
//        var iwOuter = $('.gm-style-iw');

        // Moves the infowindow 115px to the right.
//        iwOuter.parent().css({top: '-150px',left: '115px'});

        removeBackgroundAndTail(iwOuter);

        // Changes the desired color for the tail outline.
        // The outline of the tail is composed of two descendants of div which contains the tail.
        // The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
//        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1'});


        // Taking advantage of the already established reference to
        // div .gm-style-iw with iwOuter variable.
        // You must set a new variable iwCloseBtn.
        // Using the .next() method of JQuery you reference the following div to .gm-style-iw.
        // Is this div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();

        // Apply the desired effect to the close button
        iwCloseBtn.css({
            width: '27px',
            height: '27px',
            display: 'inline',
            opacity: '1', // by default the close button has an opacity of 0.7
            right: '38px', top: '3px', // button repositioning
            border: '7px solid #48b5e9', // increasing button border and new color
            'border-radius': '13px', // circular effect
            'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
        });

        // The API automatically applies 0.7 opacity to the button after the mouseout event.
        // This function reverses this event to the desired value.
        iwCloseBtn.mouseout(function () {
            $(this).css({opacity: '1'});
        });

    });
};


var removeBackgroundAndTail = function (outerDiv) {
    var iwBackground = outerDiv.prev();

    // Remove the background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display': 'none'});

    // Remove the white background DIV
    iwBackground.children(':nth-child(4)').css({'display': 'none'});

    iwBackground.children(':nth-child(1)').css({'display': 'none'});
    iwBackground.children(':nth-child(3)').css({'display': 'none'});
};



var createInfoWindowContentString = function (heading, contentString) {

    return '<div id="iw-container">' +
            '<div class="iw-title">' + heading + '</div>' +
            '<div class="iw-content">' +
            contentString + '<p>' +
            '</div>' +
            '</div>';

};


s11.ui.getContentProvider = function (contentJson, name, wpApi) {
    if (!contentJson) {
        return s11.ui.NullContentProvider.create();
    }
    ;


    var contentJson = JSON.parse(contentJson);

    if (contentJson.blog) {
        return s11.ui.BlogExcerptContentProvider.create(wpApi, name, contentJson.blog);
    } else if (contentJson.image) {
        return s11.ui.ImageContentProvider.create(name, contentJson);
    } else if (contentJson.youtube) {
        return s11.ui.YoutubeContentProvider.create(name, contentJson.youtube);
    } else if (contentJson.text) {
        return s11.ui.TextContentProvider.create(name, contentJson.text);
    }
};

/**
 * A ContentProvider that does not show anything. No info window is shown when the component is clicked.
 */
s11.ui.NullContentProvider = function () {

    return {
        create: function () {
            return {
                getContent: function (callback) {
                    return;
                }
            };
        }
    };

}();

/**
 * A ContentProvider that shows some text in the info window.
 */
s11.ui.TextContentProvider = function () {

    return {
        create: function (name, text) {
            return {
                getContent: function (callback) {
                    var contentString = createInfoWindowContentString(name, text);
                    callback(contentString);
                }
            };
        }
    };

}();

/**
 * A ContentProvider that shows an embedded Youtube video player. 
 */
s11.ui.YoutubeContentProvider = function () {
    
    return {
        create: function (name, link) {
            return {
                getContent: function (callback) {
                    var contentString = '<iframe id="ytplayer" type="text/html" height="300" width="480"  src="http://www.youtube.com/embed/' + link + '" frameborder="0"/>';
                    contentString = createInfoWindowContentString(name, contentString);
                    callback(contentString);
                }
            };
        }
    };

}();

/**
 * A ContentProvider that shows an image in the info window. The image URL is passed into the provider.
 */
s11.ui.ImageContentProvider = function () {

    var makeSourceLink = function (source) {
        if (source) {
            return '<a href="' + source + '">Photo</a>';
        } else {
            return '';
        }
    };

    var makeLicenseLink = function (licenseUrl, licenseName) {

        if (!licenseName) {
            return '';
        }

        var licenseString = " / ";
        if (licenseUrl) {
            licenseString += '<a href="' + licenseUrl + '">';
        }

        return licenseString + licenseName + '</a>';
    };

    var makeAttribution = function (contentJson) {

        if (!contentJson.author) {
            return '';
        }
        return  makeSourceLink(contentJson.source) + ' by ' + contentJson.author + ' ' + makeLicenseLink(contentJson.licenseUrl, contentJson.license);
    };

    return {
        create: function (name, contentJson) {
            return {
                getContent: function (callback) {
                    if (!contentJson.image) {
                        return;
                    }
                    var imageTag = '<img src="' + contentJson.image + '" height="auto" width="auto" />' + makeAttribution(contentJson);

                    var contentString = createInfoWindowContentString(name, imageTag);
                    callback(contentString);

                }
            };
        }
    };

}();


/**
 * A ContentProvider that shows an a post excerpt of a Wordpress post. I receives the slug identifiying the post, and 
 * an object encapsulating the Wordpress REST API access. The excerpt is shown in the info window, typically 
 * containing a "Read more..." link.
 */
s11.ui.BlogExcerptContentProvider = function () {


    return {
        create: function (wpApi, name, slug) {

            var cachedExcerpt;
            var getPost = function (slug, callback) {

                if (!cachedExcerpt) {
                    wpApi.getPost(slug, function (excerpt) {
                        cachedExcerpt = excerpt;
                        callback(excerpt);
                    });

                } else {
                    callback(cachedExcerpt);
                }
            };

            return {
                getContent: function (callback) {
                    if (!name) {
                        return;
                    }

                    getPost(slug, function (excerpt) {
                        var contentString = createInfoWindowContentString(name, excerpt);
                        callback(contentString);
                    });

                }
            };
        }
    };

}();

s11.ui.InfoWindow = function () {

    var infoWindow = factory.createInfoWindow();


    configureInfowindow(infoWindow);

    return {
        showFromEvent: function (e, map) {
            var x = e.pageX;
            var pos = factory.createLatLng(e.pageX, e.pageY);

            var point = s11.util.fromLatLngToPoint(pos, map);
            this.show({'latLng': point});

        },
        show: function (e) {

            if (this.infoWindowContentProvider) {
                this.infoWindowContentProvider.getContent(function (content) {

                    if (content) {
                        infoWindow.setContent(content);
                        infoWindow.setPosition(e.latLng);
                        infoWindow.open(this.map);
                    }
                });

            }

        }
    };
}();



/* 
 * Copyright 2015 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file contains the s11.geomodel namespace. It defines the feature types as well as other,
 *  feature-related functions.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
s11.geomodel = s11.geomodel || {};

var factory = s11.geomodel.getFactory();


//================================
//TODO this should be extracted to plugin when possible

var boundsCache = {};

var focusser = factory.createMVCObject();
s11.geomodel.getFocusser = function () {
    return focusser;
};

factory.addEventListener(focusser, 'part_changed', function () {
    var focussedPart = focusser.get('part');
    log(focussedPart === null ? "Unfocus" : "Set focus on " + focussedPart.name);
});



var isWithin = function (innerPart, outerPart) {
    //TODO extend for multiple withins
    return innerPart.within === outerPart.name;
};


var checkCurrentFocus = function (region) {

    return function () {
        var focussedPart = focusser.get('part');
        if (focussedPart === null) {
            region.setVisible(true);
            return;
        }

        if ($.inArray(focussedPart, region.getParts()) >= 0) {
            region.setVisible(false);
        } else {
            region.setVisible(true);
            region.getParts().forEach(function (part) {
                if (isWithin(focussedPart, part)) {
                    region.setVisible(false);
                }
            });
        }

        focussedPart.setOptions({
            clickable: false
        });

    };
};


var zoomOnPart = function () {
    var bounds = getPolygonBounds(this);
    var map = this.parentRegion.getMap();
    var currentFocussedPart = focusser.get('part');
    if (currentFocussedPart) {
        currentFocussedPart.setVisible(true);
    }

    //fit bounds if polygon bounds are completely visible within map
    //this prevents unzooming when focussing in high zoom
    var mapBounds = map.getBounds();
    //if (containsBounds(mapBounds, bounds)) {
        map.fitBounds(bounds);
    //} 

    focusser.set('focusZoom', map.getZoom());
    focusser.set('part', this);
//    this.setVisible(false);
};

var containsBounds = function(outerBounds, innerBounds) {
    return outerBounds.contains(innerBounds.getNorthEast()) && outerBounds.contains(innerBounds.getSouthWest());
};

var getPolygonBounds = function (polygon) {

    var bounds = boundsCache[polygon.get('id')];
    if (!bounds) {
        bounds = factory.createLatLngBounds();
        polygon.getPath().forEach(function (element) {
            bounds.extend(element);
        });
        boundsCache[polygon.get('id')] = bounds;
    }

    return bounds;
};


//================================
//End focus mode stuff

/**
 * Abstract base class that represents a feature. All elemeents of the trip are derived from this class.<br>
 * @constructor 
 */
s11.geomodel.Feature = function () {

    /**
     * @type {google.maps.Map}
     */
    var map;

    /**
     * Returns the currently active map
     * @returns {google.maps.Map}
     */
    this.getMap = function () {
        return map;
    };

    /**
     * Sets the feature's map.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        map = newMap;
    };


};

/**
 * Class that represents a place of the trip, i.e. a location where a marker is shown.
 * 
 * @param {google.maps.Marker} placeMarker The marker that is wrapped by this place object. It is also possible to 
 * create a place from a location, use the Place.createFromData() method for that purpose.
 * @constructor 
 */
s11.geomodel.Place = function (placeMarker) {

    s11.geomodel.Feature.call(this);

    /**
     * @type {google.maps.Marker}
     */
    var marker;
    if (placeMarker) {
        marker = placeMarker;
    }



    factory.addEventListener(marker, 'mouseover', showPlaceTooltip);
    factory.addEventListener(marker, 'mouseout', s11.tooltip.hide);
    //factory.addEventListener(marker, 'click', newInfoWindow.show);
    //factory.addEventListener(marker, 'click', s11.util.showInfoWindow);

    //marker.infoWindowContentProvider = s11.util.BlogExcerptContentProvider.create(marker.name);

    /**
     * Returns the marker associated to this place.
     * @returns {google.maps.Marker}
     */
    this.getMarker = function () {
        return marker;
    };

    /**
     * Sets the marker associated with this place
     * @param {google.maps.Marker} newMarker
     */
    this.setMarker = function (newMarker) {
        marker = newMarker;
    };

    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * Sets the roue's map, and recursively sets the map to all legs.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);
        marker.setMap(newMap);

    };

};

s11.geomodel.MovingMarker = function (placeMarker) {

    s11.geomodel.Place.call(this, placeMarker);

};

/**
 * Abstract base class that represents a colored feature.
 * 
 * @param {string} newColor Color in 6 byte hex values
 * @constructor 
 */
s11.geomodel.ColoredFeature = function (newColor) {

    s11.geomodel.Feature.call(this);

    /**
     * @type {String}
     */
    var color = newColor;

    /**
     * @returns {String}
     */
    this.getColor = function () {
        return color;
    };

};

/**
 * Class that represents a region of a trip.<br>
 * A region consists of parts, which are basically extended Google Maps polygons. Parts can be added from various
 * sources. When a map is set to the region, the parts are printed on the map with the part boundaries having the color
 * specified at region creation. Parts are highlighted on mouse hover and show an info window with a title, description 
 * and optional image on a mouse click.<br>
 * 
 * @param {string} newColor Color in 6 byte hex values
 * @constructor 
 */
s11.geomodel.Region = function (newColor) {

    s11.geomodel.ColoredFeature.call(this, newColor);

    /**
     * @type {google.maps.Polyline[]}
     */
    var parts = [];

    var nextId = 0;


    factory.addEventListener(focusser, 'part_changed', checkCurrentFocus(this));

    this.nextId = function () {
        return nextId++;
    };

    /**
     * Returns the regions polygons
     * @returns {google.maps.Polygon[]}
     */
    this.getParts = function () {
        return parts;
    };

    /**
     * Sets the map of the region to null and removes all existing parts.
     */
    this.clear = function () {
        map = null;
        callOnAllParts(function (part) {
            part.setMap(null);
        });
        parts = [];
    };

    this.setVisible = function (flag) {
//        var zIndex = flag? part.zIndex
        callOnAllParts(function (part) {
            part.setOptions({
                clickable: flag,
                strokeColor: newColor
//                zIndex: 20
            });
        });

    };


    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * Sets the route's map, and recursively sets the map to all legs.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);

        callOnAllParts(function (part) {
            part.setMap(newMap);
        });

    };

    var callOnAllParts = function (func) {
        if (parts) {
            parts.forEach(func);
        }
    };

};



/**
 * Class that represents a route of a trip.<br>
 * A route consists of legs, which are basically extended Google Maps polylines. Legs can be added from various sources. 
 * When a map is set to the route, the legs are printed on the map in the color specified at route creation. Legs are 
 * highlighted on mouse hover and show an info window with a title, description and optional image on a mouse click.<br>
 * 
 * @param {string} newColor Color in 6 byte hex values
 * @constructor 
 */
s11.geomodel.Route = function (newColor) {

    s11.geomodel.ColoredFeature.call(this, newColor);


    /**
     * @type {google.maps.Polyline[]}
     */
    var legs = [];

    /**
     * Returns the route's legs
     * @returns {google.maps.Polyline[]}
     */
    this.getLegs = function () {
        return legs;
    };

    this.clear = function () {
        map = null;
        if (legs) {
            legs.forEach(function (leg) {
                leg.setMap(null);
            });
        }
        legs = [];
    };

    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * Sets the roue's map, and recursively sets the map to all legs.
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);
        legs.forEach(function (leg) {
            leg.setMap(newMap);
        });
    };


};

/**
 * Class that represents a trip.
 * This is a container class that contains the trip's routes, regions and places.
 * It inherits the map field from Feature, which recursively sets the map to all features contained in the trip.
 * 
 * @constructor 
 */
s11.geomodel.Trip = function () {

    s11.geomodel.Feature.call(this);

    /**
     * @type {s11.geomodel.Route[]}
     */
    var _routes = [];

    /**
     * @type {s11.geomodel.Place[]}
     */
    var _places = [];

    /**
     * @type {s11.geomodel.Region[]}
     */
    var _regions = [];

    /**
     * Returns the trip's places
     * @returns {s11.geomodel.Place[]}
     */
    this.getPlaces = function () {
        return _places;
    };

    /**
     * Returns the trip's routes
     * @returns {s11.geomodel.Route[]}
     */
    this.getRoutes = function () {
        return _routes;
    };

    /**
     * Returns the trip's regions
     * @returns {s11.geomodel.Region[]}
     */
    this.getRegions = function () {
        return _regions;
    };


    //Temp storage of the super setMap(). This apparently works, but looks nasty and should be improved
    var superSetMap = this.setMap;
    /**
     * 
     * @param {google.maps.Map} newMap The map to set
     */
    this.setMap = function (newMap) {
        superSetMap(newMap);
        setFeatureMap(_routes, newMap);
        setFeatureMap(_regions, newMap);
        setFeatureMap(_places, newMap);
    };

};


function inherits(subclass, superclass) {
    subclass.prototype = Object.create(superclass);
    subclass.prototype.constructor = subclass;
}


inherits(s11.geomodel.Trip, s11.geomodel.Feature);
inherits(s11.geomodel.Place, s11.geomodel.Feature);
inherits(s11.geomodel.MovingMarker, s11.geomodel.Place);
inherits(s11.geomodel.ColoredFeature, s11.geomodel.Feature);
inherits(s11.geomodel.Region, s11.geomodel.ColoredFeature);
inherits(s11.geomodel.Route, s11.geomodel.ColoredFeature);

//+++++++++++++++++++++++++++++++
//Public Trip methods
//+++++++++++++++++++++++++++++++

/**
 * Adds places to the trip. The method consumes a single place or an array of places.
 * @param {s11.geomodel.Place | s11.geomodel.Place[]} places A place or an array of places.
 */
s11.geomodel.Trip.prototype.addPlaces = function (places) {
    this.addFeatures(places, this.getPlaces());
};

/**
 * Adds routes to the trip. The method consumes a single route or an array of routes.
 * @param {s11.geomodel.Route | s11.geomodel.Route[]} routes places A route or an array of routes.
 */
s11.geomodel.Trip.prototype.addRoutes = function (routes) {
    this.addFeatures(routes, this.getRoutes());
};

/**
 * Adds regions to the trip. The method consumes a single region or an array of regions.
 * @param {s11.geomodel.Region | s11.geomodel.Region[]} regions places A region or an array of regions.
 */
s11.geomodel.Trip.prototype.addRegions = function (regions) {
    this.addFeatures(regions, this.getRegions());
};

/**
 * Generic method for adding features to the trip. The method consumes a single feature or an array of features.<br>
 * This method should not be called directly, since there are specific methods for each feature type. When called 
 * directly, it is important that the type of features and collection fit and that the correct collection is passed.
 * @param {s11.geomodel.Feature | s11.geomodel.Features[]} features A feature or an array of features.
 * @param {s11.geomodel.Feature[]} collection The feature collections, i.e. the trips routes, regions or places.
 */
s11.geomodel.Trip.prototype.addFeatures = function (features, collection) {
    if (features instanceof Array) {
        features.forEach(function (feature) {
            collection.push(feature);
        });
    } else {
        collection.push(features);
    }
};

//+++++++++++++++++++++++++++++++
//Public Place methods
//+++++++++++++++++++++++++++++++

/**
 * Returns the place's location. This is just a shortcut to getMarker().getLocation().
 * @return {google.maps.LatLng} position
 */
s11.geomodel.Place.prototype.getPosition = function () {
    return this.getMarker().getPosition();
};
/**
 * Returns the place's location. This is just a shortcut to getMarker().getLocation().
 * @return {google.maps.LatLng} position
 */
s11.geomodel.Place.prototype.setInfoWindowContentProvider = function (infoWindowContentProvider) {
    return this.getMarker().infoWindowContentProvider = infoWindowContentProvider;
};


/**
 * Creates a place from the given data.
 * 
 * @param {String} name Name of place. Appears as the info window title when the part is clicked on.
 * @param {String} text Appears as the info window content when the place is clicked on.
 * @param {String} link An optional link to a image that can be displayed in the info window when the place is clicked
 * @param {String} icon An optional icon to mark the place. If this is not provided, the default google maps icon is
 * used.
 * @param {google.maps.LatLng} position The position of the place.
 */
s11.geomodel.Place.createFromData = function (name, icon, position) {
    var markerOpts = {
        name: name,
        position: position
    };

    if (icon) {
        markerOpts.icon = icon;
    }
    var marker = factory.createMarker(markerOpts);
    var place = new s11.geomodel.Place(marker);
    return place;
};

//+++++++++++++++++++++++++++++++
//Public Region methods
//+++++++++++++++++++++++++++++++

//TODO construct from LatLng

s11.geomodel.Region.prototype.BORDER_STROKE_WEIGHT = 1.5;

s11.geomodel.Region.prototype.configureHighlighting = function () {

    this.getParts().forEach(function (part) {
        factory.clearListeners(part, 'mouseover');
        factory.clearListeners(part, 'mouseout');
        factory.addEventListener(part, 'mouseover', highlightRegion);
        factory.addEventListener(part, 'mouseout', unhighlightRegion);
    });
};


/**
 * Adds a part to the region. 
 * @param {google.maps.Polygon} part
 * @param partOptions Options Object: 
 * - name: Name of part. Appears as the info window title when the part is clicked on.
 * - text: Appears as the info window content when the part is clicked on.
 * - link: An optional link to a image that can be displayed in the info window when the part is clicked
 * - type: The type of the part (@see s11.data.type). This is translated to the zIndex of the feature,
 * meaning that a feature with a higher type value will be shown in the front.
 */
s11.geomodel.Region.prototype.addPart = function (part, partOptions) {
    part.setOptions({
        paths: part.getPaths(),
        strokeColor: this.getColor(),
        strokeOpacity: 0,
        strokeWeight: s11.geomodel.Region.prototype.BORDER_STROKE_WEIGHT,
        fillColor: part.fillColor,
        fillOpacity: 0.0,
        zIndex: partOptions.type
    });
    part.name = partOptions.name;
    part.text = partOptions.text;
    part.link = partOptions.link;
    part.color = this.getColor();
    part.parentRegion = this;
    part.within = partOptions.within;


//    factory.addEventListener(part, 'click', zoomOnPart);
    factory.addEventListener(part, 'dblclick', zoomOnPart);

    part.set('id', partOptions.name + '_' + this.nextId());
    part.setMap(this.getMap());
    this.getParts().push(part);

    this.configureHighlighting();

    return part;

};

/**
 * Adds a part to the region. 
 * @param partOptions Options Object: 
 * - geoJson: An array that contains the leg as GeoJSON Polygon objects.
 * - name: Name of part. Appears as the info window title when the part is clicked on.
 * - text: Appears as the info window content when the part is clicked on.
 * - link: An optional link to a image that can be displayed in the info window when the part is clicked
 * - type: The type of the part (@see s11.data.type). This is translated to the zIndex of the feature,
 * meaning that a feature with a higher type value will be shown in the front.
 */
s11.geomodel.Region.prototype.addParts = function (partOptions) {

    var jsonPolygons = partOptions.geoJson;
    if (jsonPolygons instanceof Array) {
        var returnParts = [];
        jsonPolygons.forEach(function (feature) {
            returnParts.push(this.addPart(feature, partOptions));
        }, this);
        return returnParts;
    } else {
        return this.addPart(jsonPolygons, partOptions);
    }
};

s11.geomodel.MovingMarker.prototype.moveAlongRoute = function (route) {

    var movingMarker = this;
    var pathArray = [];
    route.getLegs().forEach(function (leg) {
        pathArray.push(leg.getPath().getArray());
    });
    var path = pathFolder.foldPath(pathArray);
    var array = path;
    var length = array.length;
    var i = 0;

    window.setInterval(function () {
        if (i < length) {
            movingMarker.getMarker().setPosition(array[i]);
            i += 10;
        }
    }, 10);


};


//+++++++++++++++++++++++++++++++
//Public Route methods
//+++++++++++++++++++++++++++++++

/**
 * Adds a leg to the route. 
 * @param {google.maps.Polyline} leg
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 */
s11.geomodel.Route.prototype.addLeg = function (leg, legName) {

    leg.name = legName;
    factory.addEventListener(leg, 'mouseover', highlightPath);

    factory.addEventListener(leg, 'mouseover', showRouteTooltip);
    factory.addEventListener(leg, 'mouseout', s11.tooltip.hide);
    factory.addEventListener(leg, 'mouseout', unhighlightPath);

    leg.setMap(this.getMap());
    this.getLegs().push(leg);

};

/**
 * Adds a leg to the route. 
 * @param {MVCArray<LatLng>|Array<LatLng|LatLngLiteral>} path
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 * @param {Number} type The leg type. This translates to the zIndex and defaults to 40. Higher type means the leg
 * is shown in the foreground of legs elements with lower type.
 */
s11.geomodel.Route.prototype.addLegFromLatLong = function (path, legName, type) {

    if (!type) {
        type = 40;
    }
    var leg = factory.createPolyline({
        path: path,
        strokeColor: this.getColor(),
        strokeOpacity: 0.5,
        strokeWeight: 3,
        length: factory.computeLength(path) / 1000,
        zIndex: type
    });

    this.addLeg(leg, legName);

};

/**
 * Adds a leg to the route. 
 * @param {Object[]} jsonLineStrings An array that contains the leg as GeoJSON LineString objects.
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 */
s11.geomodel.Route.prototype.addLegFromGeoJSON = function (jsonLineStrings, legName, legText, legLink) {

    jsonLineStrings.forEach(function (feature) {
        feature.strokeColor = this.getColor();
        feature.strokeOpacity = 0.5;
        feature.strokeWeight = 3;

        this.addLeg(feature, legName, legText, legLink);

    }, this);

};

/**
 * Adds a leg to the route. 
 * @param {String} encodedPath The path as an  <a href="https://developers.google.com/maps/documentation/utilities/polylinealgorithm">encoded Google Maps polyline</a>
 * @param {String} legName Name of leg. Appears as the info window title when the leg is clicked on.
 * @param {String} legText Appears as the info window content when the leg is clicked on.
 * @param {String} legLink An optional link to a image that can be displayed in the info window when the leg is clicked
 * on.
 */
s11.geomodel.Route.prototype.addLegFromEncodedPath = function (encodedPath, legName) {
    var decodedPath = factory.decodePath(encodedPath);
    this.addLegFromLatLong(decodedPath, legName);

};

/**
 * Adds a leg to the route via queriyng the Google Maps API directions service.<br>
 * This method takes an array of String waypoints and queries the given {@code google.maps.DirectionsService} object. 
 * If not travelMode is supplied, {@code google.maps.TravelMode.TRANSIT} is used.<br>
 * There is no time information included in the request, and there is no guarantee for a specific route that can be 
 * taken. All the method does is trying to add a leg that somehow connects the waypoints with each other in the given 
 * order. Also, Google seems to have chosen to not display the geographically exact path for public transport, but 
 * rather connect the stops with each other by straight lines. So especially for train / bus rides having long sections 
 * without stops, this will not show a realistic geographical route.<br>
 * If the service query is not successful, an alert window is shown showing the cause.<br>
 * This method should be only be used in runtime if there is no other way to retrieve a route. It may be better used as 
 * a helper function during development, to retrieve an appropriate leg which is then persisted as e.g. an encoded path
 * which can be used thereafter.
 * 
 * @param {google.maps.DirectionsService} directionsService
 * @param {String[]} waypoints Describing the route that shall be queried for. E.g. quering the route from Frankfurt 
 * to Moscow via Warszaw: waypoints = ["Frankfurt", "Warszwaw", "Moscow"]
 * @param {google.maps.TransitMode} travelMode The travel mode. Default is {@code google.maps.TravelMode.TRANSIT}
 * on.
 */
s11.geomodel.Route.prototype.addLegFromDirectionsService = function (directionsService, waypoints, travelMode) {

    var route = this;
    var accuPath = [];
    var origin = waypoints[0];
    var destination = waypoints[waypoints.length - 1];
    var numWaypoints = waypoints.length - 1;

    log("Adding leg via directions from " + origin + " to " + destination);

    if (!travelMode) {
        travelMode = google.maps.TravelMode.TRANSIT;
    }

    //Currently (v3) the Google Maps API does not support waypoints for transit requests, so it is necessary to loop 
    //the waypoints and query the directions service for the different segments.
    for (i = 1; i <= numWaypoints; i++) {
        var curOrigin = waypoints[i - 1];
        var curDestination = waypoints[i];

        var request = createDirectionsRequest(curOrigin, curDestination, travelMode);
        directionsService.route(request, directionsServiceCallback);
    }

    function directionsServiceCallback(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            handleRouteResponse(response);
        } else {
            if (status === "ZERO_RESULTS" && response.request.travelMode !== google.maps.TravelMode.DRIVING) {
                window.alert('Could not find route for section ' + response.request.origin + ' to ' +
                        response.request.destination + '. Falling back to driving');

                var request = createDirectionsRequest(response.request.origin, response.request.destination, google.maps.TravelMode.DRIVING);
                directionsService.route(request, directionsServiceCallback);
                return;

            }
            window.alert('Directions request failed due to ' + status);
        }
    }

    var responseCounter = 0;
    var waypointToPathMap = {};

    /**
     * Handles the response retrieved from the directions service.<br>
     * A response contains a leg, which contains steps. Refer to the Google Maps API reference for 
     * further information. For each step, the given path is extracted and added to the overall path. After all 
     * responses have been received, the path is added as a leg to the route object.
     * @param {DirectionsResult} response
     */
    function handleRouteResponse(response) {
        responseCounter++;
        var steps = response.routes[0].legs[0].steps;
        var curOrigin = response.request.origin;
        var curDestination = response.request.destination;
        var accuStep = [];
        log("Received directions step from " + curOrigin + " to " + curDestination);

        steps.forEach(function (step) {
            step.path.forEach(function (pathSegment) {
                accuStep.push(pathSegment);
            });
        });

        waypointToPathMap[curOrigin] = accuStep;

        if (responseCounter === numWaypoints) {
            waypoints.forEach(function (waypoint) {
                var curSegment = waypointToPathMap[waypoint];
                if (curSegment) {
                    accuPath.push(curSegment);
                }
            });
            route.addLegFromLatLong(pathFolder.foldPath(accuPath), origin + " to " + destination,
                    origin + " to " + destination);
        }

    }

};

//TODO remove or test and document
s11.geomodel.Route.prototype.getRouteEndpoint = function () {
    var legs = this.getLegs();
    var lastLeg = legs[this.getLegs().length - 1];
    var legPath = lastLeg.getPath();

    var endpoint = legPath.getAt(legPath.length - 1);
    return endpoint;
};

//+++++++++++++++++++++++++++++++
//Private feature functions and helper objects
//+++++++++++++++++++++++++++++++

/**
 * Sets the given map to the given list of features
 * @param {s11.geomodel.Feature[]} features List of features
 * @param {google.maps.Map} map The map
 */
var setFeatureMap = function (features, map) {
    features.forEach(function (feature) {
        feature.setMap(map);
    });
};


//An object that folds a given array of paths into one path
var pathFolder = (function () {
    var foldedPath = [];

    var doFoldPath = function (pathArray) {
        pathArray.forEach(function (pathSegment) {
            pathSegment.forEach(function (point) {
                foldedPath.push(point);
            });
        });
        return foldedPath;

    };
    return {
        /**
         * Folds the given array of paths into one path (array of google.maps.LatLng)
         * @param {MVCArray<LatLng>[]|Array<LatLng|LatLngLiteral>[]} pathArray
         * @returns {Array}
         */
        foldPath: function (pathArray) {
            foldedPath = [];
            return doFoldPath(pathArray);
        }
    };
})();


//TODO util 
/**
 * Creates a DirectionsRequest object. When the travel mode is transit, {@code google.maps.TransitMode.TRAIN} is used 
 * as the transit mode.
 * @param {String} curOrigin
 * @param {String} curDestination
 * @param {google.maps.TransitMode} travelMode The travel mode
 * @returns {google.maps.DirectionsRequest}
 */
var createDirectionsRequest = function (curOrigin, curDestination, travelMode) {
    return {
        origin: curOrigin,
        destination: curDestination,
        travelMode: travelMode,
        transitOptions: {
            departureTime: new Date(),
            modes: [google.maps.TransitMode.TRAIN],
            routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
        }
    };
};

/**
 * Higlights a route leg.
 */
var highlightPath = function () {
    this.setOptions({
        strokeWeight: 5,
        strokeOpacity: 1
    });
};

/**
 * Unhiglights a route leg.
 */
var unhighlightPath = function () {
    this.setOptions({
        strokeWeight: 3,
        strokeOpacity: 0.5
    });
};

/**
 * Higlights a region.
 */
function highlightRegion() {
    this.parentRegion.getParts().forEach(function (part) {
        part.setOptions({
            strokeWeight: 1,
            strokeOpacity: 1
//            fillOpacity: 0.5
        });
    });
}



/**
 * Unhiglights a region.
 */
function unhighlightRegion() {

    this.parentRegion.getParts().forEach(function (part) {
        part.setOptions({
            //strokeWeight: 1.5,
            strokeOpacity: 0,
            fillOpacity: 0.0
        });
    });
}


var showPlaceTooltip = function () {
    var pos = this.getPosition();

    s11.tooltip.showOnMapPosition(pos, this.name, 0);

};

var showRouteTooltip = function (event) {
    var pos = event.latLng;
    s11.tooltip.showOnMapPosition(pos, this.name, 30);
};
















/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var s11 = s11 || {};
s11.controls = s11.controls || {};
var factory = s11.geomodel.getFactory();

s11.controls.ControlsContainer = function (map) {


    var centerControlDiv = document.createElement('div');
    $(centerControlDiv).addClass("control-container").attr("id", "top-center-controls");

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    var controls = [];

    return {
        "add": function (iconPath, text, callback) {

            var centerControl = new s11.controls.Control(centerControlDiv, iconPath, text, callback);
            controls.push(centerControl);

        },
        "getAll": function () {
            return controls;
        }
    };
};

/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
s11.controls.Control = function (controlDiv, iconPath, text, callback) {

    var controlUI = document.createElement('div');
    $(controlUI).addClass("control-div");
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    $(controlText).addClass("control-button-div").css("background-image", 'url("' + iconPath + '")');
    controlUI.appendChild(controlText);

    controlText.addEventListener('click', function (e) {
        callback(e);
    });
    $(controlText).hover(s11.tooltip.showFromEvent(text), s11.tooltip.hide);





};

var createShowTooltip = function (text) {
    return function (e) {
        var tt = $('#gm-style-tt');
        tt = tt.html(createTooltipContent(text)).css({
            'left': e.pageX + 10,
            'top': e.pageY + 10
        });
        tt.show();

    };
};

/* 
 * Copyright 2015 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file contains the s11.data namespace. It provides methods for requesting the trip data.
 * @author davidschuld@gmail.com (David Schuld)
 */
var s11 = s11 || {};
s11.data = s11.data || {};

s11.data.type = {
    ROUTE: 40,
    POI: 30,
    PROVINCE: 20,
    COUNTRY: 10
};

s11.data.DataProvider = function (key, routeDataTableId, regionDataTableId, placesDataTableId) {

    routeTable = new s11.data.FusionTable(routeDataTableId, {
        key: key

    });
    regionTable = new s11.data.FusionTable(regionDataTableId, {
        key: key

    });
    placesTable = new s11.data.FusionTable(placesDataTableId, {
        key: key

    });

    return {
        selectAllVisibleRoutes: function (callback) {

            routeTable.select("route, encoded,name,content,color,ordering").where("route>0").orderBy("ordering").execute(callback);
        },
        selectAllPlannedLegs: function (callback) {

            routeTable.select("encoded,name,content,ordering").where("route=1").orderBy("ordering").execute(callback);
        },
        selectAllActualLegs: function (callback) {

            routeTable.select("encoded,name,content,ordering").where("route=2").orderBy("ordering").execute(callback);
        },
        selectVisibleRegions: function (callback) {

            regionTable.select("name,text,link,type,within,custom_json,json_countries,json_provinces,json_lakes").where("visible=1").orderBy("type asc").execute(callback);
        },
        selectVisiblePlaces: function (callback) {

            placesTable.select("name,content,icon,location, zoom").where("visible=1").orderBy("name desc").execute(function (data) {
                callback(data);
            });
        }
    };

};

var makeAddress = function (statement1, statement2, tableId, callback, key) {
    var address = "https://www.googleapis.com/fusiontables/v2/query?sql=" + statement1 + tableId + statement2;
    if (callback) {
        address += "&callback=" + callback;
    }
    if (key) {
        address += "&key=" + key;
    }
    return address;
};

var callFusionTableApi = function (statement1, statement2, tableId, callback) {
    var script = document.createElement("script");
    script.setAttribute("src", makeAddress(statement1, statement2, tableId, callback, key));
    document.head.appendChild(script);
};

s11.data.insert = function (type, visible, name, text, link, icon, encoded, json) {
    var columns = " (type";
    var values = " VALUES (" + type;
    if (!type) {
        //throw exception
        return;
    }

    if (visible === 1 || visible === 0) {
        columns += ",visible";
        values += "," + visible;
    }
    if (name) {
        columns += ",name";
        values += ",'" + name + "'";
    }
    if (text) {
        columns += ",text";
        values += ",'" + text + "'";
    }
    if (link) {
        columns += ",link";
        values += ",'" + link + "'";
    }
    if (icon) {
        columns += ",icon";
        values += ",'" + icon + "'";
    }
    if (encoded) {
        columns += ",encoded";
        values += ",'" + encoded + "'";
    }
    if (json) {
        columns += ",json";
        values += ",'" + json + "'";
    }
    columns += ")";
    values += ")";

    var address = makeQuery("INSERT INTO ", columns + values);

    send("https://www.googleapis.com/fusiontables/v2/query", address);

};

function makeQuery(statement1, statement2) {
    var address = statement1 + routeDataTableId + statement2;
    return encodeURIComponent(address);
}


//TODO jquery ajax
function send(url, query) {
    var http = new XMLHttpRequest();
    var params = "sql=" + query;
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Authorization", "Bearer ya29.NAJPJzpZLprUzPjamDbFednMn36ujP145-BUx0_ETNBnnwr-jXdBlkizfU1_y0USgAET");

    http.onreadystatechange = function () {//Call a function when the state changes.
        console.log(http.responseText);
        if (http.readyState === 4) {
            if (http.status === 200) {
                var json = JSON.parse(http.responseText);
                alert("Inserted new row with rowId " + json.rows[0][0]);
            } else {
                alert(http.responseText);
            }
        }
    };
    http.send(params);
}

//for bulk ploygon insert, use import instead

//read from table --> function that adds script attribute

//statistics functions



/* 
 * Copyright 2015 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//Global variables
var map;
var trip = new s11.geomodel.Trip();
var s11 = s11 || {};
var factory = s11.geomodel.getFactory();
var wpdata = wpdata || {};

var tripOptions;


$(document).ready(function () {
    readOptions();
});

function centerMap(lat, lng) {
    map.setCenter(factory.createLatLng(lat, lng));
}

function readOptions() {


    if (wpdata.tripOptionsUrl) {
        var url = wpdata.tripOptionsUrl;

    } else {
        var url = './tripOptions.json';
    }

    $.getJSON(url, function (json) {
        tripOptions = json;
        initialize();
    });
}

function initialize() {

    focusser = s11.geomodel.getFocusser();

    map = factory.createMap(tripOptions.initCenter[1], tripOptions.initCenter[0], tripOptions.initZoom, 'googleMap', tripOptions.mapboxKey);

    factory.addEventListener(map, 'click', function (e) {
        toGeoJsonTextFromLatLng(e.latLng);
    });


    //TODO to focus mode plugin
    //Unfocus if zoomed out far enough
    factory.addEventListener(map, 'zoom_changed', function () {
        log("zoom: " + map.getZoom());
        if (map.getZoom() < focusser.get('focusZoom')) {
            var currentFocussedPart = focusser.get('part');
            if (currentFocussedPart) {
                currentFocussedPart.setVisible(true);
            }
            focusser.set('part', null);
        }
    });


    var controls = new s11.controls.ControlsContainer(map);
    
    if (!wpdata.restApiPath) {
        wpdata.restApiPath = '/wp-json/wp/v2/posts/';
    }
    if (!wpdata.wpBaseUrl) {
        wpdata.wpBaseUrl = 'http://192.168.1.58/wordpress/';
    }

    var wpApi = new s11.wpapi.WordpressConnector(wpdata.wpBaseUrl, wpdata.restApiPath);
    var globalData = {
        "map": map,
        "trip": trip,
        "factory": factory,
        "tripOptions": tripOptions,
        "log": function (message) {
            log(message);
        },
        "controls": controls,
        "wpApi": wpApi
    };


    s11.pluginLoader.init(globalData);

    if (tripOptions.debugWindow) {
        $('#debug-window').html("<textarea id='debug' readonly='true'>").show();
    }

}

s11.tooltip = function () {

    var showFlag = false;

    var createDelayedShow = function (text) {
        return function (e) {
            if (!delay) {
                var delay = 0;
            }

            showFlag = true;

            setTimeout(function () {
                if (!showFlag) {
                    delayFlag = true;
                    return;
                }
                var tt = $('#gm-style-tt');
                tt = tt.html(createTooltipContent(text)).css({
                    'left': e.pageX + 10,
                    'top': e.pageY + 10
                });
                tt.show();
            }, 1000);

        };
    };

    return {
        showOnMapPosition: function (pos, name, offset) {
            var point = s11.util.fromLatLngToPoint(pos, map);
            var tt = $('#gm-style-tt');
            tt = tt.html(createTooltipContent(name)).css({
                'left': point.x + 10,
                'top': point.y - offset
            });
            tt.show();

        },
        showFromEvent: function (text) {

            return createDelayedShow(text);

        },
        hide: function () {
            showFlag = false;
            $('#gm-style-tt').hide();
        }
    };

}();


var createTooltipContent = function (text) {
    return  '<div id="tooltip-content">' + text + '</div>';
};






function toGeoJsonTextFromLatLng(pos) {
    var json = '{"type":"Point","coordinates":[' + pos.lng() + ',' + pos.lat() + ']}';
    log(json);
    return json;
}

function toGeoJsonText(place) {
    var pos = place.getPosition();
    var json = '{"type":"Point","coordinates":[' + pos.lng() + ',' + pos.lat() + ']}';

    return json;
}


var logBuffer = "";
function log(message) {
    var debug = $('#debug');

    if (debug.length === 0) {
        logBuffer += message + "\n";
    } else {

        if (logBuffer) {
            debug.append(logBuffer);
            logBuffer = null;
        }
        debug.val(message + "\n" + debug.val());
    }
    console.log(message);
}


/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file implements a functionality to access an external service that provides information about 
 * the last known location, which is then shown on the map with a pegman icon.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};

var locationIndicator_PLUGIN_ID = "locationIndicator";

var addCurrentLocation = function (appData) {

    var locationIconPath = "http://www.penceland.com/images/google_map_man.gif";
    var locationServiceUrl = "https://big-vertex-117210.appspot.com/location/current";

    $.get(locationServiceUrl, function (locationData, status) {
        if (status === 'success') {
            callback(locationData, appData, locationIconPath);

            s11.pluginLoader.onLoad(locationIndicator_PLUGIN_ID, true);
        }
    });
};


var callback = function (locationData, appData, locationIconPath) {

    var location = appData.factory.createLatLng(locationData.coordinates[0], locationData.coordinates[1]);
    var locationText = locationData.timestamp;
    var myLocation = s11.geomodel.Place.createFromData(locationText, locationIconPath, location);
    var map = appData.map;
    appData.trip.addPlaces(myLocation);
    centerMap(locationData.coordinates[0], locationData.coordinates[1]);

    var latlng = {lat: location.lat(), lng: location.lng()};
    addGeocodeInfo(latlng, myLocation);
    appData.controls.add("https://drive.google.com/uc?export=download&id=0B48vYXs63P2ld3RrcmtlM1pWYVU", "Find me", function () {

        bounds = appData.factory.createLatLngBounds();
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() + 0.2, myLocation.getPosition().lng() + 0.2));
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() + 0.2, myLocation.getPosition().lng() - 0.2));
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() - 0.2, myLocation.getPosition().lng() + 0.2));
        bounds.extend(appData.factory.createLatLng(myLocation.getPosition().lat() - 0.2, myLocation.getPosition().lng() - 0.2));


        appData.map.fitBounds(bounds);

    });

    appData.factory.addEventListener(map, 'zoom_changed', function () {
        myLocation.setMap(map.getZoom() >= 8 ? map : null);
    });

};

function addGeocodeInfo(latlng, locationMarker) {

    s11.util.geocodeLatLng(latlng, function (results) {
        locationMarker.getMarker().name = results[1].formatted_address + "<br>" + locationMarker.getMarker().name;
    });
}


s11.pluginLoader.addPlugin(locationIndicator_PLUGIN_ID, function (data) {
    addCurrentLocation(data);
});



/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file implements a functionality to access the public photo feed of a Flickr account. For each 
 * geotagged picture in the feed, a marker is shown on the map that shows a photo thumbnail on click.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};

var photoFeed_PLUGIN_ID = "photoFeed";

var photoFeedWindow = function () {

    return {
        show: function (pos, picture, flickrLink, map) {
            var point = s11.util.fromLatLngToPoint(pos, map);
            var tt = $('#photoFeed-window');
            tt = tt.html(createXXXContent(picture, flickrLink)).css({
                'left': point.x,
                'top': point.y
            });
            tt.show();

        },
        hide: function () {
            $('#photoFeed-window').hide();
        }
    };

}();

var createXXXContent = function (picture, flickrLink) {
    var imageString = '<a href="' + flickrLink + '"  target="_blank"><img src="' + picture + '" height="auto" width="auto" /></a>';

    var contentString =
            '<div >' + imageString + '</div>';

    return contentString;
};

var addPhotoFeed = function (appData) {

    var mc = new MarkerClusterer(map, [], {
        gridSize: 20,
        styles: [{
                url: 'https://drive.google.com/uc?export=download&id=0B48vYXs63P2lSUU2X2hudTUtV0E',
                width: 32,
                height: 25,
                textSize: 10
            }]
    });
    var jsonUrl = 'https://api.flickr.com/services/feeds/geo/?id=' + appData.tripOptions.flickrId + '&lang=en-us&format=json&georss=true&tags=' + appData.tripOptions.flickrTag;

    jsonFlickrFeed = function (feedObject) {
        feedObject.items.map(function (entry) {
            return {
                picture: entry.media.m,
                flickrLink: entry.link,
                date: entry.date_taken,
                lat: entry.latitude,
                lng: entry.longitude
            };
        }).forEach(function (photo) {
            var location = appData.factory.createLatLng(photo.lat, photo.lng);
            var photoMarker = s11.geomodel.Place.createFromData("", "https://drive.google.com/uc?export=download&id=0B48vYXs63P2lSUU2X2hudTUtV0E", location);
            photoMarker.setMap(appData.map);

            mc.addMarker(photoMarker.getMarker());
            appData.factory.addEventListener(photoMarker.getMarker(), 'mouseout', function () {
                photoFeedWindow.hide();
            });

            appData.factory.addEventListener(photoMarker.getMarker(), 'click', function () {
                window.open(photo.flickrLink);
            });
            appData.factory.addEventListener(photoMarker.getMarker(), 'mouseover', function (e) {

                photoFeedWindow.show(e.latLng, photo.picture, photo.flickrLink, appData.map);

            });
        });
    };

    $.ajax({
        url: jsonUrl,
        data: {format: "json"},
        dataType: "jsonp"

    });

    s11.pluginLoader.onLoad(photoFeed_PLUGIN_ID, true);
};

var createPhotoWindowContent = function (picture, flickrLink) {

    var imageString = '<a href="' + flickrLink + '"  target="_blank"><img src="' + picture + '" height="auto" width="auto" /></a>';

    var contentString = '<div id="iw-container">' +
            '<div class="iw-content">' +
            imageString +
            '</div>' +
            '</div>';

    return contentString;
};

s11.pluginLoader.addPlugin(photoFeed_PLUGIN_ID, function (data) {
    addPhotoFeed(data);
});


/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file implements the functionality for loading and displaying places from an 
 * external data source.
 * @author davidschuld@gmail.com (David Schuld)
 */


var s11 = s11 || {};
s11.data = s11.data || {};
s11.ui = s11.ui || {};


var places_PLUGIN_ID = "places";

var addPlaces = function (data) {
    var tripOptions = data.tripOptions;
    var dataProvider = new s11.data.DataProvider(tripOptions.fusionTableApiKey, tripOptions.routeDataTableId,
            tripOptions.regionDataTableId, tripOptions.placeDataTableId);
    dataProvider.selectVisiblePlaces(placesDataHandler(data));
};

var checkIfVisible = function(data, place, zoomJson) {
    if (data.map.getZoom() <= zoomJson.max && map.getZoom() >= zoomJson.min) {
            place.getMarker().setMap(data.map);
        } else {
            place.getMarker().setMap(null);
        }
};



var configureVisibility = function (zoom, place, data) {

    var zoomJson = JSON.parse(zoom);
    zoomJson.max = zoomJson.max ? zoomJson.max : 100;
    zoomJson.min = zoomJson.min ? zoomJson.min : -1;
    data.factory.addEventListener(data.map, 'zoom_changed', function() {
        checkIfVisible(data, place, zoomJson);
    });
    
    checkIfVisible(data, place, zoomJson);

};

function placesDataHandler(data) {

    return function (placesData) {
        var defaultIcon = placesData.rows.filter(function (row) {
            var is = !row[3];
            return is;
        })[0][2];
        placesData.rows.forEach(function (row) {
            if (row[3]) {
                var name = row[0];
                var content = row[1];
                var icon = row[2] ? row[2] : defaultIcon;
                var location = row[3];
                var zoom = row[4];


                var json = JSON.parse(location);
                var geoJson = s11.util.loadGeoJSON(json, {
                    strokeColor: "#000000",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "#AAAAAA",
                    fillOpacity: 0.5
                });



                var place = s11.geomodel.Place.createFromData(name, icon, geoJson.position);
                place.setMap(data.map);

                if (zoom) {
                    configureVisibility(zoom, place, data);
                }

                place.setInfoWindowContentProvider(s11.ui.getContentProvider(content, name, data.wpApi));
                data.factory.addEventListener(place.getMarker(), 'click', s11.ui.InfoWindow.show);
                data.trip.addPlaces(place);

            }

        });

        s11.pluginLoader.onLoad(places_PLUGIN_ID, true);
    };


}

s11.pluginLoader.addPlugin(places_PLUGIN_ID, function (data) {
    addPlaces(data);
});

/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file implements the main functionality for loading and displaying routes and regions from an 
 * external data source.
 * @author davidschuld@gmail.com (David Schuld)
 */

var s11 = s11 || {};
var async = async || {};

var routes_regions_PLUGIN_ID = "routes_regions";

var getRegionDef = function (row) {

    var regionDef = {
        name: row[0],
        text: row[1],
        link: row[2],
        type: row[3],
        within: row[4]
    };

    for (i = 5; i <= 8; i++) {
        if (row[i]) {
            regionDef.geoJson = parseGeoJson(row[i]);
            return regionDef;
        }
    }

    //TODO throw exception
};

var parseGeoJson = function (jsonText) {
    var json = $.parseJSON(jsonText);
    return s11.util.loadGeoJSON(json, {
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#AAAAAA",
        fillOpacity: 0.5
    });
};

//TODO for JSON route loading (e.g. rivers)
var routeDataHandlerJson = function (curRoute, data, map, callback) {
    if (!data.rows) {
        return;
    }
    data.rows.forEach(function (row) {
        if (row[0]) {
            var geoJson = parseGeoJson(row[0]);
            curRoute.addLegFromGeoJSON(geoJson, "Mekong", "", "");
            log("Adding leg " + row[1]);
        }

    });
    curRoute.setMap(map);

    if (callback) {
        callback(null, 'route');
    }
};



//TODO refactoring for routes, color in FuTa
var routeDataHandler = function (data, appData, callback) {
    if (!data.rows) {
        return;
    }

    var routes = [];

    data.rows.forEach(function (row) {
        var routeId = row[0] - 1;
        if (!routes[routeId]) {
            routes[routeId] = new s11.geomodel.Route(row[4]);
            routes[routeId].setMap(appData.map);
        }
    });

    data.rows.forEach(function (row) {
        if (row[0]) {
            var route = routes[row[0] - 1];
            route.addLegFromEncodedPath(row[1], row[2]);
            var leg = route.getLegs()[route.getLegs().length - 1];
            leg.infoWindowContentProvider = s11.ui.getContentProvider(row[3], row[2], appData.wpApi);
            appData.factory.addEventListener(leg, 'click', s11.ui.InfoWindow.show);
            log("Adding leg " + row[2]);
        }

    });


    appData.trip.addRoutes(routes);

    if (callback) {
        callback(null, 'route');
    }
};


function regionDataHandler(data, appData, callback) {

    if (!data.rows) {
        return;
    }
    data.rows.forEach(function (row) {
        if (row[0]) {

            var regionDef = getRegionDef(row);
            log("Adding region: " + row[0]);
            var region = new s11.geomodel.Region(appData.tripOptions.regions.color);
            region.addParts(regionDef);
            region.setMap(appData.map);
            appData.trip.addRegions(region);

        }
    });
    
    var zoomTracker = function(regions, map) {
        
        var curZoom = 1;
        return function() {
            if (curZoom <= 8 && map.getZoom() > 8) {
                regions.forEach(function(region) {
                    region.setVisible(false);
                });
                
            } else if (curZoom > 8 && map.getZoom() <= 8) {
                regions.forEach(function(region) {
                    region.setVisible(true);
                });
            }
            
            curZoom = map.getZoom();
        };
    };
    
    appData.factory.addEventListener(appData.map, 'zoom_changed', zoomTracker(appData.trip.getRegions(), appData.map));
    

    callback(null, 'region');

}
//
//Ulan Ude, Ulan Bator, Zamiin-Uud
//Erenhot, Ulanqab, Beijing, Jinan, Shanghai, chengdu, lijian, dali, kunming, honghe, hekou
//ga Dong Dang, Hanoi, da nang, phu cat, nha trang, saigon
//saigon, pnomh penh, siem reap, bangkok

function addRoutesAndRegions(appData) {
    var tripOptions = appData.tripOptions;

    var dataProvider = new s11.data.DataProvider(tripOptions.fusionTableApiKey, tripOptions.routeDataTableId,
            tripOptions.regionDataTableId, tripOptions.placeDataTableId);
//    var mekongRoute = new s11.geomodel.Route(tripOptions.routes[1].color);

    async.parallel([
        function (callback) {
            dataProvider.selectAllVisibleRoutes(function (data) {
                routeDataHandler(data, appData, callback);
            });
        }
        ,
        function (callback) {
            dataProvider.selectVisibleRegions(function (data) {
                regionDataHandler(data, appData, callback);
            });
        }
//        ,
//        //TODO river loading; this should be implemented in own plugin 
//        //some stuff to be done, parse as GeoJSON, concatenate MultiLineString into one river
//        //or implement whole highlighting of routes on segment hover
//        function (callback) {
//            riverTable = new s11.data.FusionTable('1og6eG8AkTfERYVRcFOxxh4iBMaSqp_JP_b9Tlw', {
//                key: tripOptions.fusionTableApiKey
//
//            });
//            
//            riverTable.select("json_4326").where("name='Mekong'").execute(function(data) {
//                routeDataHandlerJson(mekongRoute, data, map, callback);
//            });
//        }
    ], function (err) {
        if (err) {
            s11.pluginLoader.onLoad(routes_regions_PLUGIN_ID, false);
        } else {
            s11.pluginLoader.onLoad(routes_regions_PLUGIN_ID, true);
        }
        return;
    });
}


s11.pluginLoader.addPlugin(routes_regions_PLUGIN_ID, function (appData) {
    addRoutesAndRegions(appData);
});

//MovingMarker
//        var route = trip.getRoutes()[0];
//        var leg = route.getLegs()[0];
//        var path = leg.getPath();
//        var startPoint = path.getAt(0);
//
//        var markerOpts = {
//            name: "",
//            text: "",
//            link: "",
//            position: startPoint,
//            icon: 'http://freefavicons.org/download/toy-train/toy-train.png'
//        };
//TODO own plugin and deactivate
//        var marker = factory.createMarker(markerOpts);
//        var movingMarker = new s11.geomodel.MovingMarker(marker);
//        movingMarker.setMap(map);
//        movingMarker.moveAlongRoute(route);
/* 
 * Copyright 2016 schuldd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview This file adds a help control that shows a popup with information about the app.
 * @author davidschuld@gmail.com (David Schuld)
 */


var s11 = s11 || {};

var helpControl_PLUGIN_ID = "helpControl";

var showHelp = function (appData, aboutWindow) {

    var toggleHelp = function () {
        var displayValue = 'block';

        return function () {

            aboutWindow.css({
                'display': displayValue
            });

            if (displayValue === 'block') {
                displayValue = 'none';
            } else {
                displayValue = 'block';
            }

        };
    }();


    appData.controls.add("https://drive.google.com/uc?export=download&id=0B48vYXs63P2lbUFBeFRYX2g5ZDA",
            "What is this all about?", function (e) {

               toggleHelp();
            });





};

var appendDiv = function (parentElement, id, classes) {
    parentElement.append("<div id='" + id + "' ></div>");

    var newDiv = $("#" + id);

    classes.forEach(function (cssClass) {
        newDiv.addClass(cssClass);
    });

    return newDiv;
};


s11.pluginLoader.addPlugin(helpControl_PLUGIN_ID, function (data) {

    var aboutWindowDiv = appendDiv($("#googleMap"), "about-window", ["gm-style-iw"]);

    var aboutWindowContent = appendDiv(aboutWindowDiv, "about-window-content", ["about-window-content"]);

    aboutWindowContent.html("This website is about my trip from Frankfurt to Southern Asia. You can read a <a href='#'>blog post</a> for more info about the trip.<p>You can use the map to look at the route that I am taking, the places I have been to, photos, and a lot more. Many items on the map are clickable and show you some info or pictures. Somethimes there is also a corresponding blog post, which will be loaded when you click the 'Continue Reading' link.<p>The route I have already travelled is shown in blue, the route I am planning to travel in the future is shown in gray, and the 'Find Me' button on the top of the map shows the place where I am right now.<br>When you move the cursor over a country or region that is part of my trip, you can see the region highlighted. You can double click to center the map on that region then.<p>If you just want to look at the blog posts without the map, click 'Hide Map' in the menu bar or scroll down in the area below the map. To show the map again, click 'Show Map' or scroll to the top of the page.<p>If you are interested in the technical aspects, have a look at <a href='http://hundredtickets.net/category/technology' class='menu-item-object-category'>the posts</a> I wrote about how I developed the website.");



    var aboutWindowFooter = appendDiv(aboutWindowDiv, "about-window-footer", ["about-window-footer"]);
    appendDiv(aboutWindowFooter, "about-window-divider-1", ["about-window-button"]);
    var aboutWindowCloseButton = appendDiv(aboutWindowFooter, "about-window-close-button", ["about-window-button"]);
    aboutWindowCloseButton.html("<a href='#'>Close</a>");
    appendDiv(aboutWindowFooter, "about-window-divider-2", ["about-window-button"]);


    aboutWindowCloseButton.click(function () {
        $("#about-window").css({
            'display': 'none'
        });
    });

    aboutWindowCloseButton.css('cursor', 'pointer');


    showHelp(data, aboutWindowDiv);
});