import { Input, IconButton, Grid, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { MdSearch, MdAssignment } from 'react-icons/md';
import useSWR from 'swr';
import Error from '../components/Error';
import PaymentCard from '../components/PaymentCard';
import PageControls from '../components/PageControls';
import createGetUri from '../utils/createGetUri';
import { createHandleChange } from '../utils/createHandleChange';
import Loading from '../components/Loading';
import { API_URI } from '../utils/constants';
import download from 'downloadjs';

function paymentsParams(page, adminUsername, userRollNo) {
  const params = [['page', page]];
  if (adminUsername) params.push(['admin', adminUsername]);
  if (userRollNo) params.push(['user', userRollNo]);
  return params;
}

export default function Payments() {
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState({
    adminUsername: '',
    userRollNo: '',
  });
  const [searchFields, setSearchFields] = useState({
    adminUsername: '',
    userRollNo: '',
  });
  const handleChange = createHandleChange(setFields);

  const { data, error } = useSWR(
    createGetUri(
      'payments',
      paymentsParams(page, searchFields.adminUsername, searchFields.userRollNo)
    )
  );

  let paymentsList = null;
  if (error) {
    paymentsList = <Error />;
  } else if (!data) {
    paymentsList = <Loading />;
  } else {
    paymentsList = (
      <>
        <Grid
          w='100%'
          gap={4}
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
        >
          {data.data.payments.map((payment, ind) => (
            <PaymentCard key={ind} payment={payment} />
          ))}
        </Grid>
        <PageControls
          page={page}
          changePage={newPage => setPage(newPage)}
          maxPage={data.data.maxPage}
        />
      </>
    );
  }

  function searchPayments() {
    setSearchFields(fields);
    setPage(1);
  }

  return (
    <VStack spacing={6} w='100%'>
      <Grid
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr auto auto' }}
        gap={2}
        w='100%'
      >
        <Input
          name='userRollNo'
          placeholder='User Roll No'
          value={fields.userRollNo}
          onChange={handleChange}
          onKeyDown={async e => {
            if (e.key === 'Enter') searchPayments();
          }}
        />
        <Input
          name='adminUsername'
          placeholder='Admin Username'
          value={fields.adminUsername}
          onChange={handleChange}
          onKeyDown={async e => {
            if (e.key === 'Enter') searchPayments();
          }}
        />
        <IconButton
          aria-label='search'
          icon={<MdSearch fontSize='1.25rem' />}
          colorScheme='green'
          onClick={searchPayments}
        />
        <IconButton
          aria-label='report'
          icon={<MdAssignment fontSize='1.25rem' />}
          colorScheme='green'
          variant='outline'
          onClick={async () => {
            try {
              const uri = `${API_URI}payments/report`;
              const res = await fetch(uri, { credentials: 'include' });
              const blob = await res.blob();
              download(blob, 'payments.csv');
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </Grid>
      {paymentsList}
    </VStack>
  );
}
