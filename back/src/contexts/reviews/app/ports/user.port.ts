export interface UserPort {
    ensureUserExists(userId: string): Promise<void>;
}

export default UserPort;
