export class InvalidEmailError extends Error {
    constructor(message = 'Invalid email') {
        super(message);
        this.name = 'InvalidEmailError';
    }
}

export class InvalidUserStatusError extends Error {
    constructor(message = 'Invalid user status') {
        super(message);
        this.name = 'InvalidUserStatusError';
    }
}

export class InvalidAddressError extends Error {
    constructor(message = 'Invalid address') {
        super(message);
        this.name = 'InvalidAddressError';
    }
}

export class AddressNotFoundError extends Error {
    constructor(message = 'Address not found') {
        super(message);
        this.name = 'AddressNotFoundError';
    }
}

export class UserNotFoundError extends Error {
    constructor(message = 'User not found') {
        super(message);
        this.name = 'UserNotFoundError';
    }
}
