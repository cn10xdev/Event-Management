import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { createHandleChange } from '../utils/createHandleChange';
import easyFetch from '../utils/easyFetch';
import useAuth from '../hooks/useAuth';

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
    <Box w='100%'>
      <VStack w='400px' maxW='100%' mx='auto' spacing={4}>
        <FormControl isInvalid={errors.username}>
          <FormLabel htmlFor='username'>username</FormLabel>
          <Input
            id='username'
            name='username'
            placeholder='username'
            value={fields.username}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <FormLabel htmlFor='password'>password</FormLabel>
          <InputGroup size='md'>
            <Input
              id='password'
              name='password'
              type={passShow ? 'text' : 'password'}
              placeholder='password'
              value={fields.password}
              onChange={handleChange}
            />
            <InputRightElement width='4.5rem'>
              <IconButton
                aria-label={passShow ? 'Hide' : 'Show'}
                icon={passShow ? <MdVisibility /> : <MdVisibilityOff />}
                onClick={() => setPassShow(!passShow)}
                colorScheme='green'
                variant='ghost'
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <Button colorScheme='green' alignSelf='flex-end' onClick={handleSubmit}>
          Log In
        </Button>
      </VStack>
    </Box>
  );
}
