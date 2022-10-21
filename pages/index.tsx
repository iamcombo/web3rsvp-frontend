import { gql, useQuery } from '@apollo/client';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import EventCard from '../components/EventCard';

const UPCOMING_EVENTS = gql`
  query Events($currentTimestamp: String) {
    events(where: { eventTimestamp_gt: $currentTimestamp }) {
      id
      name
      eventTimestamp
      imageURL
    }
  }
`;

const Home: NextPage = () => {
  const [currentTimestamp, setEventTimestamp] = useState(
    new Date().getTime().toString()
  );
  const { loading, error, data } = useQuery(UPCOMING_EVENTS, {
    variables: { currentTimestamp },
  });

  console.log(data, currentTimestamp);
  

  return (
    <div>
      <ul>
        {data &&
          data.events.map((event: any) => (
            <li key={event.id}>
              <EventCard
                id={event.id}
                name={event.name}
                eventTimestamp={event.eventTimestamp}
                imageURL={event.imageURL}
              />
            </li>
          )
        )}
      </ul>
    </div>
  )
}

export default Home
