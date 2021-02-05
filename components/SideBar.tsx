import React, { useState } from 'react';

import {
  Avatar,
  Button,
  Box,
  Nav,
  Sidebar,
  Stack,
  Text,
  ButtonProps,
} from 'grommet';

import {
  Analytics,
  Chat,
  Clock,
  Configure,
  FormNext,
  FormPrevious,
  Help,
  Projects,
  Split,
  StatusInfoSmall,
} from 'grommet-icons';

const src = '//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80';

type NavProp = {
  toggleSideBar: Function,
  showSideBar: boolean
}

type ShowLabelProp = {
  showSideBar: Boolean
}

const SidebarHeader = ({showSideBar}: ShowLabelProp) => {
  return(
    <Box align="center" gap="small" direction="row" margin={{ bottom: 'large' }}>
      <Stack alignSelf="start" anchor="top-right">
        <Avatar src={src} />
        <Box pad="xsmall" background="orange" round responsive={false} />
      </Stack>
      {showSideBar?<Text>Shimrit Yacobi</Text> : ""}
    </Box>
)};

const SidebarButton = ({ icon, label, ...rest }: ButtonProps) => (
  <Box pad="small">
    <Button
      gap="medium"
      alignSelf="start"
      plain
      icon={icon}
      label={label}
      {...rest}
    />
  </Box>
);

const SidebarFooter = ({showSideBar}: ShowLabelProp) => {
  return (
  <Nav>
    <SidebarButton icon={<Chat />} label={showSideBar ? "Chat" : ""} />
    <SidebarButton icon={<Help />} label={showSideBar ? "Support" : ""} />
  </Nav>
)};

const MainNavigation = ({showSideBar, toggleSideBar}: NavProp) => (
  <Nav gap="large" responsive={true}>
    <Box direction="row">
      <SidebarButton icon={<StatusInfoSmall />} label={showSideBar?"Focus":""} />
      <Button plain icon={showSideBar?<FormPrevious />: <FormNext />} onClick={() => toggleSideBar()} margin={showSideBar?{ left: "xlarge"}:{ left: "medium"}} />
    </Box>
    <SidebarButton icon={<Projects />} label={showSideBar?"Services":""} />
    <SidebarButton icon={<Clock />} label={showSideBar?"Glances":""} />
    <SidebarButton icon={<Split />} label={showSideBar?"Flows":""} />
    <SidebarButton icon={<Analytics />} label={showSideBar?"Analytics":""} />
    <SidebarButton icon={<Configure />} label={showSideBar?"Configure":""} />
  </Nav>
);

export const SideNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(true);

  return (
    <Box direction="row" height={{ min: '100%' }}>
        <Sidebar
          elevation='medium'
          responsive={false}
          background="neutral-2"
          header={<SidebarHeader showSideBar={showSideBar} />}
          footer={<SidebarFooter showSideBar={showSideBar} />}
          pad={{ left: 'medium', right: 'medium', vertical: 'medium' }}
        >        
          <MainNavigation toggleSideBar={() => setShowSideBar(!showSideBar)} showSideBar={showSideBar} />
        </Sidebar>
    </Box>
)};