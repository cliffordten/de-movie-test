import { FC, useEffect } from "react";
import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import Countdown, { CountdownRenderProps } from "react-countdown";

interface IQuizeCardProps {
  curentScore?: string;
  actor?: {
    actorName?: string;
    actorImage?: string;
  };
  movie?: {
    movieName?: string;
    movieImage?: string;
  };
  timeCount?: Date;
  onCountCompleted?: Function;
}

interface IRendererCountProps {
  onCompleted?: Function;
}

// Renderer callback with condition
const RendererCount: FC<CountdownRenderProps & IRendererCountProps> = ({
  hours,
  minutes,
  seconds,
  completed,
  onCompleted,
}) => {
  useEffect(() => {
    if (completed) {
      onCompleted?.();
    }

    return () => {};
  }, [completed, onCompleted]);

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
  curentScore,
  timeCount,
  movie,
  actor,
  onCountCompleted,
}) => {
  return (
    <Box>
      <Flex
        justifyContent="space-between"
        alignItems={"center"}
        fontWeight="bold"
        fontSize="5xl"
      >
        <Text fontSize="3xl">Current Score</Text>
        <Text fontSize="xl">{curentScore || "0"}</Text>
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
            <RendererCount {...props} onCompleted={onCountCompleted} />
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
            boxSize="300px"
            src={actor?.actorImage || "https://bit.ly/dan-abramov"}
            alt="Dan Abramov"
          />
          <Stack mt={3} spacing="0">
            <Text fontSize="2xl">{actor?.actorName || "Lucious Lion"}</Text>
            <Text fontSize="lg">actor name</Text>
          </Stack>
        </Box>
        <Box padding={"3"} border="1px solid #e2e8f0" borderRadius="md">
          <Image
            boxSize="300px"
            src={movie?.movieImage || "https://bit.ly/dan-abramov"}
            alt="Dan Abramov"
          />
          <Stack mt={3} spacing="0">
            <Text fontSize="2xl">{movie?.movieName || "Empire"}</Text>
            <Text fontSize="lg">movie title</Text>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
