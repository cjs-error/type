var Error = module.exports = require('@cjs-error/extend');

function type(name, prototype) {
  // i.e. `Constructor.type()` in which case `Super === Constructor`
  var Super = this, Constructor;

  if (typeof(name) === 'object') {
    // If `name` is typeof "object" then assume name is prototype
    if (type[name.name]) {
      Constructor = type[name.name];
      // If cached then add all enumerable properties by descriptor to `Constructor.prototype`
      if (Constructor) {
        return assign(Constructor.prototype, name);
      }
    }

    // Create a new constructor and return it, same as calling `Super.extend` directly without caching
    Constructor = Super.extend.call(Super, name);
    return type[Constructor.name] = Constructor;
  }

  // `typeof` name is known only to not be an "object", if cached return that type
  if (type[name]) {
    return type[name];
  }

  // Create a new constructor and return it, same as calling `Super.extend` directly without caching
  return type[name] = Super.extend.apply(Super, arguments);
}

Object.defineProperty(Error, 'type', { configurable: true, writable: true, value: type });


// types are defined below
// -----------------------------------------------------------------------------------------------------

Object.defineProperty(Error.type, 'ErrorEmitter', {
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

        _extend.call(ErrorEmitter, ExtendedError, name, prototype);
        EventEmitter.call(ExtendedError);
        return ExtendedError;
      };

      return Error.type.ErrorEmitter = Error.extend(ErrorEmitter, 'ErrorEmitter');
    }
  }
});