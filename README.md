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

## Usage
Since `Error.type` has the same function signature and can work as an alias to `Error.extend` this documentation will pick up where [@cjs-error/extend](https://github.com/cjs-error/extend#details) leaves off.

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

## Details
_***Details are better written in code***_ :point_down:
```js

```

## License
[The MIT License (MIT)](../master/LICENSE)
* Copyright (c) 2015 [Rodney Teal](mailto:rodneyd.teal@gmail.com?subject=Regarding cjs-error)
