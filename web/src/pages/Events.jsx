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
  Input,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
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
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');

  const searchRef = useRef();
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

  function setNewSearch(newSearchText) {
    setSearch(newSearchText);
  }

  useEffect(() => searchRef.current?.focus(), []);

  return (
    <>
      <VStack spacing={6}>
        <HStack w='100%'>
          <Input
            ref={searchRef}
            type='text'
            placeholder='Search Events'
            colorScheme='green'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={async e => {
              if (e.key === 'Enter') setNewSearch(searchText);
            }}
          />
          <IconButton
            colorScheme='green'
            icon={<MdSearch fontSize='1.25rem' />}
            onClick={() => setNewSearch(searchText)}
          />
          <IconButton
            colorScheme='green'
            variant='outline'
            icon={<MdAdd fontSize='1.25rem' />}
            onClick={addEventOnOpen}
          />
        </HStack>
        <Tabs
          colorScheme='green'
          variant='solid-rounded'
          isFitted
          isLazy
          isManual
        >
          <TabList>
            <Tab minW="310px">{tabTitle?.one}</Tab>
            <Tab minW="310px">{tabTitle?.two}</Tab>
            <Tab minW="310px">{tabTitle?.three}</Tab>
          </TabList>
          <TabPanels>
            {days.map(day => (
              <TabPanel key={day} px={0} py={6}>
                <EventPanel
                  day={day}
                  setEditEvent={setEditEvent}
                  editEventOnOpen={editEventOnOpen}
                  searchQuery={search}
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
      </VStack>
    </>
  );
}
