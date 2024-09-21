import {
  Grid,
  Input,
  VStack,
  HStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { MdSearch, MdAdd, MdAssignment } from 'react-icons/md';
import useSWR, { mutate } from 'swr';
import AddUserModal from '../components/AddUserModal';
import UserReport from '../components/UserReport';
import Error from '../components/Error';
import Loading from '../components/Loading';

import PageControls from '../components/PageControls';
import UserCard from '../components/UserCard';
import UserModal from '../components/UserModal';
import createGetUri from '../utils/createGetUri';

function getFetchUri(searchText, page) {
  const params = [['page', page]];
  if (searchText) params.push(['search', searchText]);
  return createGetUri('users', params);
}

export default function Users() {
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const {
    isOpen: userIsOpen,
    onOpen: userOnOpen,
    onClose: userOnClose,
  } = useDisclosure();
  const [modalRoll, setModalRoll] = useState(null);
  function openUserModal(rollNo) {
    setModalRoll(rollNo);
    userOnOpen();
  }

  const searchRef = useRef();
  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();

  const {
    isOpen: reportIsOpen,
    onOpen: reportOnOpen,
    onClose: reportOnClose,
  } = useDisclosure();

  const { data, error } = useSWR(getFetchUri(search, page));
  let usersList = null;
  if (error) {
    usersList = <Error />;
  } else if (!data) {
    usersList = <Loading />;
  } else if (data.error) {
    usersList = <Error error={data.error} />;
  } else {
    usersList = (
      <>
        <Grid
          gridTemplateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          gap={4}
          w='100%'
        >
          {data.data.users.map(user => (
            <UserCard
              key={user.rollNo}
              user={user}
              openUserModal={openUserModal}
            />
          ))}
        </Grid>
        <PageControls
          page={page}
          changePage={newPage => setPage(newPage)}
          maxPage={data.data.maxPage}
        />
        {modalRoll && (
          <UserModal
            rollNo={modalRoll}
            setRollNo={setModalRoll}
            isOpen={userIsOpen}
            onClose={userOnClose}
            mutate={() => mutate(getFetchUri(searchText, page))}
          />
        )}
      </>
    );
  }

  function setNewSearch(newSearchText) {
    setSearch(newSearchText);
    setPage(1);
  }
  useEffect(() => searchRef.current?.focus(), []);

  return (
    <>
      <VStack spacing={6}>
        <HStack w='100%'>
          <Input
            ref={searchRef}
            type='text'
            placeholder='Roll Number'
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
            onClick={addOnOpen}
          />
          <IconButton
            colorScheme='green'
            variant='outline'
            icon={<MdAssignment fontSize='1.25rem' />}
            onClick={reportOnOpen}
          />
          <AddUserModal
            isOpen={addIsOpen}
            onClose={addOnClose}
            finalFocusRef={searchRef}
            mutate={() => mutate(getFetchUri(searchText, page))}
          />
          <UserReport
            isOpen={reportIsOpen}
            onClose={reportOnClose}
            finalFocusRef={searchRef}
            mutate={() => mutate(getFetchUri(searchText, page))}
          />
        </HStack>
        {usersList}
      </VStack>
    </>
  );
}
