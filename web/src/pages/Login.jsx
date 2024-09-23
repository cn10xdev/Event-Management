import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";

import { createHandleChange } from '../utils/createHandleChange';
import easyFetch from '../utils/easyFetch';
import useAuth from '../hooks/useAuth';
import { FaUserAlt, FaLock } from "react-icons/fa";
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function Login() {
  const history = useHistory();
  const { userData, userMutate } = useAuth();
  const [passShow, setPassShow] = useState(false);

  useEffect(() => {
    if (userData) {
      history.push('/users');
    }
  }, [userData, history]);

  const [fields, setFields] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: null,
    password: null,
  });

  const handleChange = createHandleChange(setFields, setErrors);
  const handleSubmit = async () => {
    const response = await easyFetch('auth/login', fields);
    const { data, error } = response;
    if (error) {
      error.map(({ field, message }) =>
        setErrors({ ...errors, [field]: message })
      );
    } else {
      await userMutate(data, false);
      history.push('/users');
    }
  };

  return (

    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input id='username' name='username' placeholder='username' value={fields.username} onChange={handleChange} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />

                  <Input
                    id='password'
                    name='password'
                    type={passShow ? 'text' : 'password'}
                    placeholder='password'
                    value={fields.password}
                    onChange={handleChange}
                  />

                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setPassShow(!passShow)}>
                      {passShow ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/* <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText> */}
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={handleSubmit}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}