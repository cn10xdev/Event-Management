import { Fragment } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Navbar />
      <Box w='100%' px={{ base: 8, lg: '15%' }} py={4}>
        {children}
      </Box>
    </Fragment>
  );
}
