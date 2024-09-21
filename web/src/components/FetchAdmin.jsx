import { Flex, Spinner } from '@chakra-ui/react';

import useAuth from '../hooks/useAuth';

export default function FetchAdmin({ children }) {
  const { loading } = useAuth();

  return (
    <>
      {loading ? (
        <Flex h='100%' w='100%' alignItems='center' justifyContent='center'>
          <Spinner color='green.500' size='xl' thickness='5px' />
        </Flex>
      ) : (
        children
      )}
    </>
  );
}
