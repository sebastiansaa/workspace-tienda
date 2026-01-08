export type Result<T> =
    | { ok: true; payload: T }
    | { ok: false; reason: string; details?: any }

