import { ethers } from "ethers";
import { useAccount } from "wagmi";
import React, { useState } from "react";
import { DatePicker, TimeInput } from "@mantine/dates";
import { IconCheck, IconClock, IconX } from "@tabler/icons";
import { Button, Container, Divider, Group, Input, Notification, SimpleGrid, Space, Text, Textarea, Title } from "@mantine/core";
import { dateWithHyphens, timeWithColon } from "../utils";
import getRandomImage from "../utils/getRandomImage";
import connectContract from "../utils/connectContract";

const CreateEvent = () => {
  // ====>>STATE<<====
  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventTime, setEventTime] = useState<any>();
  const [maxCapacity, setMaxCapacity] = useState("");
  const [refund, setRefund] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventID, setEventID] = useState(null);
  // ====>>END STATE<<====

  // ====>>HOOK<<====
  const { address } = useAccount();
  // ====>>END HOOK<<====

// ====>>FUNCTION<<====
  const handleSubmit = async(e: any) => {
    e.preventDefault();

    const body = {
      name: eventName,
      description: eventDescription,
      link: eventLink,
      image: getRandomImage(),
    };

    try {
      const response = await fetch("/api/store-event-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        alert("Oops! Something went wrong. Please refresh and try again.");
      } else {
        console.log("Form successfully submitted!");
        let responseJSON = await response.json();
        await createEvent(responseJSON.cid);
      }
      // check response, if success is false, dont take them to success page
    } catch (error) {
      alert(
        `Oops! Something went wrong. Please refresh and try again. Error ${error}`
      );
    }
  }

  const createEvent = async(cid: string) => {
    try {
      const _dateWithHyphens = dateWithHyphens(eventDate);
      const _timeWithColon = timeWithColon(eventTime);

      const rsvpContract = connectContract();
      if (rsvpContract) {
        let deposit = ethers.utils.parseEther(refund);
        let eventDateAndTime = new Date(`${_dateWithHyphens} ${_timeWithColon}`);
        let eventTimestamp = eventDateAndTime.getTime();
        let eventDataCID = cid;
  
        const txn = await rsvpContract.createNewEvent(
          eventTimestamp,
          deposit,
          maxCapacity,
          eventDataCID,
          { gasLimit: 900000 }
        );

        setLoading(true);
        console.log("Minting...", txn.hash);
        let wait = await txn.wait();
        console.log("Minted -- ", txn.hash);

        setEventID(wait.events[0].args[0]);

        setSuccess(true);
        setLoading(false);
        setMessage("Your event has been created successfully.");
      } else {
        console.log("Error getting contract.");
      }
    } catch (error: any) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      setSuccess(false);
      setMessage(`There was an error creating your event: ${error.message}`);
      setLoading(false);
    }
  }
// ====>>END FUNCTION<<====

  return (
    <div>
      <Group position="right">
        { loading && 
          <Notification
            loading
            title="Uploading data to the server"
            disallowClose
            sx={{position: 'absolute'}}
          >
            Please wait until data is uploaded
          </Notification>
        }
        { success &&
          <Notification icon={<IconCheck size={18} />} color="teal" title="Success">
            {message}
          </Notification>
        }
        { !success && message &&
          <Notification icon={<IconX size={18} />} color="red">
            {message}
          </Notification>
        }
      </Group>

      <Container size={'sm'}>
        <Title order={1}>Create your virtual event</Title>
        <Space h={"xl"} />
        <SimpleGrid cols={2}>
          <Title order={4}>Event name</Title>
          <Input 
            value={eventName} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value)} 
            placeholder="Enter event name" 
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Group>
            <Title order={4}>Date & Time</Title>
          </Group>
          <Group>
            <DatePicker
              style={{ marginTop: 20 }}
              placeholder="Enter event date"
              clearable={false}
              value={eventDate}
              onChange={setEventDate as any}
            />
            <TimeInput 
              placeholder="Pick time"
              icon={<IconClock size={16} />} 
              defaultValue={new Date()} 
              sx={{marginTop: '20px'}}
              value={eventTime}
              onChange={setEventTime}
            />
          </Group>
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Group>
            <Title order={4}>Max capacity</Title>
            <Text>Limit the number of spots available for your event.</Text>
          </Group>
          <Group>
            <Input 
              placeholder="Enter capacity" 
              value={maxCapacity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxCapacity(e.target.value)}  
            />
          </Group>
        </SimpleGrid>
        <Space h={20} />
        <SimpleGrid cols={2}>
          <Group>
            <Title order={4}>Refundable deposit</Title>
            <Text>Require a refundable deposit (in MATIC) to reserve one spot at your event.</Text>
          </Group>
          <Group>
            <Input 
              placeholder="Enter refundable deposit" 
              value={refund}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRefund(e.target.value)}  
            />
          </Group>
        </SimpleGrid>
        <Space h={20} />
        <SimpleGrid cols={2}>
          <Group>
            <Title order={4}>Event link</Title>
            <Text>The link for your virtual event</Text>
          </Group>
          <Group>
            <Input 
              placeholder="Enter event link" 
              value={eventLink}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventLink(e.target.value)}  
            />
          </Group>
        </SimpleGrid>
        <Space h={20} />
        <SimpleGrid cols={2}>
          <Group>
            <Title order={4}>Event description</Title>
            <Text>Let people know what your event is about!</Text>
          </Group>
          <Group>
            <Textarea
              placeholder="Enter event description"
              value={eventDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEventDescription(e.target.value)}  
            />
          </Group>
        </SimpleGrid>
        <Divider my={20} />
        <Group position="right">
          <Button px={40} onClick={handleSubmit} loading={loading}>Create</Button>
        </Group>
      </Container>
    </div>
  );
}

export default CreateEvent;