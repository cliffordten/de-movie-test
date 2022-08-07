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
import { formatDate, removeToken } from "../../utils/methods";
import { useLogoutMutation } from "../../generated/graphql";

const Dashboard: NextPage = ({ user }: AppWithUserType) => {
  const [, logout] = useLogoutMutation();

  const logoutUser = () => {
    logout();
    removeToken();
    window.location.reload();
  };
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      fontSize="5xl"
      height={"100vh"}
      overflow="hidden"
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
          <Button colorScheme="teal" variant="outline" onClick={logoutUser}>
            Logout
          </Button>
        </Stack>
        {user?.quizResult?.length ? (
          <Box mt={6} maxHeight="60vh" overflowY={"scroll"} p="3" px={20}>
            <Flex
              justifyContent="space-between"
              alignItems={"center"}
              fontSize="5xl"
            >
              <Text fontSize="2xl">Your Games</Text>
              <Text fontSize="lg">Highest Score : {user.highestScore}</Text>
            </Flex>
            <TableContainer mt={3}>
              <Table variant="simple">
                <Thead>
                  <Tr fontWeight="bold">
                    <Th fontSize="md">No</Th>
                    <Th fontSize="md">Attempts in 60 secs</Th>
                    <Th fontSize="md">Correct Answers</Th>
                    <Th fontSize="md">Score</Th>
                    <Th fontSize="md">Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {user.quizResult
                    .map((item, inx) => (
                      <Tr key={item.id} fontWeight="normal">
                        <Td fontSize="lg">{inx + 1}</Td>
                        <Td fontSize="lg">
                          {item.totalAnsweredQuestions} Questions
                        </Td>
                        <Td fontSize="lg">{item.noCorrectAnswers}</Td>
                        <Td fontSize="lg">{item.currentScore}</Td>
                        <Td fontSize="lg">
                          {formatDate(Number(item.createdAt))}
                        </Td>
                      </Tr>
                    ))
                    .reverse()}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  WithAuth(Dashboard)
);
