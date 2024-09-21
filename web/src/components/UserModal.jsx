import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Box,
  Grid,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Fragment, useRef, useState } from 'react';
import { MdCheckCircle, MdCancel, MdRemoveCircle } from 'react-icons/md';
import useSWR, { mutate } from 'swr';
import useModeColors from '../hooks/useModeColors';
import createToastOptions from '../utils/createToastOptions';

import easyFetch from '../utils/easyFetch';

export default function UserModal({
  isOpen,
  onClose,
  rollNo,
  setRollNo,
  mutate,
}) {
  const { data, error } = useSWR(`users/${rollNo}`);

  let content = null;
  if (error || data?.error) {
    content = <Heading>Something Went Wrong</Heading>;
  } else if (!data) {
    content = <Spinner />;
  } else if (data?.data) {
    content = <ModalDisplay user={data?.data} />;
  }

  const {
    isOpen: paidConfIsOpen,
    onOpen: paidConfOnOpen,
    onClose: paidConfOnClose,
  } = useDisclosure();
  const [amount, setAmount] = useState('');
  const amountRef = useRef();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={amountRef}
        size='xl'
        isCentered
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>{rollNo}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{content}</ModalBody>
          <ModalFooter>
            <InputGroup w='150px' maxW='90%'>
              <InputLeftElement children='₹' />
              <Input
                ref={amountRef}
                variant='filled'
                type='number'
                value={amount}
                onChange={e => setAmount(e.target.value)}
                textAlign='right'
                style={{
                  borderRadius: '0.375rem 0 0 0.375rem',
                }}
              />
            </InputGroup>
            <Button
              colorScheme='green'
              onClick={() => {
                if (amount !== 0) paidConfOnOpen();
              }}
              borderLeftRadius={0}
            >
              Paid
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <PaidConfirmation
        rollNo={rollNo}
        setRollNo={setRollNo}
        amount={amount}
        isOpen={paidConfIsOpen}
        onClose={paidConfOnClose}
        userModalOnClose={onClose}
        mutate={mutate}
      />
    </>
  );
}

const tableFields = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['phoneNumber', 'Phone'],
  ['department', 'Department'],
  ['moneyOwed', 'Money Owed'],
  ['criteria', 'Criteria'],
];

function ModalDisplay({ user }) {
  const { red, green } = useModeColors();
  const [eventToDel, setEventToDel] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const table = tableFields.map(([key, val]) => [val, user[key]]);

  function tableRow(key, val) {
    if (key === 'Money Owed') {
      return (
        <Fragment key={key}>
          <Text fontWeight='bold'>{key}</Text>
          <Text fontWeight='bold' color={val < 0 ? red : green}>
            ₹ {val}
          </Text>
        </Fragment>
      );
    } else if (key === 'Criteria') {
      return (
        <Fragment key={key}>
          <Text fontWeight='bold'>{key}</Text>
          <HStack spacing={6}>
            {Object.entries(val).map(([crit, state]) => (
              <HStack
                alignItems='center'
                key={crit}
                cursor='pointer'
                onDoubleClick={async () => {
                  const { error } = await easyFetch(
                    'users/criteria',
                    { rollNo: user.rollNo, criteria: crit },
                    'PUT'
                  );
                  if (!error) {
                    await mutate(`users/${user.rollNo}`);
                  }
                }}
              >
                <Text color={state ? green : red}>
                  {state ? (
                    <MdCheckCircle size='1.25rem' />
                  ) : (
                    <MdCancel size='1.25rem' />
                  )}
                </Text>
                <Text>{crit}</Text>
              </HStack>
            ))}
          </HStack>
        </Fragment>
      );
    } else {
      return (
        <Fragment key={key}>
          <Text fontWeight='bold'>{key}</Text>
          <Text>{val}</Text>
        </Fragment>
      );
    }
  }

  return (
    <>
      <Grid
        alignItems='center'
        gridTemplateColumns='max-content auto'
        gap='1rem 2rem'
      >
        {table.map(([key, val]) => tableRow(key, val))}
      </Grid>
      <Text fontWeight='bold' mt={4} mb={2}>
        Events
      </Text>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Timing</Th>
            <Th isNumeric>Cost</Th>
          </Tr>
        </Thead>
        <Tbody>
          {user.events.map(({ eventCode, start, end, entryFee }, ind) => (
            <Tr key={ind}>
              <Td>
                <HStack>
                  <Box
                    cursor='pointer'
                    _hover={{
                      color: red,
                    }}
                    onClick={() => {
                      setEventToDel(eventCode);
                      onOpen();
                    }}
                  >
                    <MdRemoveCircle />
                  </Box>
                  <Box>{eventCode}</Box>
                </HStack>
              </Td>
              <Td>{start + ' ' + end}</Td>
              <Td isNumeric>{'₹ ' + entryFee}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {eventToDel && (
        <DeleteEventConfirmation
          rollNo={user.rollNo}
          eventCode={eventToDel}
          setEventCode={setEventToDel}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}

function DeleteEventConfirmation({
  rollNo,
  eventCode,
  setEventCode,
  isOpen,
  onClose,
}) {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Delete Event
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to remove {eventCode} from {rollNo}?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='red'
              onClick={async () => {
                const { error } = await easyFetch(
                  'users/event',
                  { rollNo, eventCode },
                  'DELETE'
                );
                if (!error) {
                  setEventCode(null);
                  onClose();
                }
                await mutate(`users/${rollNo}`);
              }}
              ml={2}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

async function makePayment(rollNo, amount) {
  return await easyFetch('payments', { rollNo, amount });
}
function PaidConfirmation({
  rollNo,
  setRollNo,
  amount,
  isOpen,
  onClose,
  userModalOnClose,
  mutate,
}) {
  const cancelRef = useRef();

  const successToast = useToast(
    createToastOptions('Payment successfully regsitered')
  );
  const failedToast = useToast(
    createToastOptions('Payment registration failed', 'error')
  );

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='xl' fontWeight='bold'>
            ₹ {amount} by {rollNo}
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to confirm payment of {amount} by {rollNo}?
            This action cannot be undone!
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='green'
              onClick={async () => {
                const { data } = await makePayment(rollNo, amount);
                if (data) successToast();
                else failedToast();
                await mutate(`users/${rollNo}`);
                onClose();
                userModalOnClose();
                setRollNo(null);
              }}
              ml={3}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
