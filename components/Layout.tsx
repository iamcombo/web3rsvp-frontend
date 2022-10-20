import { Container } from "@mantine/core";
import { PropsWithChildren } from "react";
import Navbar from "./Navbar";

const Layout = ({children}: PropsWithChildren) => {
  return (
    <div>
      <Navbar />
      <main>
        <Container size={1280}>
          {children}
        </Container>
      </main>
    </div>
  );
}

export default Layout;