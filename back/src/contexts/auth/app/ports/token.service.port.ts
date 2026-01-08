export interface TokenPayload {
    sub: string;
    roles: string[];
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface TokenServicePort {
    signAccessToken(payload: TokenPayload): Promise<string>;
    signRefreshToken(payload: TokenPayload): Promise<string>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
    hashToken(token: string): Promise<string>;
    compareTokenHash(token: string, hash: string): Promise<boolean>;
    getRefreshExpirationDate(): Date;
}

export default TokenServicePort;
