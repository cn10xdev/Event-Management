import {
  Button,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import { createHandleChange } from '../utils/createHandleChange';
import { MdFileDownload } from 'react-icons/md';
import download from 'downloadjs';
import { API_URI } from '../utils/constants';

export default function UserReport({ isOpen, onClose, finalFocusRef }) {
  const [fields, setFields] = useState({
    semester: '1',
    department: 'COMPS',
  });
  const [errors, setErrors] = useState({
    semester: null,
    department: null,
  });

  const handleChange = createHandleChange(setFields, setErrors);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size='xl'
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Generate Report</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl isInvalid={errors.semester}>
              <FormLabel>semester</FormLabel>
              <Select
                name='semester'
                value={fields.semester}
                onChange={handleChange}
              >
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='6'>6</option>
                <option value='7'>7</option>
                <option value='8'>8</option>
              </Select>
              <FormErrorMessage>{errors.day}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.department}>
              <FormLabel>department</FormLabel>
              <Select
                name='department'
                value={fields.department}
                onChange={handleChange}
              >
                <option value='COMPS'>Computer Science</option>
                <option value='ELEC'>Electrical Engineering</option>
                <option value='EXTC'>
                  Electronics & Telecommunication Enginnering
                </option>
                <option value='MECH'>Mechanical Engineering</option>
                <option value='IT'>Information Technology</option>
                <option value='OTHER'>Non-FCRIT</option>
              </Select>
              <FormErrorMessage>{errors.department}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            rightIcon={<MdFileDownload />}
            colorScheme='green'
            onClick={async () => {
              try {
                const uri = `${API_URI}users/report?department=${fields.department}&semester=${fields.semester}`;
                const res = await fetch(uri, { credentials: 'include' });
                const blob = await res.blob();
                download(blob, `${fields.department}_${fields.semester}.csv`);
              } catch (err) {
                console.error(err);
              }
              onClose();
            }}
          >
            Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
