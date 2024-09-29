import {
  Button,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { createHandleChange } from "../utils/createHandleChange";
import easyFetch from "../utils/easyFetch";

export default function AddUserModal({
  isOpen,
  onClose,
  finalFocusRef,
  mutate,
}) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    rollNo: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    rollNo: null,
    email: null,
  });

  const successToast = useToast();
  const failedToast = useToast();

  const handleChange = createHandleChange(setFields, setErrors);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Add User</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl isInvalid={errors.rollNo}>
              <FormLabel htmlFor="rollNo">roll number</FormLabel>
              <Input
                id="rollNo"
                name="rollNo"
                placeholder="[1|2|3|4|5]XXXXX(X)"
                value={fields.rollNo}
                onChange={handleChange}
                type="number"
                pattern="/^[12345]\d{5,6}$/"
              />
              <FormHelperText>
                For 'other' students leave this blank
              </FormHelperText>
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <FormLabel>email</FormLabel>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="abc@def.com"
                value={fields.email}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              const { error } = await easyFetch("users", fields);
              setLoading(false);
              if (error) {
                setErrors(error);
                failedToast({
                  title: error.email || error.rollNo || error,
                  status: "error",
                  duration: 5000,
                  position: "top",
                  isClosable: true,
                });
              } else {
                mutate();
                onClose();
                successToast({
                  title: `User added successfully`,
                  status: "success",
                  duration: 2000,
                  position: "top",
                  isClosable: true,
                });
              }
            }}
          >
            Add User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
