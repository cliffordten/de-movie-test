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
  PreviousQuizResponseInput,
  useGetGameQuestionQuery,
  useGetUserQuizResponseMutation,
  UserQuizResponseInput,
} from "../../generated/graphql";
import { CustomAlert } from "../../components/CustomAlert";
import WithAuth from "../../hooks/withAuth";

const PlayGame: NextPage = () => {
  const [shouldExit, setShouldExit] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionsAnswers, setQuestionsAnswers] = useState<
    UserQuizResponseInput[]
  >([]);
  const [input, setInput] = useState<PreviousQuizResponseInput>({
    prevQuestionId: null,
    response: null,
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const timeCount = useRef(Date.now() + 60000);
  const [{ data, error, fetching }, executeFetch] = useGetGameQuestionQuery({
    pause: true,
    requestPolicy: "network-only",
    variables: {
      input: { ...input },
    },
  });
  const [userScore, setUserScore] = useState(0);

  const [gameErrors, setGameErrors] = useState<string | null | undefined>(null);

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
  }, [executeFetch, router]);

  useEffect(() => {
    if (data?.getGameQuestion?.quiz) {
      setCurrentQuestion(data?.getGameQuestion?.quiz);
    }

    if (error || data?.getGameQuestion?.error) {
      fetchGameResult();
      setShouldExit(false);
      setGameErrors(data?.getGameQuestion?.error?.message || error?.message);
      setIsGameOver(true);
    }

    return () => {};
  }, [
    data?.getGameQuestion?.error,
    data?.getGameQuestion?.quiz,
    data?.getGameQuestion?.game,
    error,
    fetchGameResult,
    router,
  ]);

  useEffect(() => {
    if (input.prevQuestionId && input.response) {
      executeFetch();
    }

    return () => {};
  }, [executeFetch, input.prevQuestionId, input.response]);

  const onTimeOut = async () => {
    await fetchGameResult();
    setShouldExit(false);
    setIsGameOver(true);
  };

  if (isGameOver) {
    return (
      <CustomAlert
        onClick={() => router.push("/user")}
        message={gameErrors ? "Game Over" : "Game Time Out"}
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

  const makeResponse = (answer: boolean) => {
    setInput({
      prevQuestionId: currentQuestion?.id,
      response: answer,
    });
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
  WithAuth(PlayGame)
);
