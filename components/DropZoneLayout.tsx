import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { Box, Button, FormField, Grommet, Header, Heading, Image as Img, InfiniteScroll, ResponsiveContext, Text, TextInput } from 'grommet';
import { Hide, View, Gallery, Power } from 'grommet-icons';
import { grommet } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import Dropzone, {FileWithPath, useDropzone} from 'react-dropzone';
import { detectObject } from "../src/detection";

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
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

// React.useLayoutEffect = React.useEffect;
const theme = {
  global: {
    colors: {
      brand: '#4C3FBC',
    },
    font: {
      family: 'Noto Sans SC',
      size: '18px',
      height: '20px',
      // weight: 400,
    },
    focus: {
      border: {
      color: 'transparent',
      }
    }
  },
  formField: {
    label: {
      size: 'small',
      margin: { vertical: '0px', horizontal: '0px' },
      weight: 600,
    }
  },
  text: {
    medium: {
      size: '16px'
    }
  },
};

export type Vertex = {
  x: number;
  y: number;
};

export type JSONResponse = {
  detectRes: ResponseObj[];
  url: string;
};

export type ResponseObj = {
  name: string;
  confidence: string;
  bounds: Vertex[];
};

const signout = async () => {
  await firebase.auth().signOut();
};

const Layout = () => {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User>();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [value, setValue] = useState('');
  const [reveal, setReveal] = useState(false);
  const [apiResponse, setApiResponse] = useState<JSONResponse>({detectRes: [], url: ""})
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);
  
  const {acceptedFiles, getRootProps, getInputProps} 
    = useDropzone({
      accept: 'image/jpeg, image/png', 
      maxFiles:1,
      onDrop: async uploadedFiles => {
        try {
          const data = await detectObject(uploadedFiles[0])
          setApiResponse(data);

          // load image to get width and height
          const img = new Image();
          var objectUrl = URL.createObjectURL(uploadedFiles[0]);
          img.onload = async function () {
              URL.revokeObjectURL(objectUrl);
          };
          img.src = objectUrl;
        } catch(err) {
          alert(err);
        }
      }
    });

    const files = acceptedFiles.map(file => (
      <li key={(file as FileWithPath).path}>
        {(file as FileWithPath).path} - {file.size} bytes
      </li>
    ));
  
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      setFirebaseUser(user || undefined);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <Grommet theme={deepMerge(grommet, theme)} full>
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
  } else {
    return (  
      <Grommet theme={deepMerge(grommet, theme)} full>
        <Box fill>
          <Header background="brand" justify="end" pad="xsmall">
            <Box width="xsmall" pad="xsmall" height="xxsmall" direction="row">
              <Img src={firebaseUser?.photoURL || ""} />  
              <Text alignSelf="center" margin={{left: "small"}}>{firebaseUser?.displayName}</Text> 
            </Box>
            <Button 
              icon={<Power />} 
              color="transparent" 
              label="Logout" 
              hoverIndicator 
              onClick={signout}
            />
          </Header>
          <Box fill align="center" justify="center">
            <Dropzone>
              {() => (
                <section>
                  <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <Box width="large" justify="center" height=" medium" alignSelf="center" align="center" border={{color: 'brand', size: 'medium', style: "dashed" }} background="#EFEEF0">
                      <Box direction="column" align="center" pad="small">
                        <Gallery color="brand" size="large" />
                        <Text color="brand" margin={{ top: "medium" }}>Drag 'n' drop image here, or click to select image (max 600kb)</Text>
                        <aside>
                          <ul>{files}</ul>
                          <Box height="small" >
                            <InfiniteScroll items={apiResponse.detectRes}>
                            {(item: ResponseObj) => (
                              <Box border={{ side: 'bottom' }} pad="small" justify="center">
                                <Text>{item.name}</Text>
                              </Box>
                            )}
                          </InfiniteScroll>
                          </Box>
                        </aside>
                      </Box>
                    </Box>
                  </div>
                </section>
              )}
            </Dropzone>
            <Box width="large" justify="center" height="medium" margin={{top: "small"}}>
              { apiResponse.url !== "" ? <Img
                    fit="contain"
                    src={apiResponse.url}
                  />: "" }
              { apiResponse.url == "" ? <Img
                fit="contain"
                src={acceptedFiles.length > 0 ? URL.createObjectURL(acceptedFiles[0]) : ""}
              />: ""
              }
            </Box>
          </Box>
        </Box>
      </Grommet>
    )}
  }

export default Layout
