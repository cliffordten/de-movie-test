import type { NextPage } from "next";
import NextLink from "next/link";
import Head from "next/head";
import Image from "next/image";
import {
  Flex,
  Text,
  Link,
  Code,
  Heading,
  Box,
  Stack,
  Button,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Flex direction="column" align="center" justify="center" py="3" h="100vh">
      <Head>
        <title>ZeMovieQuiz App</title>
        <meta name="description" content="ZeMovieQuiz app fullstack test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        direction="column"
        align="center"
        justify="center"
        w="full"
        flex="1"
        px="20"
      >
        <Heading as="h1" fontSize="6xl" fontWeight="bold">
          Welcome to{" "}
          <NextLink href="/" passHref>
            <Link color="blue.600">ZeMovieQuiz !</Link>
          </NextLink>
        </Heading>

        <Text mt="3" fontSize="2xl">
          <Code
            p="3"
            mt="3"
            fontSize="lg"
            bgColor="black.100"
            borderRadius="md"
            className="font-mono"
          >
            The best movie game ever made up to test your cinematic culture.
          </Code>
        </Text>

        <Stack direction="row" spacing={4} align="center" mt={"10"}>
          <NextLink href="/login" passHref>
            <Button colorScheme="teal" variant="solid">
              Login
            </Button>
          </NextLink>
          <NextLink href="/register" passHref>
            <Button colorScheme="teal" variant="outline">
              Get Started
            </Button>
          </NextLink>
        </Stack>
      </Flex>

      <Flex
        align="center"
        justify="center"
        w="full"
        h="24"
        borderTop="1px"
        className="border-t"
      >
        <NextLink
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          passHref
        >
          <Link rel="noopener noreferrer" isExternal>
            <Flex align="center" justify="center">
              <Box>Powered by </Box>
              <Box ml="2"> JKP-DEV</Box>
            </Flex>
          </Link>
        </NextLink>
      </Flex>
    </Flex>
  );
};

export default Home;
