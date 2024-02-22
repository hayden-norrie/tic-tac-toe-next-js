'use client'

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import Axios
import { setEmailAddress, clearEmailAddress } from '../redux/features/userSlice';
import { setBoard, setGameStatus } from '../redux/features/gameSlice';
import { useDispatch } from "react-redux"
import { AppDispatch } from '../redux/store';

export const SigninForm: React.FC = () => {
  const [email, setEmail] = useState('');

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    console.log(event.target.value)
  };

  const handleRetrieveGame = async () => {

    try {
      const response = await axios.get('http://localhost:3001/gameplay', {
        headers: {
          Authorization: email,
        },
      });

      if (response.status === 200) {

        alert(JSON.stringify(response))
        dispatch(setEmailAddress(email));
        dispatch(setBoard(response.data.gameBoard));

    router.push('/game'); // Assuming '/game' is the path to your game page
      } else {
        console.error('Failed to retrieve saved game in Signin Page');
      }
    } catch (error) {
      console.error('Error retrieving saved game:', error);
    }
  };


  return (
    <div>
      <h2>Sign In</h2>
      <TextField
        type="email"
        label="Email"
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleRetrieveGame}>
        Login
      </Button>
    </div>
  );
};
