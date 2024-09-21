import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Flex,
  Heading,
  Stack,
  Box,
  useColorMode,
} from '@chakra-ui/react';
import { MdClose, MdMenu } from 'react-icons/md';
import easyFetch from '../utils/easyFetch';
import useAuth from '../hooks/useAuth';

function NavButton({ children, link, func }) {
  const history = useHistory();
  const { pathname } = useLocation();
  const active = link && pathname.includes(link);

  return (
    <Button
      variant='ghost'
      fontSize='lg'
      p={3}
      colorScheme={`${active ? 'green' : 'white'}`}
      onClick={async () => {
        if (func) await func();
        if (link) history.push(link);
      }}
    >
      {children}
    </Button>
  );
}

export default function Navbar() {
  const history = useHistory();
  const { loggedOut, userMutate } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { toggleColorMode } = useColorMode();

  const logout = async () => {
    const response = await easyFetch('auth/logout');
    if (response) {
      await userMutate(null, false);
      history.push('/login');
    } else {
      console.log('logout failed');
    }
  };

  return (
    <Flex
      as='nav'
      w='100%'
      wrap='wrap'
      alignItems='center'
      justifyContent='space-between'
      py={6}
      px={{ base: 8, lg: '15%' }}
    >
      <Heading
        as='button'
        fontSize='4xl'
        colorScheme='green'
        onDoubleClick={toggleColorMode}
      >
        η_admin
      </Heading>
      <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
        {isOpen ? <MdClose size={'2rem'} /> : <MdMenu size={'2rem'} />}
      </Box>
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
        flexBasis={{ base: '100%', md: 'auto' }}
        pt={{ base: 4, md: 0 }}
      >
        <Stack
          spacing={2}
          direction={{ base: 'column', md: 'row' }}
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
        >
          {loggedOut ? (
            <NavButton link='/login'>login</NavButton>
          ) : (
            <>
              <NavButton link='/users'>users</NavButton>
              <NavButton link='/events'>events</NavButton>
              <NavButton link='/payments'>payments</NavButton>
              <NavButton func={logout}>log out</NavButton>
            </>
          )}
        </Stack>
      </Box>
    </Flex>
  );
}
