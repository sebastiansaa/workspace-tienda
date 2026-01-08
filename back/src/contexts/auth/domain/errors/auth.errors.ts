export class UserAlreadyExistsError extends Error {
    constructor(message = 'User already exists') { super(message); this.name = 'UserAlreadyExistsError'; }
}

export class InvalidCredentialsError extends Error {
    constructor(message = 'Invalid credentials') { super(message); this.name = 'InvalidCredentialsError'; }
}

export class RefreshTokenNotFoundError extends Error {
    constructor(message = 'Refresh token not found') { super(message); this.name = 'RefreshTokenNotFoundError'; }
}

export class RefreshTokenExpiredError extends Error {
    constructor(message = 'Refresh token expired') { super(message); this.name = 'RefreshTokenExpiredError'; }
}

export class UserNotFoundError extends Error {
    constructor(message = 'User not found') { super(message); this.name = 'UserNotFoundError'; }
}

export class AccessDeniedError extends Error {
    constructor(message = 'Access denied') { super(message); this.name = 'AccessDeniedError'; }
}

export class InvalidEmailError extends Error {
    constructor(message = 'Invalid email') { super(message); this.name = 'InvalidEmailError'; }
}

export class InvalidPasswordHashError extends Error {
    constructor(message = 'Invalid password hash') { super(message); this.name = 'InvalidPasswordHashError'; }
}

export class InvalidRoleError extends Error {
    constructor(message = 'Invalid role') { super(message); this.name = 'InvalidRoleError'; }
}
