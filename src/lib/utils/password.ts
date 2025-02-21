import bcrypt from 'bcryptjs';

export async function hashPassword(plaintext: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plaintext, salt);
}

export async function verifyPassword(plaintext: string, hashed: string) {
    return bcrypt.compare(plaintext, hashed);
}
