import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


interface GameState {
    email: string;
    gameBoard: string[][];
    status: string;
    currentPlayer: string;
  }

@Injectable()
export class GameplayService {
    constructor(@InjectModel('GameState') private gameStateModel: Model<GameState>) {}

    async createOrUpdateGame(email: string, gameBoard: string[][]): Promise<void> {

    console.log("Looking for an existing game in the service")
    const existingGame = await this.gameStateModel.findOne({ email }).exec();

    if (existingGame) {
      console.log("Exisitng game found");
      console.log("createOrUpdate() --> " + JSON.stringify(existingGame));
      existingGame.gameBoard = gameBoard;
      await existingGame.save();
    } else {
      console.log("Creating new game");
      const newGame = new this.gameStateModel({ email, gameBoard });
      await newGame.save();
    }
  }

  async getGameByEmail(email: string): Promise<string[][]> {

    console.log("Getting game by email");

    const game = await this.gameStateModel.findOne({ email }).exec();
    
    console.log("getGameByEmail() --> " + game);

    if(game == null) {
  
      return null;
    }

    return game.gameBoard;

}


  isBoardFull(gameBoard: string[][]): boolean {
    return !gameBoard.some(row => row.includes(''));
  }

  checkWin(gameBoard: string[][], player: 'X' | 'O'): boolean {
    // Check horizontal lines
    for (const row of gameBoard) {
      if (row.every(cell => cell === player)) {
        return true;
      }
    }
  
    // Check vertical lines
    for (let col = 0; col < gameBoard[0].length; col++) {
      if (gameBoard.every(row => row[col] === player)) {
        return true;
      }
    }
  
    // Check diagonal (top-left to bottom-right)
    let winDiagonal1 = true;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i][i] !== player) {
        winDiagonal1 = false;
        break;
      }
    }
    if (winDiagonal1) return true;
  
    // Check diagonal (top-right to bottom-left)
    let winDiagonal2 = true;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i][gameBoard.length - 1 - i] !== player) {
        winDiagonal2 = false;
        break;
      }
    }
    if (winDiagonal2) return true;
  
    // No win condition met
    return false;
  }
  


  generateBotMove(gameBoard: string[][], difficulty: 'easy' | 'medium' | 'hard'): { row: number; column: number } | null {

    console.log("Entered switch() - Difficulty set to " + difficulty)

    switch (difficulty) {
      case 'easy':
        return this.generateEasyMove(gameBoard);
      case 'medium':
        return this.generateMediumMove(gameBoard);
      case 'hard':
        // Placeholder for a Minimax algorithm or similar strategy
        // For the scope of this example, you might fall back to medium strategy
        return this.generateMediumMove(gameBoard);
      default:
        return null;
    }
  }

  private generateEasyMove(gameBoard: string[][]): { row: number; column: number } | null {
    // Random available spot selection
    const emptySpots = [];
    for (let row = 0; row < gameBoard.length; row++) {
      for (let col = 0; col < gameBoard[row].length; col++) {
        if (gameBoard[row][col] === '') {
          emptySpots.push({ row, column: col });
        }
      }
    }
    if (emptySpots.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * emptySpots.length);
    return emptySpots[randomIndex];
  }

  private generateMediumMove(gameBoard: string[][]): { row: number; column: number } | null {
    // Attempt to block the player's win or choose a random move
    // Detailed logic for blocking or winning moves needed
    return this.generateEasyMove(gameBoard); // Fallback to easy move as a placeholder
  }

  private generateHardMove(gameBoard: string[][]): { row: number; column: number } | null {
    // Implement the Minimax algorithm or another advanced strategy
    // This would be a more complex implementation
    return this.generateEasyMove(gameBoard); // Fallback to easy move as a placeholder
  }
}
