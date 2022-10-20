import { Button, Container, Group, Header, Text, Title } from "@mantine/core";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { shortenAddress } from "../../utils";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <Header height={60} mb={80}>
      <Container size={1280} className={styles.Header}>
        <Group>
          <Text size={'xl'} weight={500}>web3rsvp</Text>
        </Group>
        <Group spacing={5}>
          <Link href={'/create-event'}>
            <Button variant="outline">Create Event</Button>
          </Link>
        </Group>
        <Group>
          <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName }) => {
              return (
                <Button onClick={show}>
                  {isConnected ? shortenAddress(address as string) : "Custom Connect"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        </Group>
      </Container>
    </Header>
  );
}

export default Navbar;