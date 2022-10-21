import { gql } from "@apollo/client";
import client from "../../utils/apollo-client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import formatTimestamp from "../../utils/formatTimestamp";
import { Title } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import connectContract from "../../utils/connectContract";

const EventDetail = ({event}: any) => {
  console.log('====================================');
  console.log(event);
  console.log('====================================');
  const { address } = useAccount();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime());

  const checkIfAlreadyRSVPed = () => {
    if (address) {
      for (let i = 0; i < event.rsvps.length; i++) {
        const thisAccount = address.toLowerCase();
        if (event.rsvps[i].attendee.id.toLowerCase() == thisAccount) {
          return true;
        }
      }
    }
    return false;
  }

  const newRSVP = async () => {
    try {
      const rsvpContract = connectContract();
      if (rsvpContract) {
        const txn = await rsvpContract.createNewRSVP(event.id, {
          value: event.deposit,
          gasLimit: 300000,
        });
        setLoading(true);
        console.log("Minting...", txn.hash);
  
        await txn.wait();
        console.log("Minted -- ", txn.hash);
        setSuccess(true);
        setLoading(false);
        setMessage("Your RSVP has been created successfully.");
      } else {
        console.log("Error getting contract.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Error!");
      setLoading(false);
      console.log(error);
    }
  };

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
      <div>
        {event.eventTimestamp > currentTimestamp ? (
          address ? (
            checkIfAlreadyRSVPed() ? (
              <>
                <span>
                  You have RSVPed! 🙌
                </span>
                <div>
                  {/* <LinkIcon className="w-6 mr-2 text-indigo-800" /> */}
                  <a
                    href={event.link}
                  >
                    {event.link}
                  </a>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={newRSVP}
              >
                RSVP for {ethers.utils.formatEther(event.deposit)} MATIC
              </button>
            )
          ) : (
            <div />
          )
        ) : (
          <span>
            Event has ended
          </span>
        )}
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