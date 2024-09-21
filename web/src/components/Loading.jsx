import { Flex, Spinner } from '@chakra-ui/react';
import useModeColors from '../hooks/useModeColors';

export default function Loading() {
  const { green } = useModeColors();

  return (
    <Flex w='100%' justifyContent='center'>
      <Spinner size='lg' color={green} />
    </Flex>
  );
}
