import { FC, InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  // InputGroup,
  // InputRightElement,
} from "@chakra-ui/react";

type IInputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder?: string;
  name: string;
};

// type IconInputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
//   label: string;
//   placeholder?: string;
//   name: string;
// };

export const InputField: FC<IInputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

// export const IconInputField: FC<IconInputFieldProps> = ({
//   label,
//   size: _,
//   ...props
// }) => {
//   const [field, { error }] = useField(props);
//   return (
//     <FormControl isInvalid={!!error}>
//       <FormLabel htmlFor={field.name}>{label}</FormLabel>

//              <InputGroup>
//              <Input
//         {...field}
//         {...props}
//         id={field.name}
//         placeholder={props.placeholder}
//       />
//                 <InputRightElement
//                   onClick={() =>
//                     setShow((prev) => ({ ...prev, password: !prev.password }))
//                   }
//                 >
//                   {show.password ? (
//                     <FaEye color="green.500" />
//                   ) : (
//                     <FaEyeSlash color="green.500" />
//                   )}
//                 </InputRightElement>
//               </InputGroup>
//       {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
//     </FormControl>
//   );
// };
