import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { AppWithUserType } from "../../utils/interface/pages";
import { QuizeCard } from "../../components/QuizCard";
import { GiCrossMark } from "react-icons/gi";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { useShouldExitPage } from "../../hooks/useShouldExitPage";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useGetGameQuestionQuery } from "../../generated/graphql";
import { CustomAlert } from "../../components/CustomAlert";
interface AnswerType {
  questionId?: string;
  response: boolean;
}

const PlayGame: NextPage = ({ user }: AppWithUserType) => {
  const [shouldExit, setShouldExit] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState<AnswerType[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const timeCount = useRef(Date.now() + 60000);
  const [{ data, error, fetching }, executeFetch] = useGetGameQuestionQuery({
    pause: true,
  });

  useShouldExitPage(shouldExit);

  const router = useRouter();

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

  console.log(fetching, data?.getGameQuestion?.quiz);

  useEffect(() => {
    if (data?.getGameQuestion?.quiz) {
      setCurrentQuestion(data?.getGameQuestion?.quiz);
    }

    if (error || data?.getGameQuestion?.error) {
      setShouldExit(false);
    }

    return () => {};
  }, [
    data?.getGameQuestion?.error,
    data?.getGameQuestion?.quiz,
    error,
    router,
  ]);

  const onTimeOut = () => {
    setIsGameOver(true);
    setShouldExit(false);
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
          Your Score
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
    setQuestionsAnswered((prev) => [
      ...prev,
      { questionId: currentQuestion?.id, response: answer },
    ]);
  };

  return (
    <Box width={"35%"} margin="auto" mt={20}>
      <QuizeCard
        questionCount={questionsAnswered.length}
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
