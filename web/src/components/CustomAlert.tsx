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
    <Flex alignItems="center" h="100vh" justifyContent="center">
      <Box width={"25%"} textAlign="center">
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
  );
};
