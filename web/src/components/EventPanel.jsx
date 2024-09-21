import { Grid } from '@chakra-ui/react';

import Error from './Error';
import EventCard from './EventCard';
import Loading from './Loading';

import useSWR from 'swr';

export default function EventPanel({ day, setEditEvent, editEventOnOpen }) {
  const { data, error } = useSWR(`events/pages/${day}`);

  let eventList = null;
  if (error) {
    eventList = <Error />;
  } else if (!data) {
    eventList = <Loading />;
  } else {
    eventList = (
      <Grid
        gridTemplateColumns={{
          base: '100%',
          md: '49% 49%',
          xl: '32% 32% 32%',
        }}
        columnGap={{
          md: '2%',
          xl: '1%',
        }}
        rowGap={4}
        w='100%'
      >
        {data.data.map((event, ind) => (
          <EventCard
            key={ind}
            event={event}
            setEditEvent={setEditEvent}
            editEventOnOpen={editEventOnOpen}
          />
        ))}
      </Grid>
    );
  }

  return eventList;
}
