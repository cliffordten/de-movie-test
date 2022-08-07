import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import {
  Box,
  Button,
  Flex,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { AppWithUserType } from "../../utils/interface/pages";
import WithAuth from "../../hooks/withAuth";
import NextLink from "next/link";

const Dashboard: NextPage = ({ user }: AppWithUserType) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      fontSize="5xl"
      height={"100vh"}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        flexDirection={"column"}
      >
        <Text fontSize="3xl">Welcome {user?.username}</Text>
        <Stack direction="row" spacing={4} align="center" mt={"10"}>
          <NextLink href="/play?start=true" passHref>
            <Button colorScheme="teal" variant="solid">
              Start Game
            </Button>
          </NextLink>
          <Button colorScheme="teal" variant="outline">
            Logout
          </Button>
        </Stack>
      </Flex>
      {user?.quizResult?.length ? (
        <Box>
          <Flex
            justifyContent="space-between"
            alignItems={"center"}
            fontSize="5xl"
          >
            <Text fontSize="2xl">Your Games</Text>
            <Text fontSize="xl">Highest Score : {user.highestScore}</Text>
          </Flex>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Quiz Attempts in 60 secs</Th>
                  <Th>Correct Answers</Th>
                  <Th>Score</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {user.quizResult.map((item) => (
                  <Tr key={item.id}>
                    <Td>inches</Td>
                    <Td>millimetres (mm)</Td>
                    <Td isNumeric>25.4</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : null}
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  WithAuth(Dashboard)
);
