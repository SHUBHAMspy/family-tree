import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'

import {style} from './Button';
const ConnectToDriveBtn = () => {
  const [exchangeCode, setExchangeCode] = useState('')
  const [accessToken, setAccessToken] = useState('')
  // useEffect(() => {
  //   // Check if there is a code parameter in the URL
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');

  //   console.log(code);
    
  //   const exchangeCodeForToken = async (code) => {
  //     const clientId = '140717059895-8j0l40lgsr3t6g9trmra8flmtuviqrp5.apps.googleusercontent.com';
  //     const clientSecret = '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';
  //     const redirectUri = 'http://localhost:3000';
      
  //     const tokenUrl = 'https://accounts.google.com/o/oauth2/token';
      
  //     // Request an access token
  //     const response = await fetch(tokenUrl, {
  //       method: 'POST',
  //       headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: `code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&grant_type=authorization_code`,
  //   });

  //   const data = await response.json();
  //   console.log(data);
  //   // Store the access token securely for future API requests
  //   console.log('Access Token:', data.access_token);
  // };
  // if (code) {
  //   // Call a function to exchange the code for an access token
  //   setExchangeCode(code)
  //   exchangeCodeForToken(code);
  // }
  // }, [exchangeCode])
  
  const handleButtonClick = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri =  process.env.NODE_ENV === 'development'? 'http://localhost:3000' : REACT_APP_REDIRECT_URI;
    const scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly';

    

    const authEndpoint = 'https://accounts.google.com/o/oauth2/auth';
    const authorizationUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

    // Open the authorization URL in a new window
    window.location.href = authorizationUrl
    // const authWindow = window.open(authorizationUrl, '_blank', 'width=600,height=600');

    // Handle the redirect URL after authorization
    const handleRedirect = () => {

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      console.log(accessToken);
      if (accessToken) {
        localStorage.setItem('accessToken',accessToken)
        setAccessToken(accessToken);
      } else {
        console.error('Error retrieving access token');
      }
      
    };


    handleRedirect()

  };
 
  return (
    <>
      <Button sx={style}  component="label" onClick={handleButtonClick} >
        Connect to Drive
      </Button>
    </>
  )
}

export default ConnectToDriveBtn