import mongoose, { Schema, Document } from 'mongoose';
import { hashPassword } from '@/lib/utils/password';

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
    console.log('🔄 Pre-save hook triggered...');

    if (!this.isModified('password')) {
        console.log('⚠️ Password not modified, skipping hashing...');
        return next();
    }

    try {
        console.log('🔒 Hashing password...');
        this.password = await hashPassword(this.password);
        console.log('✅ Password hashed successfully.');
        next();
    } catch (error) {
        console.error('❌ Error hashing password:', error);
        next(error as mongoose.CallbackError);
    }
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
