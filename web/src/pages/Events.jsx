import {
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { mutate } from 'swr';
import AddEventModal from '../components/AddEventModal';
import EditEventModal from '../components/EditEventModal';

import EventPanel from '../components/EventPanel';

const days = [1, 2, 3];

const mutateEvents = () =>
  Promise.all(days.map(day => mutate(`events/pages/${day}`)));

export default function Events() {
  const tabColor = useColorModeValue('green.600', 'green.300');
  const tabTitle = useBreakpointValue({
    base: { one: 'One', two: 'Two', three: 'Three' },
    md: { one: 'Day One', two: 'Day Two', three: 'Day Three' },
  });

  const [editEvent, setEditEvent] = useState(null);

  const {
    isOpen: addEventIsOpen,
    onOpen: addEventOnOpen,
    onClose: addEventOnClose,
  } = useDisclosure();
  const {
    isOpen: editEventIsOpen,
    onOpen: editEventOnOpen,
    onClose: editEventOnClose,
  } = useDisclosure();

  return (
    <>
      <Tabs
        colorScheme='green'
        variant='solid-rounded'
        isFitted
        isLazy
        isManual
      >
        <TabList>
          <Tab>{tabTitle?.one}</Tab>
          <Tab>{tabTitle?.two}</Tab>
          <Tab>{tabTitle?.three}</Tab>
          <IconButton
            aria-label='add an event'
            icon={<MdAdd fontSize='1.25rem' />}
            colorScheme='green'
            bgColor={tabColor}
            borderRadius='full'
            onClick={addEventOnOpen}
          />
        </TabList>
        <TabPanels>
          {days.map(day => (
            <TabPanel key={day} px={0} py={6}>
              <EventPanel
                day={day}
                setEditEvent={setEditEvent}
                editEventOnOpen={editEventOnOpen}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      {addEventIsOpen && (
        <AddEventModal
          isOpen={addEventIsOpen}
          onClose={addEventOnClose}
          mutateEvents={mutateEvents}
        />
      )}
      {editEventIsOpen && editEvent && (
        <EditEventModal
          editEvent={editEvent}
          setEditEvent={setEditEvent}
          isOpen={editEventIsOpen}
          onClose={editEventOnClose}
          mutateEvents={mutateEvents}
        />
      )}
    </>
  );
}
