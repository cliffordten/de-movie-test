import { FC, MouseEventHandler } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Wrapper } from "./Wrapper";

interface ICustomAlertProps {
  message?: string | undefined;
  status?: "error" | "success" | "info";
  bottonText?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const CustomAlert: FC<ICustomAlertProps> = ({
  message,
  onClick,
  bottonText,
  status = "error",
  children,
}) => {
  return (
    <Wrapper variant="small">
      <Flex alignItems="center" justifyContent="center">
        <Box width={"100%"} textAlign="center">
          <Alert status={status} justifyContent={"space-between"}>
            <Box display={"flex"}>
              <AlertIcon />
              <AlertDescription>{message}</AlertDescription>
            </Box>
            {bottonText && (
              <Button
                onClick={onClick}
                rightIcon={<AiOutlineArrowRight />}
                colorScheme={status == "error" ? "red" : "teal"}
                variant="outline"
              >
                {bottonText}
              </Button>
            )}
          </Alert>
          {children}
        </Box>
      </Flex>
    </Wrapper>
  );
};
