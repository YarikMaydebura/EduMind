import type { Metadata } from 'next';

import { RegisterForm } from './register-form';

export const metadata: Metadata = { title: 'Register | EduMind AI' };

export default function RegisterPage() {
  return <RegisterForm />;
}
