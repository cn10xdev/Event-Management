import { Center, Heading } from '@chakra-ui/react';
import useModeColors from '../hooks/useModeColors';

export default function Error({ error = 'something went wrong' }) {
  const { red } = useModeColors();

  return (
    <Center>
      <Heading size='lg' textTransform='capitalize' color={red}>
        {error}
      </Heading>
    </Center>
  );
}
