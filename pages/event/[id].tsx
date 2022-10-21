import { gql } from "@apollo/client";
import client from "../../utils/apollo-client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import formatTimestamp from "../../utils/formatTimestamp";
import { Title } from "@mantine/core";
import Image from "next/image";

const EventDetail = ({event}: any) => {
  console.log('====================================');
  console.log(event);
  console.log('====================================');

  return (
    <div>
      <Head>
        <title> {event.name} | web3rsvp</title>
        <meta name="description" content={event.name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Title order={2}>{formatTimestamp(event.eventTimestamp)}</Title>
        <div>
          {event.imageURL && (
            <Image src={event.imageURL} alt="event image" layout="fill" />
          )}
        </div>
        <p>{event.description}</p>
        <span>
          Hosted by{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}address/${event.eventOwner}`}
            target="_blank"
            rel="noreferrer"
          >
            {event.eventOwner}
          </a>
        </span>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async(context) => {
  const id = context.params?.id;

  const { data } = await client.query({
    query: gql`
      query Event($id: String!) {
        event(id: $id) {
          id
          eventID
          name
          description
          link
          eventOwner
          eventTimestamp
          maxCapacity
          deposit
          totalRSVPs
          totalConfirmedAttendees
          imageURL
          rsvps {
            id
            attendee {
              id
            }
          }
        }
      }
    `,
    variables: {
      id: id,
    },
  });

  return {
    props: {
      event: data.event,
    },
  };
}

export default EventDetail;