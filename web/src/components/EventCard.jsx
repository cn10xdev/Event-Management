import { Text, Grid, Heading, HStack, Tooltip } from '@chakra-ui/react';
import { MdPeopleOutline, MdPersonOutline } from 'react-icons/md';
import useModeColors from '../hooks/useModeColors';
import parseEventTime from '../utils/parseEventTime';

const categoryToEmojiMap = {
  C: '💃',
  T: '💻',
  F: '🎲',
};

export default function EventCard({
  event: {
    eventCode,
    title,
    start,
    seats,
    maxSeats,
    category,
    isSeminar,
    teamSize,
  },
  setEditEvent,
  editEventOnOpen,
}) {
  const { green } = useModeColors();

  return (
    <Grid
      p={4}
      w='100%'
      borderWidth='2px'
      borderRadius='lg'
      gridTemplateColumns='auto max-content'
      gridTemplateRows='auto max-content'
      alignItems='center'
      gap={4}
      _hover={{
        borderColor: green,
      }}
      cursor='pointer'
      onClick={() => {
        setEditEvent(eventCode);
        editEventOnOpen();
      }}
    >
      <HStack>
        <Tooltip label={eventCode} aria-label={`event code is ${eventCode}`}>
          <Heading
            size="lg"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {title}
          </Heading>
        </Tooltip>
        <Text>
          {categoryToEmojiMap[category]}
          {isSeminar && '🎤'}
        </Text>
      </HStack>
      <HStack alignItems="center" justifySelf="flex-end" spacing={1}>
        {teamSize === 1 ? <MdPersonOutline /> : <MdPeopleOutline />}
        <Text>
          {seats}/{maxSeats}
        </Text>
      </HStack>
      <Tooltip label={title} aria-label={`title is ${title}`}>
        <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {eventCode}
        </Text>
      </Tooltip>
      <Text fontSize="sm" justifySelf="flex-end">
        {parseEventTime(start).time}
      </Text>
    </Grid>
  );
}
