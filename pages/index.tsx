import { useState } from 'react';
import { useSignInEmailPassword, useUserData } from '@nhost/react';
import { useRouter } from 'next/router';
import { Button, Input, Link, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";
import { gql, useQuery } from '@apollo/client';

// Kullanıcı rolünü getiren GraphQL sorgusu
const GET_USER_ROLE = gql`
  query GetUserRole($id: uuid!) {
    users_by_pk(id: $id) {
      role
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { signInEmailPassword } = useSignInEmailPassword();
  const user = useUserData(); 

  // GraphQL sorgusunu sadece kullanıcı verisi hazır olduğunda çalıştırıyoruz
  const { data, loading, error: queryError } = useQuery(GET_USER_ROLE, {
    variables: { id: user?.id },
    skip: !user || !user.id, // user.id yoksa sorguyu atlıyoruz
    onError: (error) => {
      console.error('GraphQL query error:', error); // Hata detaylarını console'a yazdırıyoruz
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error, needsEmailVerification } = await signInEmailPassword(email, password);
      if (error) {
        setError(error.message);
      } else if (needsEmailVerification) {
        setError("Lütfen e-postanızı doğrulatın.");
      } else {
        // Kullanıcının rolü sorgulanıyor
        if (loading) return; // Yüklenme devam ediyorsa bekle
        if (queryError) {
          setError("Kullanıcı rolü alınamadı.");
        } else {
          const role = data?.users_by_pk?.role;
          if (role === 'yonetici') {
            router.push('/yonetici');
          } else if (role === 'cagri_merkezi') {
            router.push('/cagrimerkezi');
          } else if (role === 'editor') {
            router.push('/editor');
          } else if (role === 'sosyal_medya') {
            router.push('/sosyalmedya');
          } else {
            setError("Geçersiz rol.");
          }
        }
      }
    } catch (err) {
      setError("Bir hata oluştu lütfen yeniden deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold">Giriş Yap</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              isRequired
              label="E-posta"
              placeholder="E-Posta Adresiniz"
              type="email"
              value={email}
              onValueChange={setEmail}
            />
            <Input
              isRequired
              label="Şifreniz"
              placeholder="Şifrenizi giriniz"
              type="password"
              value={password}
              onValueChange={setPassword}
            />
            <Button color="primary" type="submit" isLoading={isLoading}>
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
          {error && (
            <p className="text-danger mt-4 text-center">{error}</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
