export interface UserVerificationPort {
    ensureUserExists(userId: string): Promise<void>;
}

export default UserVerificationPort;