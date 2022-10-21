import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useAccount } from "wagmi";
import EventCard from "../../components/EventCard";

const MY_PAST_RSVPS = gql`
  query Account($id: String) {
    account(id: $id) {
      id
      rsvps {
        event {
          id
          name
          eventTimestamp
          imageURL
        }
      }
    }
  }
`;

const Past = () => {
  const { address } = useAccount();
  const id = address ? address.toLowerCase() : "";
  const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime());
  const { loading, error, data } = useQuery(MY_PAST_RSVPS, {
    variables: { id },
  });

  return (
    <div>
      {data && !data.account && <p>No past RSVPs found</p>}
      {data && data.account && (
        <ul>
          {data.account.rsvps.map(function (rsvp: any) {
            if (rsvp.event.eventTimestamp < currentTimestamp) {
              return (
                <li key={rsvp.event.id}>
                  <EventCard
                    id={rsvp.event.id}
                    name={rsvp.event.name}
                    eventTimestamp={rsvp.event.eventTimestamp}
                    imageURL={rsvp.event.imageURL}
                  />
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}

export default Past;