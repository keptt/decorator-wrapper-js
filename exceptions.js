class DecErrorBase extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name
    }
};


class DecError extends DecErrorBase {
    constructor(message) { super(message); }
};


class DecCreationError extends DecErrorBase {
    constructor(message='Something went wrong during decorator creation process') {
        super(message);
    }
}


class DecUseError extends DecErrorBase {
    constructor(message='Something went wrong during decorator\'s call to use method') {
        super(message);
    }
}


const decExc = {
    DecErrorBase
    , DecError
    , DecCreationError
    , DecUseError
};


module.exports = decExc;
