import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NhostProvider } from "@nhost/nextjs";
import { useRouter } from "next/router";
import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import { NhostClient } from "@nhost/nextjs";
import { nhost } from "@/config/nhost";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const client = new ApolloClient({
    uri: 'https://ekpicpqbbnrigtjgzfci.hasura.eu-central-1.nhost.run/v1/graphql', // Nhost GraphQL URL
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${nhost.auth.getAccessToken()}`, // Nhost oturum token'ı
    },
  });

  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={client}>  
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider>
            <Component {...pageProps} />
          </NextThemesProvider>
        </NextUIProvider>
        </ApolloProvider>
    </NhostProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
