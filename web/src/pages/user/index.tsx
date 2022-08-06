import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Flex } from "@chakra-ui/react";
import { AppWithUserType } from "../../utils/interface/pages";
import WithAuth from "../../hooks/withAuth";

const Dashboard: NextPage = ({ user }: AppWithUserType) => {
  return (
    <Flex
      alignItems="center"
      h="100vh"
      justifyContent="center"
      fontWeight="bold"
      fontSize="5xl"
    >
      Welcome {user?.username}
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  WithAuth(Dashboard)
);
