import { Divider, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import useModeColors from '../hooks/useModeColors';

import getDetailedDate from '../utils/getDetailedDate';

export default function PaymentCard({
  payment: { adminUsername, userRollNo, amount, time },
}) {
  const { green } = useModeColors();

  return (
    <VStack
      flexDirection='column'
      p={3}
      w='100%'
      borderWidth='2px'
      borderRadius='lg'
      _hover={{
        borderColor: green,
      }}
    >
      <HStack alignItems='baseline' justifyContent='space-between' w='100%'>
        <Heading size='lg'>₹ {amount}</Heading>
        <Text fontSize='xl'>{userRollNo}</Text>
      </HStack>
      <Divider />
      <Flex alignItems='center' justifyContent='space-between' w='100%'>
        <Text>{adminUsername}</Text>
        <Text color='gray.500' fontStyle='italic'>
          on {getDetailedDate(time)}
        </Text>
      </Flex>
    </VStack>
  );
}
