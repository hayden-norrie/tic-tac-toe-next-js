import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GameState {
  email: string
  gameBoard: string[][]
  status: string
  currentPlayer: string
}

const initialState: GameState = {
  email: '',
  gameBoard: Array(3).fill(Array(3).fill('')), // Example for a 3x3 board, adjust as needed
  status: 'ongoing', // Example status, adjust based on your game logic
  currentPlayer: 'X', // Assuming 'X' and 'O' players, adjust as needed
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Action to set the email
    setGameEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    // Action to set the email
    setBoard: (state, action: PayloadAction<string[][]>) => {
      state.gameBoard = action.payload
    },
    // Action to update the game board at a specific position
    updateGameBoard: (
      state,
      action: PayloadAction<{ row: number; col: number; value: string }>
    ) => {
      const { row, col, value } = action.payload
      // Ensure you're not directly mutating the state
      state.gameBoard = state.gameBoard.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? value : c))
          : r
      )
    },
    // Action to set the game status
    setGameStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload
    },
    // Action to change the current player
    setCurrentPlayer: (state, action: PayloadAction<string>) => {
      state.currentPlayer = action.payload
    },
  },
})

// Export actions
export const {
  setGameEmail,
  updateGameBoard,
  setGameStatus,
  setCurrentPlayer,
  setBoard,
} = gameSlice.actions

// Export reducer
export default gameSlice.reducer
