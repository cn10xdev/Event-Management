import { useState, useEffect, useRef } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Grid,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { MdAssignment, MdEdit } from 'react-icons/md';

import { createHandleChange } from '../utils/createHandleChange';
import easyFetch from '../utils/easyFetch';
import useSWR from 'swr';
import Error from './Error';
import Loading from './Loading';
import createToastOptions from '../utils/createToastOptions';
import download from 'downloadjs';
import { API_URI } from '../utils/constants';

async function makeEditEventRequest(eventCode, fields) {
  return await easyFetch(`events/${eventCode}`, fields, 'PUT');
}

export default function EditEventModal({
  editEvent,
  setEditEvent,
  isOpen,
  onClose,
  mutateEvents,
}) {
  const firstRef = useRef();

  const [fields, setFields] = useState({
    eventCode: '',
    day: 1,
    start: '',
    end: '',
    title: '',
    description: '',
    image: '',
    maxSeats: 1,
    category: 'C',
    isSeminar: false,
    teamSize: 1,
    isTeamSizeStrict: true,
    entryFee: 0,
    prizeMoney: '',
  });
  const [errors, setErrors] = useState({
    eventCode: null,
    day: null,
    start: null,
    end: null,
    title: null,
    description: null,
    image: null,
    maxSeats: null,
    category: null,
    isSeminar: null,
    teamSize: null,
    isTeamSizeStrict: null,
    entryFee: null,
    prizeMoney: null,
  });

  const handleChange = createHandleChange(setFields, setErrors);
  const successToast = useToast(
    createToastOptions('Event successfully editted'),
  );
  const failedToast = useToast(
    createToastOptions('Editing event failed', 'error'),
  );

  const { data, error } = useSWR(`events/${editEvent}`);
  let content = null;
  if (error || data?.error) {
    content = <Error />;
  } else if (!data) {
    content = <Loading />;
  } else {
    content = (
      <>
        <ModalBody>
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            <FormControl isInvalid={errors.eventCode}>
              <FormLabel>event code</FormLabel>
              <Input
                isDisabled
                name="eventCode"
                placeholder="a unique code"
                value={fields.eventCode}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isInvalid={errors.day}>
              <FormLabel>day</FormLabel>
              <Select name="day" value={fields.day} onChange={handleChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Select>
              <FormErrorMessage>{errors.day}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.category}>
              <FormLabel>category</FormLabel>
              <Select
                name="category"
                value={fields.category}
                onChange={handleChange}
              >
                <option value="C">Cultural</option>
                <option value="T">Technical</option>
                <option value="F">Fun</option>
              </Select>
              <FormErrorMessage>{errors.category}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.title}
              gridColumnStart={1}
              gridColumnEnd={4}
            >
              <FormLabel>title</FormLabel>
              <Input
                ref={firstRef}
                name="title"
                placeholder="an apt title"
                value={fields.title}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.description}
              gridColumnStart={1}
              gridColumnEnd={4}
            >
              <FormLabel>description</FormLabel>
              <Textarea
                name="description"
                placeholder="an extensive description for the event"
                value={fields.description}
                onChange={handleChange}
                resize="none"
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.image}
              gridColumnStart={1}
              gridColumnEnd={4}
            >
              <FormLabel>image</FormLabel>
              <Input
                name="image"
                placeholder="a link to the url"
                value={fields.image}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.image}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.start}>
              <FormLabel>start time</FormLabel>
              <Input
                name="start"
                placeholder="d-HH:MM"
                value={fields.start}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.start}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.end}>
              <FormLabel>end time</FormLabel>
              <Input
                name="end"
                placeholder="d-HH:MM"
                value={fields.end}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.end}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.maxSeats}>
              <FormLabel>max seats</FormLabel>
              <NumberInput
                name="maxSeats"
                value={fields.maxSeats}
                onChange={(num) => setFields({ ...fields, maxSeats: num })}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{errors.maxSeats}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.teamSize}>
              <FormLabel>team size</FormLabel>
              <NumberInput
                name="teamSize"
                value={fields.teamSize}
                onChange={(num) => setFields({ ...fields, teamSize: num })}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{errors.teamSize}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.isTeamSizeStrict}>
              <FormLabel>fixed size</FormLabel>
              <Switch
                ml={1}
                mt={1}
                colorScheme="green"
                name="isTeamSizeStrict"
                isChecked={fields.isTeamSizeStrict}
                onChange={(e) =>
                  setFields({ ...fields, isTeamSizeStrict: e.target.checked })
                }
                size="lg"
              />
              <FormErrorMessage>{errors.isTeamSizeStrict}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.isSeminar}>
              <FormLabel>is seminar</FormLabel>
              <Switch
                ml={1}
                mt={1}
                colorScheme="green"
                name="isSeminar"
                isChecked={fields.isSeminar}
                onChange={(e) =>
                  setFields({ ...fields, isSeminar: e.target.checked })
                }
                size="lg"
              />
              <FormErrorMessage>{errors.isSeminar}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.entryFee}>
              <FormLabel>entry fee</FormLabel>
              <NumberInput
                name="entryFee"
                value={fields.entryFee}
                onChange={(num) => setFields({ ...fields, entryFee: num })}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{errors.entryFee}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.prizeMoney}
              gridColumnStart={2}
              gridColumnEnd={4}
            >
              <FormLabel>prize money</FormLabel>
              <Input
                name="prize"
                placeholder="[first], [second], [third]"
                value={fields.prizeMoney}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.prizeMoney}</FormErrorMessage>
            </FormControl>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Flex alignItems="center" justifyContent="space-between" w="100%">
            <Button
              variant="outline"
              leftIcon={<MdAssignment fontSize="1rem" />}
              colorScheme="green"
              onClick={async () => {
                try {
                  const uri = `${API_URI}events/report/${editEvent}`;
                  const res = await fetch(uri, { credentials: 'include' });
                  const blob = await res.blob();
                  download(blob, `event_${editEvent}.csv`);
                } catch (err) {
                  console.error(err);
                }
                onClose();
              }}
            >
              Report
            </Button>
            <Button
              rightIcon={<MdEdit fontSize="1rem" />}
              colorScheme="green"
              onClick={async () => {
                const { error } = await makeEditEventRequest(editEvent, fields);
                if (error) {
                  setErrors((e) => ({ ...e, ...error }));
                  failedToast();
                } else {
                  await mutateEvents();
                  onClose();
                  setEditEvent(null);
                  successToast();
                }
              }}
            >
              Edit
            </Button>
          </Flex>
        </ModalFooter>
      </>
    );
  }

  useEffect(() => {
    if (data?.data) setFields(data.data);
  }, [data]);

  return (
    <Modal
      initialFocusRef={firstRef}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Edit Event</Heading>
        </ModalHeader>
        <ModalCloseButton />
        {content}
      </ModalContent>
    </Modal>
  );
}
