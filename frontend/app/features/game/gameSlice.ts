import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GameState {
  email: string
  gameBoard: string[][]
  status: string
  currentPlayer: string
}

const initialState: GameState = {
  email: '',
  gameBoard: [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ],
  status: '',
  currentPlayer: 'X',
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setGameBoard: (state, action: PayloadAction<string[][]>) => {
      state.gameBoard = action.payload
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload
    },
    setCurrentPlayer: (state, action: PayloadAction<string>) => {
      state.currentPlayer = action.payload
    },
    resetGame: (state) => {
      state.email = ''
      state.gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]
      state.status = ''
      state.currentPlayer = 'X'
    },
  },
})

export const {
  setEmail,
  setGameBoard,
  setStatus,
  setCurrentPlayer,
  resetGame,
} = gameSlice.actions

export default gameSlice.reducer
