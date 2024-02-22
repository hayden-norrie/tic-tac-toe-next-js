import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GameState {
  email: string
  gameBoard: string[][]
  status: string
  currentPlayer: string
}

const initialState: GameState = {
  email: '',
  gameBoard: Array(3).fill(Array(3).fill('')),
  status: 'ongoing',
  currentPlayer: 'X',
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setBoard: (state, action: PayloadAction<string[][]>) => {
      state.gameBoard = action.payload
    },
    updateGameBoard: (
      state,
      action: PayloadAction<{ row: number; col: number; value: string }>
    ) => {
      const { row, col, value } = action.payload
      state.gameBoard = state.gameBoard.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? value : c))
          : r
      )
    },
    setGameStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload
    },
    setCurrentPlayer: (state, action: PayloadAction<string>) => {
      state.currentPlayer = action.payload
    },
  },
})

export const {
  setGameEmail,
  updateGameBoard,
  setGameStatus,
  setCurrentPlayer,
  setBoard,
} = gameSlice.actions

export default gameSlice.reducer
