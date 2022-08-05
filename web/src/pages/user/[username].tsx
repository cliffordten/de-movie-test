import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useGetMeQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Flex } from "@chakra-ui/react";

const User: NextPage = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const [{ data, error, fetching }] = useGetMeQuery();
  const email = data?.me?.user?.email;
  console.log("%c[username].tsx line:13 data", "color: #007acc;", data);
  if (fetching) {
    return (
      <Flex alignItems="center" h="100vh" justifyContent="center">
        loading...
      </Flex>
    );
  } else if (error) {
    return (
      <Flex alignItems="center" h="100vh" justifyContent="center">
        {" "}
        an error occurered when fetching
      </Flex>
    );
  } else {
    return (
      <Flex
        alignItems="center"
        h="100vh"
        justifyContent="center"
        fontWeight="bold"
        fontSize="5xl"
      >
        Welcome {email}
      </Flex>
    );
  }
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
