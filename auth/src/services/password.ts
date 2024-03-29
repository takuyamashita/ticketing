import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAcync = promisify(scrypt);

export class Password {
    static async toHash(password: string){
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAcync(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string){
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAcync(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}