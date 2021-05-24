# DecoratorJS
## decorators are simple!

![](https://img.shields.io/badge/license-MIT-green)

<br/>
<br/>

<p align="center">
  <img style="max-height: 200px" src="https://github.com/keptt/decoratorjs/blob/media/DecoratorJSLogo.png" />
</p>

<br/>

This library introduces decorators and provides an easy way to use them!

**What are decorators?**

In other languages like Python decorator is a function that wraps around an original function and adds additional logic before, after, or borth before and after an original function without making any changes to the original function's code.


**Why do we need to use decorators?**

Decorators are usually used when we either cannot or don't want to change the original code of the funciton but rather add some additional funcitonality to it.
Even if you think that changing the original code of the funciton once when you need something to it is a good idea, then think about if you need to add this exact change to 10 more different functions. That's when decorators come to our rescue.

Decorators might be used for:

* benchmarking
* counting function calls
* caching function results
* checking argument type at runtime
* metaprogramming

and many more!
[source](https://betterprogramming.pub/why-you-need-decorators-in-your-python-code-df12d43eac9c)


**Example of a decorator**

An example of a decorator function is shown below:

```javascript
const decorator = (func) => {
    return ((...args) => {
        console.log('Code executed before');

        let res = func(...args);

        console.log('Code executed after');
        return res;
    });
};

const actualFunction = (a, b) => {
    console.log('Decorators are not confusing... Right?... Right?... Ah?!!!');
    return a + b;
};

const decoratedFunction = decorator(actualFunction);

const sum = decoratedFunction(1, 1);
console.log('Result is:', sum);
```

The result of the above code will be:

```
Code executed before
Decorators are not confusing... Right?... Right?... Ah?!!!
Code executed after
Result is: 2
```

To be honest, the abovementioned example is not the most concise one and clear one. A lot of people would say that decorators are confusing. Well, I would also agree with many about the first part of the statement. Decorators really may become confusing.

However, with this library it is now possible to use decorators in your JavaScript code easily.

<br/>

### How it works

### Step 1
Import the package

```javascript
const decoratorjs = require('decoratorjs');
const dec = decoratorjs.dec;
```

### Step 2
Create a decorator object (decorator) using `spawn` or `spawnAsync` function (async funtions will be discussed later below):

```javascript
dec.newDecorator = dec.spawn((...args) => console.log('before:', ...args)
                     , (res) => { console.log('after:', res); return res; }
                 );
```
*Note:* you don't have to assign the decorator object to `dec.newDecorator` (where `newDecorator` is a name of your decorator) - it is just a possible way of keeping decorators in one place

*Note:* the `spawn` function has its synonym - `create` function which works exactly the same

*Note:* the first argument to the `spawn` is a funtion that will be executed before the decorated funtion.
The second argument is a function that will be executed after the decorated funtion. **If you don't want have a funtion either before or after then you MUST pass null instead of that funtion to the spawn function**

```javascript
// only code that executes after
dec.newDecorator = dec.spawn(null
                     , (res) => { console.log('after:', res); return res; }
                 );
```

```javascript
// only code that executes before
dec.newDecorator = dec.spawn((...args) => console.log('before:', ...args)
                     , null
                 );
```

If you think that it is confusing and easy to forget to add `null` parameter if you only need a function that executes before, then use a `spawnRest` or `createRest` (or `spawnRestAsync` for async funtions).

For example:
```javascript
// only code that executes before with spawnRest method
dec.newDecorator = dec.spawnRest((...args) => console.log('before:', ...args));
```

`spawnRest` means spawn restricted (*spawn in restricted mode*) and that is because standard `spawn` function also has a functinality of passing it a single function instead of before and after paramters. It is a convenience syntax which is called *single function functionallity* (in terms of this library) and looks like the following:

```javascript
dec.newDecorator = dec.spawn((func, ...args) => {
    console.log('before'); // insert code executed before the funciton here
    let res = func(...args);
    console.log('after'); // insert code executed after the funciton here
    return res;
});
```

Note the list of arguments to the funtion (the first argument is always `func`)

### Step 3
Decorate function with your created decorator and return it

```javascript
const actualFunction = (a, b) => {
    return a + b;
};

let decedFunction = dec.newDecorator.use(actualFunction).yield();
```

*Note:* method `use` will return decorator object back (this is used for chaining decorators).
You will not receive a callable function that has been decorated until you call `yield` method (or `get` which is a synonym to `yield`)

Now you can use your decorated function like the following:

```javascript
const res = decedFunction(1, 1); // the res will equal to 2
```

### Chaining decorators

Decorators can be chained together. When chaining decorators they will be executed from the outer one to the inner one.

Chaining is done by using method `chain` of the decorator object itself.

The following example shows how to chain several decorators together:

```javascript
dec.firstDecorator = dec.spawn((func, ...args) => {
    console.log('before 1'); // insert code executed before the funciton here
    let res = func(...args);
    console.log('after 1'); // insert code executed after the funciton here
    return res;
});

dec.secondDecorator = dec.spawn((func, ...args) => {
    console.log('before 2'); // insert code executed before the funciton here
    let res = func(...args);
    console.log('after 2'); // insert code executed after the funciton here
    return res;
});

dec.thirdDecorator = dec.spawn((func, ...args) => {
    console.log('before 3'); // insert code executed before the funciton here
    let res = func(...args);
    console.log('after 3'); // insert code executed after the funciton here
    return res;
});

const actualFunction = (a, b) => {
    console.log('actualFunciton');
    return a + b;
};

let decedFunction = dec.firstDecorator.use(actualFunction)
                                    .chain(dec.secondDecorator)
                                    .chain(dec.thirdDecorator)
                                    .yield();

console.log('Result is:', decedFunction(1, 1));
```

The result of the code above will be:

```
before 3
before 2
before 1
actualFunciton
after 1
after 2
after 3
Result is: 2
```

### Other methods

`embed` - creates a decorator object inside the package's export object (`embedAsync` for async)

`embedRest` - creates a decorator object inside the package's export object in restricted mode (`embedAsyncRest` for async in restricted mode)

`rem` (synonyms are `rm`, `remove`) - removes a decorator object that was previously added to he package's export object

Example:
```javascript
const decoratorjs = require('decoratorjs');
const dec = decoratorjs.dec;

dec.embed('firstDecorator', (...args) => console.log('before 1') // insert code executed before the funciton here
                     , (res) => { console.log('after 1'); return res; } // insert code executed after the funciton here
                 );


dec.embed('secondDecorator', (func, ...args) => {
    console.log('before 2'); // insert code executed before the funciton here
    let res = func(...args);
    console.log('after 2'); // insert code executed after the funciton here
    return res;
});

let firstDecorator = dec.firstDecorator // get firstDecorator
let secondDecorator = dec.secondDecorator // get secondDecorator

dec.rem('firstDecorator');
dec.rem('secondDecorator');

firstDecorator = dec.firstDecorator // undefined
secondDecorator = dec.secondDecorator // undefined
```


### An example with syncronous functions

```javascript
const decoratorjs = require('decoratorjs');
const dec = decoratorjs.dec;

dec.firstDecorator = dec.spawn((...args) => console.log('before 1') // insert code executed before the funciton here
                     , (res) => { console.log('after 1'); return res; } // insert code executed after the funciton here
                 );

dec.secondDecorator = dec.spawn((func, ...args) => {
    console.log('before 2'); // insert code executed before the funciton here
    let res = func(...args);
    console.log('after 2'); // insert code executed after the funciton here
    return res;
});

dec.thirdDecorator = dec.spawn((func, ...args) => {
    console.log('before 3'); // insert code executed before the funciton here
    let res = func(...args);
    console.log('after 3'); // insert code executed after the funciton here
    return res;
});

const actualFunction = (a, b) => {
    console.log('actualFunciton');
    return a + b;
};

let decedFunction = dec.firstDecorator.use(actualFunction)
                                    .chain(dec.secondDecorator)
                                    .chain(dec.thirdDecorator)
                                    .yield();

console.log('Result is:', decedFunction(1, 1));
```

The output will be:

```
before 3
before 2
before 1
actualFunciton
after 1
after 2
after 3
Result is: 2
```



### Decorators with async

In order to use the code with async functions the library exposes the following functions:

* `spawnAsync` (synonym is `createAsync`) - an async analogue of the `spawn` function
* `spawnAsyncRest` (synonym is `createAsyncRest`) - an aync analogue of the `spawnRest` function
* `embedAsync` - an analogue of the `embed` function
* `embedAsyncRest` - an analogue of the `embedRest` function

### An example with async

```javascript
const decoratorjs = require('decoratorjs');
const dec = decoratorjs.dec;

function later(delay) {
    return new Promise(function(resolve) {
        setTimeout(resolve, delay);
    });
}


async function actualFunction(a, b) {
    console.log('actualFunciton');
    return await later(1000).then(() => a + b);
}


dec.firstDecorator = dec.spawnAsync(async (func, a, b) => {
    await later(5000).then(() => console.log('before 1'));
    let res = func(a, b);
    await later(5000).then(() => console.log('after 1'));
    return res;
});


// different methods of decorator creation are shown below:
dec.secondDecorator = dec.spawnAsync(async (a, b) => await later(5000).then(() => console.log('before 2 (args: ' + a + ', ' + b + ')'))
                    , async (res) => { await later(5000).then(() => console.log('after 2 (result is: ' + res + ')')); return res; }
                );

thirdDecorator = async (func, a, b) => {
    await later(5000).then(() => console.log('before 3'));
    let res = await func(a, b);
    await later(5000).then(() => console.log('after 3'));
    return res;
};
dec.thirdDecorator = dec.spawnAsync(thirdDecorator);


let decoratedFunc = dec.firstDecorator.use(actualFunction)
                                    .chain(dec.secondDecorator)
                                    .chain(dec.thirdDecorator)
                                    .yield();

const main = async () => {
    const res = await decoratedFunc(1, 1);
    console.log('Result:', res);
}

main();
```

The output will be:

```
before 3
before 2 (args: 1, 1)
before 1
actualFunciton
after 1
after 2 (result is: 2)
after 3
Result: 2
```


### Short reference

#### Functions exposed by the library:

| Name              | Parameters                                                                                                                        | Description                                                                                       |
| -------------     | -------------                                                                                                                     | -------------                                                                                     |
| `spawn`           | `before` (`funciton`), `after` (`function`) or a single decorator funtion                                                         | cretes a decorator object                                                                         |
| `create`          | `before` (`function`), `after` (`function`) or a single decorator funtion                                                         | the same as `spawn`                                                                               |
| `embed`           | `decoratorName` (`string`), `before` (`funciton`), `after` (`function`) or `decoratorName` (`string`), a single decorator funtion | creates a decorator object inside the package's export object                                     |
| `spawnRest`       | `before` (`funciton`), `after` (`function`) or a single decorator funtion                                                         | creates a decorator object in restricted mode (e. g. without a "single function functionallity")  |
| `createRest`      | `before` (`funciton`), `after` (`function`) or a single decorator funtion                                                         | the same as `spawnRest`                                                                           |
| `embedRest`       | `decoratorName` (`string`), `before` (`funciton`), `after` (`function`) or `decoratorName` (`string`), a single decorator funtion | creates a decorator object inside the package's export object in restricted mode                  |
| `spawnAsync`      | `before` (`funciton`), `after` (`function`) or a single decorator funtion                                                         | analogue of `spawn` for async funtions                                                            |
| `createAsync`     | `before` (`funciton`), `after` (`function`) or a single decorator funtion                                                         | the same as `spawnAsync`                                                                          |
| `embedAsync`      | `decoratorName` (`string`), `before` (`funciton`), `after` (`function`) or `decoratorName` (`string`), a single decorator funtion | analogue of `embed` for async funtions                                                            |
| `spawnAsyncRest`  | `before` (`funciton`), `after` (`function`) or a single decorator funtion                                                         | the same as `spawnAsync` but in restricted mode                                                   |
| `createAsyncRest` | `before` (`funciton`), `after` (`function`) or a single decorator funtion                                                         | the same as `spawnAsyncRest`                                                                      |
| `embedAsyncRest`  | `decoratorName` (`string`), `before` (`funciton`), `after` (`function`) or `decoratorName` (`string`), a single decorator funtion | analogue of `embedRest` for async funtions                                                        |
| `rem`             | `decoratorName` (`string`)                                                                                                        | removes a decorator object that was previously added to he package's export object                |
| `rm`              | `decoratorName` (`string`)                                                                                                        | the same as `rem`                                                                                 |
| `remove`          | `decoratorName` (`string`)                                                                                                        | the same as `rem`                                                                                 |

#### Methods of the decorator object:

| Name              | Parameters        | Description                                                                                                   |
| -------------     | -------------     | -------------                                                                                                 |
| `yield`           | -                 | returns the decorated function from the decorator                                                             |
| `get`             | -                 | the same as `yield`                                                                                           |
| `use`             | function          | binds a function to the decorator (e. g. executes the funtion within the decorator)                           |
| `wrap`            | funciton          | the same as `use`                                                                                             |
| `wrapAround`      | function          | the same as `use`                                                                                             |
| `chain`           | decorator object  | chains current decorator with another decorator (e. g. executes another decorator's code then current one's)  |


### Notes

Do NOT use `use` function in the middle of chaining or anywhere except before the chaining:

```javascript
// BAD EXAMPLE, DO NOT DO THIS!
let decoratedFunc = dec.firstDecorator.use(actualFunction)
                                    .chain(secondDecorator)
                                    .chain(dec.thirdDecorator)
                                    .use(someFunc) // this line is incorrect and should be removed
                                    .chain(dec.thirdDecorator)
                                    .yield();
```

An example above leads to an undefined behaviour as `use` and `chain` are not supposed to work like that
