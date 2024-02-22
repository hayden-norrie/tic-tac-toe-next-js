'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import Axios
import { setEmailAddress, clearEmailAddress } from '../redux/features/userSlice';
import { setBoard, setGameStatus } from '../redux/features/gameSlice';
import { useDispatch } from "react-redux"
import { AppDispatch } from '../redux/store';
import { 
    Grid, 
    Paper, 
    Avatar, 
    TextField, 
    FormControlLabel, 
    Checkbox, 
    Button, 
    Typography, 
    Link,
    Box,
    Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


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

  const paperStyle = {
    padding: 20,
    height: '70vh',
    width: 280,
    margin: '20px auto',
  };
  
  const avatarStyle = {
    backgroundColor: '#1bbd7e',
  };
  
  const btnStyle = {
    margin: '8px 0',
  };
  

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>


    // <div>
    //   <h2>Sign In</h2>
    //   <TextField
    //     type="email"
    //     label="Email"
    //     variant="outlined"
    //     value={email}
    //     onChange={handleEmailChange}
    //     fullWidth
    //     margin="normal"
    //   />
    //   <Button variant="contained" color="primary" onClick={handleRetrieveGame}>
    //     Login
    //   </Button>
    // </div>
  );
};
