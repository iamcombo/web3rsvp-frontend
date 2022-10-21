import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import EventCard from "../../../components/EventCard";

const MY_PAST_EVENTS = gql`
  query Events($eventOwner: String, $currentTimestamp: String) {
    events(
      where: { eventOwner: $eventOwner, eventTimestamp_lt: $currentTimestamp }
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

const PastEvent = () => {
  const { address } = useAccount();
  const eventOwner = address ? address.toLowerCase() : "";
  const [currentTimestamp, setEventTimestamp] = useState(
    new Date().getTime().toString()
  );
  const { loading, error, data } = useQuery(MY_PAST_EVENTS, {
    variables: { eventOwner, currentTimestamp },
  });

  return (
    <div>
      {data && data.events.length == 0 && <p>No past events found</p>}
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
              <Link href={`/my-events/past/${event.id}`}>
                <a className="text-indigo-800 text-sm truncate hover:underline">
                  Confirm attendees
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PastEvent;