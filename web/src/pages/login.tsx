import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import {
  Box,
  Button,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useLoginMutation } from "../generated/graphql";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";
import { setToken } from "../utils/methods";
import WithAuth from "../hooks/withAuth";
import { CustomAlert } from "../components/CustomAlert";
import NextLink from "next/link";

interface ILoginProps {}

const Login: NextPage<ILoginProps> = () => {
  const [show, setShow] = useState(false);
  const [, login] = useLoginMutation();
  const [error, setError] = useState("");
  return (
    <Wrapper variant="small">
      {error && <CustomAlert message={error} />}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          const response = await login({ input: values });
          const data = response.data?.login;
          if (data?.error) {
            setError(data?.error.message);
            return;
          }
          if (data?.user) {
            setToken(data?.user?.accessToken || "");
            window.location.reload();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
            </Box>
            <Box mt={4}>
              <InputGroup>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type={show ? "text" : "password"}
                />
                <InputRightElement onClick={() => setShow((prev) => !prev)}>
                  {show ? (
                    <FaEye color="green.500" />
                  ) : (
                    <FaEyeSlash color="green.500" />
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box mt={4}>
              <NextLink href="/register" passHref>
                <Link color="blue.600">register here!</Link>
              </NextLink>
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="blue"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  WithAuth(Login, false)
);
