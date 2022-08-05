import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useGetMeQuery } from "../generated/graphql";

const authorizedRoutes = ["/user"];
const unAuthorizedRoutes = ["/login", "/register"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [{ data, error, fetching }] = useGetMeQuery();

  useEffect(() => {
    // checks whether we are on client / browser or server.
    // If there is no login user we redirect to "/login" page.
    if (authorizedRoutes.includes(router.pathname)) {
      if (error || data?.me?.error || !data?.me?.user) {
        router.replace("/login");
      }
    }

    // If there is login user we redirect to "/user" page.
    if (unAuthorizedRoutes.includes(router.pathname)) {
      if (data?.me?.user) {
        router.replace("/user");
      }
    }

    return () => {};
  }, [data?.me?.error, data?.me?.user, error, router]);

  return (
    <ChakraProvider resetCSS>
      {fetching ? (
        <Flex alignItems="center" h="100vh" justifyContent="center">
          loading...
        </Flex>
      ) : (
        <Component {...pageProps} user={data?.me?.user} />
      )}
    </ChakraProvider>
  );
}

export default MyApp;
