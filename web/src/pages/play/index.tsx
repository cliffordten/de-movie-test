import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { AppWithUserType } from "../../utils/interface/pages";
import { QuizeCard } from "../../components/QuizCard";
import { GiCrossMark } from "react-icons/gi";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { useShouldExitPage } from "../../hooks/useShouldExitPage";

const PlayGame: NextPage = ({ user }: AppWithUserType) => {
  useShouldExitPage(true);

  const onTimeOut = () => {
    console.log("game over");
  };
  return (
    <Box width={"35%"} margin="auto" mt={20}>
      <QuizeCard onCountCompleted={onTimeOut} />
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
          icon={<GiCrossMark size={30} />}
        />
        <IconButton
          colorScheme="teal"
          aria-label="heart"
          size="lg"
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
