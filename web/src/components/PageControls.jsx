import { Button, HStack, IconButton } from '@chakra-ui/react';
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdFirstPage,
  MdLastPage,
} from 'react-icons/md';

import getInclusiveRange from '../utils/getInclusiveRange';

function getPageRange(page, max) {
  let low = Math.max(1, page - 5);
  let high = Math.min(max, low + 10);
  low = Math.max(1, high - 10);

  return [low, high];
}

export default function PageControls({ page, changePage, maxPage }) {
  return (
    <HStack wrap='wrap'>
      <IconButton
        aria-label='go to first page'
        icon={<MdFirstPage />}
        onClick={() => changePage(1)}
        isDisabled={page === 1}
      />
      <IconButton
        aria-label='go to previous page'
        icon={<MdNavigateBefore />}
        onClick={() => changePage(Math.max(1, page - 1))}
        isDisabled={page === 1}
      />
      {getInclusiveRange(...getPageRange(page, maxPage)).map(num => (
        <Button
          key={num}
          colorScheme={`${page === num ? 'green' : 'gray'}`}
          variant={`${page === num ? 'solid' : 'outline'}`}
          onClick={() => changePage(num)}
          width='2.5rem'
        >
          {num}
        </Button>
      ))}
      <IconButton
        aria-label='go to next page'
        icon={<MdNavigateNext />}
        onClick={() => changePage(Math.min(page + 1, maxPage))}
        isDisabled={page === maxPage}
      />
      <IconButton
        aria-label='go to last page'
        icon={<MdLastPage />}
        onClick={() => changePage(maxPage)}
        isDisabled={page === maxPage}
      />
    </HStack>
  );
}
