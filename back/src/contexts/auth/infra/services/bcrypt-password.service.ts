import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import { PasswordHasherPort } from '../../app/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordService implements PasswordHasherPort {
    private readonly rounds: number;

    constructor(configService: ConfigService) {
        this.rounds = configService.get<number>('AUTH_BCRYPT_ROUNDS') ?? 10;
    }

    async hash(password: string): Promise<string> {
        return bcryptHash(password, this.rounds);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcryptCompare(password, hash);
    }
}

export default BcryptPasswordService;
