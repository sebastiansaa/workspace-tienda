export interface UserReadOnlyPort {
    findProfileById(userId: string): Promise<{ id: string; email: string; name: string; phone: string | null; status: string } | null>;
}

export default UserReadOnlyPort;
