import { Grid, Heading, Tag, Text, HStack } from '@chakra-ui/react';
import { MdCheck, MdClose } from 'react-icons/md';

import useModeColors from '../hooks/useModeColors';

const tagMap = {
  COMPS: 'blue',
  ELEC: 'purple',
  MECH: 'pink',
  EXTC: 'yellow',
  IT: 'green',
  OTHER: 'black',
};

export default function UserCard({
  user: { rollNo, department, criteria, moneyOwed, name },
  openUserModal,
}) {
  const { green } = useModeColors();

  return (
    <Grid
      p={4}
      w='100%'
      borderWidth='2px'
      borderRadius='lg'
      gridTemplateColumns='auto min-content'
      gridTemplateRows='auto min-content'
      alignItems='center'
      gap={4}
      _hover={{
        borderColor: green,
      }}
      cursor='pointer'
      onClick={() => openUserModal(rollNo)}
    >
      <HStack>
        <Heading size='lg'>{rollNo}</Heading>
        {Object.values(criteria).every(v => v === true) ? (
          <MdCheck size='1.5rem' />
        ) : (
          <MdClose size='1.5rem' />
        )}
      </HStack>
      <Text fontSize='xl' variant='outline' textAlign='center'>
        ₹{moneyOwed}
      </Text>
      <HStack>
        <Tag colorScheme={tagMap[department]} fontSize='xs'>
          {department}
        </Tag>
        <Text>{name}</Text>
      </HStack>
    </Grid>
  );
}
