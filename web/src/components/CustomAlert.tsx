import { FC, MouseEventHandler } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
} from "@chakra-ui/react";
import { AiOutlineArrowRight } from "react-icons/ai";

interface ICustomAlertProps {
  message?: string;
  status?: "error" | "success";
  bottonText?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const CustomAlert: FC<ICustomAlertProps> = ({
  message,
  onClick,
  bottonText,
  status,
}) => {
  return (
    <Alert status={status} justifyContent={"space-between"}>
      <Box display={"flex"}>
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Box>
      {bottonText && (
        <Button
          onClick={onClick}
          rightIcon={<AiOutlineArrowRight />}
          colorScheme="teal"
          variant="outline"
        >
          {bottonText}
        </Button>
      )}
    </Alert>
  );
};
