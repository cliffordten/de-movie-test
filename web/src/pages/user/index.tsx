import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
// import { useRouter } from "next/router";
// import { useGetByUsernameQuery, User } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Flex } from "@chakra-ui/react";
import { AppWithUserType } from "../../utils/interface/pages";

const Dashboard: NextPage = ({ user }: AppWithUserType) => {
  console.log(user);
  //   const router = useRouter();
  //   const username = router.query.username as string;
  //   const [{ data, error, fetching }] = useGetByUsernameQuery({
  //     variables: { username },
  //   });
  //   const email = data?.getByUsername?.email;

  //   if (fetching) {
  //     return (
  //       <Flex alignItems="center" h="100vh" justifyContent="center">
  //         loading...
  //       </Flex>
  //     );
  //   } else if (error) {
  //     return (
  //       <Flex alignItems="center" h="100vh" justifyContent="center">
  //         {" "}
  //         an error occurered when fetching
  //       </Flex>
  //     );
  //   } else {
  return (
    <Flex
      alignItems="center"
      h="100vh"
      justifyContent="center"
      fontWeight="bold"
      fontSize="5xl"
    >
      Welcome {user?.email}
    </Flex>
  );
  //   }
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Dashboard);
