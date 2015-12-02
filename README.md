# Error.type()
Comprehensive and powerful node.js Error API for creating custom errors and stack traces
* Compliments [***@cjs-error/extend***](https://github.com/cjs-error/extend)
* Exposes an additional method on extended error constructors: `type`
* Error type import/export system
* Introduces new error types: `SystemError` and `ErrorEmitter`

## Install
* `npm install --save @cjs-error/type`
* _Without npm_: `git clone https://github.com/cjs-error/type.git`
* [Download Zip](https://github.com/cjs-error/type/zipball/master) | [Latest Release](https://github.com/cjs-error/type/releases/latest)

## API
* `Error.type(name)`
* `Error.type(name, prototype)`
* `Error.type(prototype)`
* `Error.type(constructor)`
* `Error.type(constructor, name)`
* `Error.type(constructor, name, prototype)`
* `Error.type(constructor, prototype)`
* `Error.exists(name)`

## Usage
Since `Error.type` has the same function signature and can work as an alias to `Error.extend` this documentation will pick up where [@cjs-error/extend](https://github.com/cjs-error/extend#details) leaves off. The usage is mostly the same but with some differences covered in [#Import/Export](#importexport)

```js
var Error = require('@cjs-error/type')

// With name
var CustomError = Error.type('CustomError')

// With name and prototype
var SystemError = Error.type('SystemError', {
  with: function (code, errno, path) {
    this.code = code;
    this.errno = errno;
    this.path = path;
    return this;
  }
});

// With prototype
var OpenError = SystemError.type({ name: 'OpenError', syscall: 'open' });

throw CustomError('message' /* optional context */)
throw OpenError('ENOENT: no such file or directory, open ./non-existant/').
  with('ENOENT', -2, './non-existant/')
```

## Import/Export
When creating _extended error constructors_ using `Error.type` the result will be cached using an Object type map. Other modules may then use `Error.type` to access that map.

```js
// Module A
var Error = require('@cjs-error/type')
var MyError = Error.type('MyError')

// Module B
var Error = require('@cjs-error/type')
var MyError = Error.type('MyError')
```

If both the `MyError` variables from "Module A" and "Module B" were compared for strict equality then the result would be `true`. This is useful for stubbing/mocking however it also presents an oppurtunity for collisions. If `@cjs-error/type` is to be used in a module rather than a project than the programmer should be cautious of this.

You might follow one or more of the following suggestions:
* Prefer using `@cjs-error/extend` in modules and export your _extended error constructors_ using `module.exports`
* Ensure that your type is generic enough to avoid compatibility issues and document that well
* Check for existant using `Error.exists` and elect to not redefine or extend the already existant type

## Details
_***Details are better written in code***_ :point_down:
```js

```

## License
[The MIT License (MIT)](../master/LICENSE)
* Copyright (c) 2015 [Rodney Teal](mailto:rodneyd.teal@gmail.com?subject=Regarding cjs-error)
