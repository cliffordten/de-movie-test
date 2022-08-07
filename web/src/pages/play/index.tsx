import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { QuizeCard } from "../../components/QuizCard";
import { GiCrossMark } from "react-icons/gi";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { useShouldExitPage } from "../../hooks/useShouldExitPage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  useGetGameQuestionQuery,
  useGetUserQuizResponseMutation,
  UserQuizResponseInput,
} from "../../generated/graphql";
import { CustomAlert } from "../../components/CustomAlert";

const PlayGame: NextPage = () => {
  const [shouldExit, setShouldExit] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionsAnswers, setQuestionsAnswers] = useState<
    UserQuizResponseInput[]
  >([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const timeCount = useRef(Date.now() + 60000);
  const [{ data, error, fetching }, executeFetch] = useGetGameQuestionQuery({
    pause: true,
    requestPolicy: "network-only",
  });
  const [userScore, setUserScore] = useState(0);

  const [, getResults] = useGetUserQuizResponseMutation();

  useShouldExitPage(shouldExit);

  const router = useRouter();

  const fetchGameResult = useCallback(async () => {
    const response = await getResults({ input: questionsAnswers });
    setUserScore(
      response.data?.getUserCurrentGameResults.result?.currentScore || 0
    );
  }, [getResults, questionsAnswers]);

  useEffect(() => {
    if (!router.query.start) {
      alert("Please click the start button to begin the game");
      router.push("/");
    } else {
      setShouldExit(true);
      executeFetch();
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (data?.getGameQuestion?.quiz) {
      setCurrentQuestion(data?.getGameQuestion?.quiz);
    }

    if (error || data?.getGameQuestion?.error) {
      setShouldExit(false);
      fetchGameResult();
    }

    return () => {};
  }, [
    data?.getGameQuestion?.error,
    data?.getGameQuestion?.quiz,
    error,
    fetchGameResult,
    router,
  ]);

  const onTimeOut = async () => {
    await fetchGameResult();
    setShouldExit(false);
    setIsGameOver(true);
  };

  if (isGameOver) {
    return (
      <CustomAlert
        onClick={() => router.push("/user")}
        message={"Game Time Out"}
        bottonText="Game History"
        status="info"
      >
        <Text fontSize="2xl" mt={"2"}>
          Your Score {userScore}
        </Text>
      </CustomAlert>
    );
  }

  if (fetching) {
    return (
      <Flex alignItems="center" h="100vh" justifyContent="center">
        loading...
      </Flex>
    );
  }

  if (error || data?.getGameQuestion?.error) {
    return (
      <CustomAlert
        onClick={() => router.push("/user")}
        message={error?.message || data?.getGameQuestion?.error?.message}
        bottonText="Game History"
      >
        <Text fontSize="2xl" mt={"2"}>
          Your Score
        </Text>
      </CustomAlert>
    );
  }

  const makeResponse = (answer: boolean) => {
    executeFetch();
    setQuestionsAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion?.id, response: answer },
    ]);
  };

  return (
    <Box width={"35%"} margin="auto" mt={20}>
      <QuizeCard
        questionCount={questionsAnswers.length}
        onCountCompleted={onTimeOut}
        movie={currentQuestion?.movie}
        actor={currentQuestion?.actor}
        timeCount={timeCount.current}
      />
      <Flex
        justifyContent="center"
        alignItems={"center"}
        fontWeight="bold"
        fontSize="5xl"
        mt={"10"}
      >
        <IconButton
          colorScheme="red"
          aria-label="cross"
          size="lg"
          mr={"4"}
          onClick={() => makeResponse(false)}
          icon={<GiCrossMark size={30} />}
        />
        <IconButton
          colorScheme="teal"
          aria-label="heart"
          size="lg"
          onClick={() => makeResponse(true)}
          icon={<BsEmojiHeartEyes size={30} />}
        />
      </Flex>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  PlayGame
  // WithAuth(PlayGame)
);
