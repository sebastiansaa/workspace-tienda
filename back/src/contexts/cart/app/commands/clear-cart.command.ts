export class ClearCartCommand {
    constructor(public readonly userId: string) {
        if (!userId || userId.trim().length === 0) throw new Error('El usuario es requerido');
    }
}
