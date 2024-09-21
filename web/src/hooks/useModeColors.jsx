import { useColorModeValue } from '@chakra-ui/react';

export default function useModeColors() {
  const red = useColorModeValue('red.500', 'red.200');
  const green = useColorModeValue('green.500', 'green.200');

  return {
    red,
    green,
  };
}
