'use client'

import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useAppSelector } from '../redux/store';


// Must fetch the game upon loading
// Fill the blocks
// Logout should take a user back to the sign in
const Game = () => {

  const username = useAppSelector((state) => state.userReducer.email)
  const gameBoard = useAppSelector((state) => state.gameReducer.gameBoard)


  useEffect(() => {
    
  }, []); // Empty dependency array means this runs once on mount

  const router = useRouter()

  const handleLogout = () => {
    router.push('/signin'); // Assuming '/game' is the path to your game page
  };

   const handleCellClick = (rowIndex: number, colIndex: number): void => {
    alert(`Cell clicked: row ${rowIndex}, col ${colIndex}`);
  };


  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom align="center">
        {username}
      </Typography>
      <Grid container spacing={2}>
      {gameBoard.map((row, rowIndex) => (
        <Grid item xs={12} key={rowIndex}> {/* Full width for each row */}
          <Grid container justifyContent="center" spacing={2}>
            {row.map((cell, cellIndex) => (
              <Grid item key={cellIndex}> {/* Each cell of the row */}
                {/* Add onClick event handler to the div representing the cell */}
                <div
                  style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black', cursor: 'pointer' }}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {cell}
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogout}
        sx={{ marginTop: 3 }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Game;
