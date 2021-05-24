const decExc = require('./exceptions');


class DecoratorSuper {
    constructor() {
        this.wrapper = null;
        this.appliedWrapper = null;
    }


    yield() {
        return this.appliedWrapper;
    }
    get = this.yield;


    yieldWrapper() {
        return this.wrapper;
    }
    getWrapper = this.yieldWrapper;


    chain(decorator) {
        // check if object is a decorator
        return decorator.use(this.appliedWrapper);
    }


    use(func) {
        if (!this.wrapper) {
            throw decExc.DecUseError('No wrapper parameter defined! decorator object was constructed incorrectly or super class "DecoratorSuper" was used');
        }

        this.appliedWrapper = this.wrapper(func);
        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        return clone;
    }
    wrap        = this.use;
    wrapAround  = this.use;
};


class DecoratorBeforeAfter extends DecoratorSuper {
    constructor(before, after) {
        super(before, after);

        this.wrapper = function(func) {
            return (function() {
                if (before) {
                    before(...arguments);
                }

                if (after) {
                    return after(func(...arguments));
                } else {
                    return func(...arguments);
                }
            });
        }
    }
};


class DecoratorBeforeAfterAsync extends DecoratorSuper {
    constructor(before, after) {
        super(before, after);

        this.wrapper = function(func) {
            return (async function() {
                if (before) {
                    await before(...arguments);
                }

                if (after) {
                    return after(await func(...arguments));
                } else {
                    return func(...arguments);
                }
            });
        }
    }
};


function singleFunctionFunctionality(before, after) {
    let singleFunc;
    if (!after && after !== null) {
        singleFunc = before;
    }

    if (singleFunc) {
        return (function(func) { return ( function() { return singleFunc(func, ...arguments); } ); });
    }
    return null;
}



class Decorator extends DecoratorBeforeAfter { // Add single function functionality to decorator
    constructor(before, after) {
        super(before, after);
        this.wrapper = singleFunctionFunctionality(before, after) || this.wrapper;
    }
};


class DecoratorAsync extends DecoratorBeforeAfterAsync {
    constructor(before, after) {
        super(before, after);
        this.wrapper = singleFunctionFunctionality(before, after) || this.wrapper;
    }
};


function checkDecoratorName(decoratorName) {
    if (!(decoratorName && (decoratorName instanceof String || typeof decoratorName == 'string'))) {
        throw new decExc.DecCreationError('No decorator name provided to "embedded" function');
    }
}


const dec = {
    spawn (before, after) {
        return new Decorator(before, after);
    }
    , create: this.spawn
    , embed (decoratorName, before, after) {
        checkDecoratorName(decoratorName);
        this[decoratorName] = this.spawn(before, after);
    }

    , spawnRest(before, after) { // spawn restricted
        return new DecoratorBeforeAfter(before, after)
    }
    , createRest: this.spawnRest
    , embedRest(decoratorName, before, after) {
        checkDecoratorName(decoratorName);
        this[decoratorName] = this.spawnRest(before, after);
    }

    , spawnAsync(before, after) {
        return new DecoratorAsync(before, after);
    }
    , createAsync: this.spawnAsync
    , embedAsync(decoratorName, before, after) {
        checkDecoratorName();
        this[decoratorName] = this.spawnAsync(before, after);
    }


    , spawnAsyncRest(before, after) {
        return new DecoratorBeforeAfterAsync(before, after);
    }
    , createAsyncRest: this.spawnAsyncRest
    , embedAsyncRest(decoratorName, before, after) {
        checkDecoratorName();
        this[decoratorName] = this.spawnAsyncRest(before, after);
    }


    , rem(decorator) {
        delete this[decorator];
    }
    , rm: this.rem
    , remove: this.rem
};


const decoratorsjs = {
    decExc
    , dec
};

module.exports = decoratorsjs;
