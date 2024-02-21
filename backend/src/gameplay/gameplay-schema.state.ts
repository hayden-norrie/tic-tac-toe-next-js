import * as mongoose from 'mongoose';

export const GameplaySchema = new mongoose.Schema({
  email: String,
  gameBoard: [[String]], // A 2D array of strings
  status: String,
  currentPlayer: String,
});
