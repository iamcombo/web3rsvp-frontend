import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useAccount } from "wagmi";
import EventCard from "../../components/EventCard";

const MY_UPCOMING_RSVPS = gql`
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

const Upcoming = () => {
  const { address } = useAccount();
  const id = address ? address.toLowerCase() : "";
  const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime());
  const { loading, error, data } = useQuery(MY_UPCOMING_RSVPS, {
    variables: { id },
  });
  console.log('====================================');
  console.log(data);
  console.log('====================================');

  if(loading) return <p>Loading...</p>

  return (
    <div>
      {data && !data.account && <p>No upcoming RSVPs found</p>}
      {data && data.account && (
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
        >
            {data.account.rsvps.map(function (rsvp: any) {
              if (rsvp.event.eventTimestamp > currentTimestamp) {
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

export default Upcoming;