export interface NotificationPort {
    notifyUser(userId: string, message: string): Promise<void>;
}

export default NotificationPort;
