import { useState } from 'react';
import { useSignInEmailPassword } from '@nhost/react';
import { useRouter } from 'next/router';
import { Button, Input, Link, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { signInEmailPassword } = useSignInEmailPassword();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error, needsEmailVerification } = await signInEmailPassword(email, password);
      if (error) {
        setError(error.message);
      } else if (needsEmailVerification) {
        setError("Please verify your email address.");
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold">Login to Your Account</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              isRequired
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onValueChange={setEmail}
            />
            <Input
              isRequired
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onValueChange={setPassword}
            />
            <Button color="primary" type="submit" isLoading={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          {error && (
            <p className="text-danger mt-4 text-center">{error}</p>
          )}
        </CardBody>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Don't have an account? {' '}
            <Link href="/signup" className="text-primary">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}