import type { Metadata } from 'next';

import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Login | EduMind AI' };

export default function LoginPage() {
  return <LoginForm />;
}
