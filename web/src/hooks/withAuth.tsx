/* eslint-disable react-hooks/rules-of-hooks */
import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ElementType } from "react";
import { CustomAlert } from "../components/CustomAlert";
import { useGetMeQuery } from "../generated/graphql";
// import { getToken } from "../utils/methods";

const excludesRoutes = ["/"];
// const USER_TOKEN = getToken();

const WithAuth = (WrappedComponent: ElementType, authorize: Boolean = true) => {
  return Object.assign(
    (props: any) => {
      const router = useRouter();
      const [{ data, error, fetching }] = useGetMeQuery();

      // if (!USER_TOKEN) {
      //   if (!excludesRoutes.includes(router.pathname)) {
      //     router.replace("/login");
      //     return null;
      //   }
      // }

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
          if (data?.me?.error?.field == "sessionExpired") {
            <CustomAlert
              onClick={() => router.push("/login")}
              message={data?.me?.error?.message}
              bottonText="Login"
            />;
          }
          if (!excludesRoutes.includes(router.pathname)) {
            router.replace("/login");
            return null;
          }
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
