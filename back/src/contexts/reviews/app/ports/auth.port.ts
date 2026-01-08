export interface AuthPort {
    ensureAuthenticated(userId: string): Promise<void>;
}

export default AuthPort;
