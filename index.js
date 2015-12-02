var Error  = require('@cjs-error/extend');
// var assign = require('@cjs-error/utils').assign;

module.exports = Error;

function type(name, prototype) {
  // i.e. `constructor.type()` in which case `Super === constructor`
  var Super = this, constructor, argType = typeof(name);

  if (argType === 'object') {
    // If `name` is typeof "object" then assume name is prototype
    prototype = name;
    name = prototype.name;
    if (type[name]) {
      constructor = type[name];
      // If cached then add all enumerable properties by descriptor to `constructor.prototype`
      return assign(constructor.prototype, prototype);
    }

    // Create a new constructor and return it, same as calling `Super.extend` directly without caching
    constructor = Super.extend(prototype);
    return type[name] = constructor;
  }
  else if (argType === 'function') {
    // Extend and cache the constructor, Notice: that it doesn't matter if type[name] is already cached
    constructor = Super.extend.apply(Super, arguments);
    return type[name.name] = constructor;
  }

  // Notice: `typeof` name is known only to not be an "object" and "function", if cached return that type
  if (type[name]) {
    return type[name];
  }

  // Extend and cache the constructor
  return type[name] = Super.extend.apply(Super, arguments);
}

Object.defineProperties(Error, {
  type: {
    configurable: true,
    writable: true,
    value: type
  },
  exists: {
    configurable: true,
    writable: true,
    value: Function.call.bind(Object.prototype.hasOwnProperty, type)
  }
});

// Lazy Error types
Object.defineProperties(Error.type, {
  SystemError: {
    configurable: true,
    get() {
      if (delete this.SystemError) {
        return this.SystemError = Error.extend({
          name: 'SystemError',
          with: function (code, errno, path) {
            this.code = code;
            this.errno = errno;
            this.path = path;
            return this;
          }
        });
      }
    },
    set(constructor) {
      if (delete this.SystemError) {
        this.SystemError = constructor;
      }
    }
  },
  ErrorEmitter: {
    configurable: true,
    get() {
      if (delete this.ErrorEmitter) {
        var EventEmitter = require('events');

        function ErrorEmitter(message, constructor) {
          constructor = constructor || ErrorEmitter;

          var error = Error.call(this, message, constructor);

          constructor.emit('*', error);
          constructor.emit(error.name, error);

          return error;
        }

        Object.assign(ErrorEmitter, EventEmitter.prototype);
        EventEmitter.call(ErrorEmitter);

        var _extend = Error.extend;
        ErrorEmitter.extend = function extend(name, prototype) {
          function ExtendedError(message, constructor) {
            return ErrorEmitter.call(this, message, constructor || ExtendedError);
          }

          return _extend.call(ErrorEmitter, ExtendedError, name, prototype);
        };

        return Error.type.ErrorEmitter = Error.extend(ErrorEmitter, 'ErrorEmitter');
      }
    },
    set(constructor) {
      if (delete this.ErrorEmitter) {
        this.ErrorEmitter = constructor;
      }
    }
  }
});