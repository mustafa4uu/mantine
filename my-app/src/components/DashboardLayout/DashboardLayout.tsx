import React, { useState } from "react";
import type { ReactNode } from "react"; 
import { Outlet } from "react-router-dom";
import { AppShell, Burger, Flex } from "@mantine/core";
import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";

interface AppshellDemoProps {
  children?: ReactNode;
}
const DashboardLayout: React.FC<AppshellDemoProps> = () => {
  const [mobileOpened, setMobileOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState<string | null>(null);

  return (
    <AppShell
      header={{height: 70 }}
      navbar={{ 
      width: 100,
      breakpoint: "sm", 
      collapsed: { mobile: !mobileOpened }, }}
     styles={{
        root: {
          width: '100vw',       // full viewport width
          minHeight: '100vh',   // full viewport height
         overflow: 'hidden',
        },
      }}
    >    
    <AppShell.Header>
         <Flex
          h="100%"
          p="lg"
          align="center"         
          justify="space-between"
          w="100%"
        >       
          <Burger
            opened={mobileOpened}
            onClick={() => setMobileOpened((o) => !o)}
            hiddenFrom="sm" // only show on mobile
            size="sm"
          />          
          <Header />          
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar
        style={{
          transition: "width 0.3s ease",
          overflow: "hidden",                 
        }}
        py={10}   
        px={10}
      >
      <SideBar setMenuOpened={setMenuOpened}
        menuOpened={menuOpened}/>
      </AppShell.Navbar>
      
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer pos="unset" py={5} mt={10}>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default DashboardLayout;
