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
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { registerSchema } from "../utils/yup/auth.schema";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";
import WithAuth from "../hooks/withAuth";
import { CustomAlert } from "../components/CustomAlert";
import NextLink from "next/link";

interface IRegisterProps {}

const Register: NextPage<IRegisterProps> = () => {
  const router = useRouter();
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [, register] = useRegisterMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  return (
    <Wrapper variant="small">
      {error && <CustomAlert message={error} />}
      {success && (
        <CustomAlert
          onClick={() => router.push("/login")}
          message={success}
          status="success"
          bottonText="Login"
        />
      )}
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={registerSchema}
        onSubmit={async (values) => {
          const response = await register({ input: values });
          const data = response.data?.register;
          if (data?.error) {
            setError(data?.error.message);
            setSuccess("");
            return;
          }
          if (data?.user) {
            setError("");
            setSuccess("Account Created!");
            // router.push(`user/${data?.user.username}`);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
                type="text"
              />
            </Box>
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
                  type={show.password ? "text" : "password"}
                />
                <InputRightElement
                  onClick={() =>
                    setShow((prev) => ({ ...prev, password: !prev.password }))
                  }
                >
                  {show.password ? (
                    <FaEye color="green.500" />
                  ) : (
                    <FaEyeSlash color="green.500" />
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box mt={4}>
              <InputGroup>
                <InputField
                  name="confirmPassword"
                  placeholder="confirm password"
                  label="Confirm Password"
                  type={show.confirmPassword ? "text" : "password"}
                />
                <InputRightElement
                  onClick={() =>
                    setShow((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                >
                  {show.confirmPassword ? (
                    <FaEye color="green.500" />
                  ) : (
                    <FaEyeSlash color="green.500" />
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box mt={4}>
              <NextLink href="/login" passHref>
                <Link color="blue.600">login here!</Link>
              </NextLink>
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="blue"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(
  WithAuth(Register, false)
);
