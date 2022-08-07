import { FC, useEffect } from "react";
import { Badge, Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import Countdown, { CountdownRenderProps } from "react-countdown";

interface IQuizeCardProps {
  questionCount?: number;
  actor?: {
    actorName?: string;
    actorImage?: string;
  };
  movie?: {
    movieName?: string;
    movieImage?: string;
  };
  timeCount?: number;
  onCountCompleted?: Function;
  getCurrentTime?: Function;
}

interface IRendererCountProps {
  onCompleted?: Function;
  getCurrentTime?: Function;
}

// Renderer callback with condition
const RendererCount: FC<CountdownRenderProps & IRendererCountProps> = ({
  hours,
  minutes,
  seconds,
  completed,
  onCompleted,
  getCurrentTime,
}) => {
  useEffect(() => {
    if (completed) {
      onCompleted?.();
    }
    getCurrentTime?.(hours, minutes, seconds);
    return () => {};
  }, [completed, getCurrentTime, hours, minutes, onCompleted, seconds]);

  if (completed) {
    // Render a complete state
    return <Text fontSize="lg">time out!</Text>;
  } else {
    // Render a countdown
    return (
      <>
        <Text fontSize="lg" pr={"2"}>
          remaining :
        </Text>
        <Text fontSize="lg">
          {hours > 0 && <span>{hours}h:</span>}
          {minutes > 0 && <span>{minutes}m:</span>}
          <span>{seconds}s</span>
        </Text>
      </>
    );
  }
};

export const QuizeCard: FC<IQuizeCardProps> = ({
  questionCount,
  timeCount,
  movie,
  actor,
  onCountCompleted,
  getCurrentTime,
}) => {
  return (
    <Box>
      <Flex
        justifyContent="space-between"
        alignItems={"center"}
        fontWeight="bold"
        fontSize="5xl"
      >
        <Text fontSize="3xl">Questions Answered</Text>
        <Text fontSize="xl">{questionCount || "0"}</Text>
      </Flex>
      <Flex
        justifyContent="flex-end"
        alignItems={"center"}
        fontWeight="bold"
        fontSize="5xl"
        pb={"4"}
      >
        <Countdown
          date={timeCount || Date.now() + 60000}
          renderer={(props) => (
            <RendererCount
              {...props}
              onCompleted={onCountCompleted}
              getCurrentTime={getCurrentTime}
            />
          )}
        />
      </Flex>
      <Flex
        justifyContent="space-between"
        alignItems={"center"}
        fontSize="5xl"
        padding={4}
      >
        <Box padding={"3"} border="1px solid #e2e8f0" borderRadius="md">
          <Image
            width="300px"
            height={"400px"}
            src={actor?.actorImage || "https://bit.ly/dan-abramov"}
            alt="Dan Abramov"
          />
          <Stack mt={3} spacing="0" maxWidth={"300px"}>
            <Text fontSize="2xl">{actor?.actorName || "Lucious Lion"}</Text>
            <Text fontSize="lg">
              <Badge colorScheme="green">actor name</Badge>
            </Text>
          </Stack>
        </Box>
        <Box padding={"3"} border="1px solid #e2e8f0" borderRadius="md">
          <Image
            width="300px"
            height={"400px"}
            src={movie?.movieImage || "https://bit.ly/dan-abramov"}
            alt="Dan Abramov"
          />
          <Stack mt={3} spacing="0" maxWidth={"300px"}>
            <Text fontSize="2xl">{movie?.movieName || "Empire"}</Text>
            <Text fontSize="lg">
              {" "}
              <Badge colorScheme="purple">movie title</Badge>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
