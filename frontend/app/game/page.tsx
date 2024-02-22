'use client'

import React from 'react';
import { useState } from 'react';
import { Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios'; // Import Axios
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useAppSelector } from '../redux/store';
import { useDispatch } from 'react-redux';
import { updateGameBoard, GameState, setGameStatus } from '../redux/features/gameSlice';


const Game = () => {

  const username = useAppSelector((state) => state.userReducer.email)
  // Retrieve the game board state from Redux
  const gameBoardRedux = useAppSelector((state) => state.gameReducer.gameBoard);
  const statusRedux = useAppSelector((state) => state.gameReducer.status);

  // Initialize local state with the game board from Redux
  const [gameBoard, setGameBoard] = useState<GameState['gameBoard']>(gameBoardRedux);
  const [difficulty, setDifficulty] = useState('easy');
  const [status, setStatus] = useState<GameState['status']>(statusRedux);
  const dispatch = useDispatch();

  // Update local state whenever Redux state changes
  if (gameBoard !== gameBoardRedux) {
    setGameBoard(gameBoardRedux);
  }

  if (status !== statusRedux) {
    setStatus(statusRedux);
  }

  useEffect(() => {
  }, []);

  const router = useRouter()

  interface ActionBody {
    row: number;
    column: number;
  }
  
  interface ResponseBody {
    gameStatus: string;
    botResponse?: {
      row: number;
      column: number;
    };
  }
  

  const handleLogout = () => {
    router.push('/signin'); 
  }

  const handleCellClick = async (rowIndex: number, colIndex: number): Promise<void> => {

    try {

      const difficultyLevel = difficulty; // Assuming you have the difficulty level
      const action: ActionBody = { row: rowIndex, column: colIndex }; // Example action data
  
      const response = await axios.post<ResponseBody>('http://localhost:3001/gameplay', action, {
        headers: {
          Authorization: username
        },
        params: {
          difficulty: difficultyLevel
        }
      });

      if (response.data.gameStatus != "ongoing") {
        return;
      }

  
      if (response.status === 201) {

        dispatch(setGameStatus(response.data.gameStatus))

        // update gameboard state for UI changes
        dispatch(updateGameBoard({ row: rowIndex, col: colIndex, value: "X" })); // update user move

        if (response.data.botResponse != null){
          dispatch(updateGameBoard({ row: response.data.botResponse.row, col: response.data.botResponse.column, value: "O" })); // update AI move
        }

        setGameBoard(gameBoardRedux)


            // Check game status to see if someone wins or if it's a tie
      const gameStatus = response.data.gameStatus;
   
      } else {
        console.error('Failed to retrieve saved game in the actual game');
      }
    } catch (error) {
      console.error('Error retrieving saved game:', error);
    }
  };

  // Correctly typing the onChange event handler for MUI Select
  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    setDifficulty(event.target.value);
    alert(event.target.value);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom align="center">
        {username}
      </Typography>
      <Select
        value={difficulty}
        onChange={handleDifficultyChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{ marginBottom: 2, width: '100%' }}
      >
        <MenuItem value="easy">Easy</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="hard">Hard</MenuItem>
      </Select>
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
