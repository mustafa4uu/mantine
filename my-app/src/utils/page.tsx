"use client";
import { useState } from "react";
import {
  Tabs,
  ScrollArea,
  Transition,
  useMantineTheme,
  useComputedColorScheme,
} from "@mantine/core";

import OverlayDemo from "../../../components/ComponentsDemo/OverlayDemo";
import ScrollAreaDemo from "../../../components/ComponentsDemo/ScrollAreaDemo";
import PopOverDemo from "../../../components/ComponentsDemo/PopOver";
import StatisticDemo from "../../../components/ComponentsDemo/StatisticDemo";
import { MantineDataTable } from "@/components/ComponentsDemo/MantineDataTable";
import JsonInputDemo from "@/components/ComponentsDemo/JsonInputDemo";
import OtherComponent from "@/components/ComponentsDemo/OtherComponent";
import NotificationDemo from "@/components/ComponentsDemo/NotificationDemo";
import ColorPickerDemo from "@/components/ComponentsDemo/ColorPickerDemo";
import ThemeIconDemo from "@/components/ComponentsDemo/ThemeIconDemo";
import TransitionsDemo from "@/components/ComponentsDemo/TransitionsDemo";
import PillMultiselectionDemo from "@/components/ComponentsDemo/PillMultiselectionDemo";
import PillsDemo from "@/components/ComponentsDemo/PillsDemo";

export default function TabsDemo() {
  const [active, setActive] = useState<string | null>("OtherComponent");
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme(); // "light" | "dark"

  // Active tab highlight style
  const activeTabStyle = {
    borderBottom: `2px solid ${colorScheme === "dark" ? theme.colors.blue[4] : theme.colors.blue[6]
      }`,
    fontWeight: 600,
    color: colorScheme === "dark" ? theme.colors.blue[3] : theme.colors.blue[7],
  };

  return (
    <Tabs value={active} onChange={setActive} p={0}>
      {/* Scrollable tab list */}
      <ScrollArea type="scroll" scrollbars="x" w="100%" mb={15}>
        <Tabs.List style={{ minWidth: "max-content" }} >
           <Tabs.Tab
            value="OtherComponent"
            aria-label="OtherComponent"
            style={active === "OtherComponent" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Other
          </Tabs.Tab>
          <Tabs.Tab
            value="Pill"
            aria-label="Pill"
            style={active === "Pill" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Pill
          </Tabs.Tab>
          {/* <Tabs.Tab
            value="Pillm"
            aria-label="Pillm"
            style={active === "Pillm" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Pillm
          </Tabs.Tab> */}
          <Tabs.Tab
            value="Transitions"
            aria-label="Transitions"
            style={active === "Transitions" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Transitions
          </Tabs.Tab>
          <Tabs.Tab
            value="ThemeIcon"
            aria-label="ThemeIcon"
            style={active === "ThemeIcon" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            ThemeIcon
          </Tabs.Tab>
         
          <Tabs.Tab
            value="ColorPicker"
            aria-label="ColorPicker"
            style={active === "ColorPicker" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            ColorPicker
          </Tabs.Tab>
          

          <Tabs.Tab
            value="JsonInput"
            aria-label="JsonInput"
            style={active === "JsonInput" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            JsonInput
          </Tabs.Tab>
          
          <Tabs.Tab
            value="notificationDemo"
            aria-label="notificationDemo"
            style={active === "notificationDemo" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Notification
          </Tabs.Tab>
          <Tabs.Tab
            value="PopOver"
            aria-label="PopOver demo"
            style={active === "PopOver" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Pop Over
          </Tabs.Tab>
          <Tabs.Tab
            value="StatisticDemo"
            aria-label="StatisticDemo"
            style={active === "StatisticDemo" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Statistic
          </Tabs.Tab>

          <Tabs.Tab
            value="overlay"
            aria-label="Overlay demo"
            style={active === "overlay" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Overlay
          </Tabs.Tab>
          <Tabs.Tab
            value="Scroll"
            aria-label="Scroll demo"
            style={active === "Scroll" ? activeTabStyle : {}}
            pb={10}
            px={25}
          >
            Scroll
          </Tabs.Tab>
        </Tabs.List>
      </ScrollArea>

      {/* Panels with animation */}
      <Tabs.Panel value="overlay">
        <Transition mounted={active === "overlay"} transition="fade" duration={300} keepMounted>
          {(styles) => <div style={styles}><OverlayDemo /></div>}
        </Transition>
      </Tabs.Panel>

      <Tabs.Panel value="OtherComponent">
        <Transition mounted={active === "OtherComponent"} transition="fade" duration={300} keepMounted>
          {(styles) => <div style={styles}><OtherComponent /></div>}
        </Transition>
      </Tabs.Panel>
      <Tabs.Panel value="Pill">
        <Transition mounted={active === "Pill"} transition="fade" duration={300} keepMounted>
          {(styles) => <div style={styles}><PillsDemo /></div>}
        </Transition>
      </Tabs.Panel>

      <Tabs.Panel value="Scroll">
        <Transition mounted={active === "Scroll"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><ScrollAreaDemo /></div>}
        </Transition>
      </Tabs.Panel>

      <Tabs.Panel value="PopOver">
        <Transition mounted={active === "PopOver"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><PopOverDemo /></div>}
        </Transition>
      </Tabs.Panel>

      <Tabs.Panel value="StatisticDemo">
        <Transition mounted={active === "StatisticDemo"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><StatisticDemo /></div>}
        </Transition>
      </Tabs.Panel>
      <Tabs.Panel value="notificationDemo">
        <Transition mounted={active === "notificationDemo"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><NotificationDemo /></div>}
        </Transition>
      </Tabs.Panel>
      <Tabs.Panel value="TableDemo">
        <Transition mounted={active === "TableDemo"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><MantineDataTable /></div>}
        </Transition>
      </Tabs.Panel>

      <Tabs.Panel value="JsonInput">
        <Transition mounted={active === "JsonInput"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><JsonInputDemo /></div>}
        </Transition>
      </Tabs.Panel>
      <Tabs.Panel value="ColorPicker">
        <Transition mounted={active === "ColorPicker"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><ColorPickerDemo /></div>}
        </Transition>
      </Tabs.Panel>
       <Tabs.Panel value="ThemeIcon">
        <Transition mounted={active === "ThemeIcon"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><ThemeIconDemo /></div>}
        </Transition>
      </Tabs.Panel>
       <Tabs.Panel value="Transitions">
        <Transition mounted={active === "Transitions"} transition="pop" duration={300} keepMounted>
          {(styles) => <div style={styles}><TransitionsDemo /></div>}
        </Transition>
      </Tabs.Panel>
      
    </Tabs>
  );
}
