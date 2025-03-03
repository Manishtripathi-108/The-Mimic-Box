import RegisterForm from '@/components/layout/auth/Register';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register | The Mimic Box',
    description: 'Create an account on The Mimic Box to get started. Join us today!',
};

export default function RegisterPage() {
    return <RegisterForm />;
}
