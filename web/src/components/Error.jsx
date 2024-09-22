import { Center, Heading } from '@chakra-ui/react';
import useModeColors from '../hooks/useModeColors';

export default function Error({ error = 'No Data found' }) {
  const { red } = useModeColors();

  return (
    <Center h="300px">
      <Heading size='lg' textTransform='capitalize' color={red}>
        {error}
      </Heading>
    </Center>
  );
}
