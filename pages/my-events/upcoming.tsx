import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useAccount } from "wagmi";
import EventCard from "../../components/EventCard";

const MY_UPCOMING_EVENTS = gql`
  query Events($eventOwner: String, $currentTimestamp: String) {
    events(
      where: { eventOwner: $eventOwner, eventTimestamp_gt: $currentTimestamp }
    ) {
      id
      eventID
      name
      description
      eventTimestamp
      maxCapacity
      totalRSVPs
      imageURL
    }
  }
`;
const UpcomingEvent = () => {
  const { address } = useAccount();
  const eventOwner = address ? address.toLowerCase() : "";
  const [currentTimestamp, setEventTimestamp] = useState(
    new Date().getTime().toString()
  );
  const { loading, error, data } = useQuery(MY_UPCOMING_EVENTS, {
    variables: { eventOwner, currentTimestamp },
  });
  
  return (
    <div>
      {data && data.events.length == 0 && <p>No upcoming events found</p>}
      {data && data.events.length > 0 && (
        <ul>
          {data.events.map((event: any) => (
            <li key={event.id}>
              <EventCard
                id={event.id}
                name={event.name}
                eventTimestamp={event.eventTimestamp}
                imageURL={event.imageURL}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UpcomingEvent;