import { Grid } from '@chakra-ui/react';
import Error from './Error';
import EventCard from './EventCard';
import Loading from './Loading';
import useSWR from 'swr';

export default function EventPanel({ day, setEditEvent, editEventOnOpen, searchQuery }) {
  const { data, error } = useSWR(`events/pages/${day}`);

  let eventList = null;
  if (error) {
    eventList = <Error />;
  } else if (!data) {
    eventList = <Loading />;
  } else {

    const filteredEvents = data.data.filter(event =>
      !searchQuery || (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    eventList = (
      <Grid
        gridTemplateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        gap={4}
        w='100%'
        minW='400px'
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, ind) => (
            <EventCard
              key={ind}
              event={event}
              setEditEvent={setEditEvent}
              editEventOnOpen={editEventOnOpen}
            />
          ))
        ) : (
          <p>No events found</p>
        )}
      </Grid>
    );
  }

  return eventList;
}
