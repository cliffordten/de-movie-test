/* eslint-disable react-hooks/rules-of-hooks */
import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ElementType } from "react";
import { useGetMeQuery } from "../generated/graphql";

const WithAuth = (WrappedComponent: ElementType, authorize: Boolean = true) => {
  return Object.assign(
    (props: any) => {
      const router = useRouter();
      const [{ data, error, fetching }] = useGetMeQuery();

      // checks whether we are on client / browser or server.
      // If there is no login user we redirect to "/login" page.
      if (fetching) {
        return (
          <Flex alignItems="center" h="100vh" justifyContent="center">
            loading...
          </Flex>
        );
      }

      if (authorize) {
        if (error || data?.me?.error || !data?.me?.user) {
          router.replace("/login");
          return null;
        }
      }

      if (!authorize) {
        if (data?.me?.user) {
          router.replace("/user");
          return null;
        }
      }

      return <WrappedComponent {...props} user={data?.me?.user} />;

      // If we are on server, return null
    },
    { displayName: "HeyHey" }
  );
};

export default WithAuth;
