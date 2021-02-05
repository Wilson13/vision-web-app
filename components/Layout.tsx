import React, { ReactNode, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { Box, Button, Collapsible, FormField, Grommet, Heading, Layer, ResponsiveContext, TextInput } from 'grommet';
import { SideNavigation } from './SideBar';
import { FormClose, Hide, Notification, View } from 'grommet-icons';
import { grommet, ThemeType } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyASiHtX0o7yOwZVrEZzohcfRAtRnxXJlXs',
  authDomain: 'grommet-nextjs.firebaseapp.com',
  // ...
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}else {
  firebase.app(); // if already initialized, use that one
}

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

// React.useLayoutEffect = React.useEffect;
const theme: ThemeType = {
  global: {
    // colors: {
    //   brand: '#228BE6',
    // },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
      // weight: 400,
    },
  },
  formField: {
    label: {
      size: 'small',
      margin: { vertical: '0px', horizontal: '0px' },
      weight: 600,
    }
  },
};

const AppBar = (props: any) => (
    <Box
      tag='header'
      direction='row'
      align='center'
      justify='between'
      background='brand'
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      elevation='medium'
      style={{ zIndex: '1' }}
      {...props}
    />
  );

type Props = {
  children?: ReactNode
}

const Layout = ({children}: Props) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [value, setValue] = useState('');
  const [reveal, setReveal] = React.useState(false);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);
  
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <Grommet theme={deepMerge(grommet, theme)} themeMode="dark" full>
        <ResponsiveContext.Consumer>
        {() => (
          <Box fill align="center">
            <Box>
              <Heading level={2} size="medium" textAlign="start">
                Sign In
              </Heading>

                <FormField label="Email Address" htmlFor="email-address" >
                    <TextInput id="email-address" value={value} onChange={onChange} />
                </FormField>
                
                <FormField label="Password" htmlFor="password" >
                  <Box direction="row">
                    <TextInput
                      id="password"
                      plain
                      type={reveal ? 'text' : 'password'}
                      value={value}
                      onChange={event => setValue(event.target.value)}
                    />
                    <Button
                      icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
                      onClick={() => setReveal(!reveal)}
                    />
                  </Box>
                </FormField>
              
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </Box>
          </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    );
  }
  return (
  <Grommet theme={deepMerge(grommet, theme)} full>
    <ResponsiveContext.Consumer>
      {size => (
        <Box fill>
          <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
          <SideNavigation />
          <Box fill>
            <AppBar>
              <Heading level='3' margin='none'>My App</Heading>
              <Button icon={<Notification />} onClick={() => setShowSidebar(!showSidebar)} />
            </AppBar>
            <Box flex align='center' justify='center'>
              {children}
            </Box>
          </Box>
          {(!showSidebar || size !== 'small') ? (
            <Collapsible direction="horizontal" open={showSidebar}>
              <Box
                flex
                width='medium'
                background='light-2'
                elevation='small'
                align='center'
                justify='center'
              >
                sidebar
              </Box>
            </Collapsible>
            ): (
              <Layer>
                <Box
                  background='light-2'
                  tag='header'
                  justify='end'
                  align='center'
                  direction='row'
                >
                  <Button
                    icon={<FormClose />}
                    onClick={() => setShowSidebar(false)}
                  />
                </Box>
                <Box
                  fill
                  background='light-2'
                  align='center'
                  justify='center'
                >
                  sidebar
                </Box>
              </Layer>
            )}
          </Box>
        </Box>
      )}
    </ResponsiveContext.Consumer>
  </Grommet>
  )};

export default Layout
