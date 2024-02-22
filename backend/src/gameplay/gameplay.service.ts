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
  constructor(
    @InjectModel('GameState') private gameStateModel: Model<GameState>,
  ) {}

  async createOrUpdateGame(
    email: string,
    gameBoard: string[][],
  ): Promise<void> {
    const existingGame = await this.gameStateModel.findOne({ email }).exec();

    if (existingGame) {
      existingGame.gameBoard = gameBoard;
      await existingGame.save();
    } else {
      const newGame = new this.gameStateModel({ email, gameBoard });
      await newGame.save();
    }
  }

  async getGameByEmail(email: string): Promise<string[][]> {
    const game = await this.gameStateModel.findOne({ email }).exec();

    if (game == null) {
      return [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
    }

    return game.gameBoard;
  }

  isBoardFull(gameBoard: string[][]): boolean {
    return !gameBoard.some((row) => row.includes(''));
  }

  checkWin(gameBoard: string[][], player: 'X' | 'O'): boolean {
    for (let i = 0; i < 3; i++) {
      if (
        (gameBoard[i][0] === player &&
          gameBoard[i][1] === player &&
          gameBoard[i][2] === player) ||
        (gameBoard[0][i] === player &&
          gameBoard[1][i] === player &&
          gameBoard[2][i] === player)
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      (gameBoard[0][0] === player &&
        gameBoard[1][1] === player &&
        gameBoard[2][2] === player) ||
      (gameBoard[0][2] === player &&
        gameBoard[1][1] === player &&
        gameBoard[2][0] === player)
    ) {
      return true;
    }

    return false;
  }

  generateBotMove(
    gameBoard: string[][],
    difficulty: 'easy' | 'medium' | 'hard',
  ): { row: number; column: number } | null {
    switch (difficulty) {
      case 'easy':
        return this.generateEasyMove(gameBoard);
      case 'medium':
        return this.generateMediumMove(gameBoard);
      case 'hard':
        return this.generateHardMove(gameBoard);
      default:
        return null;
    }
  }

  private generateEasyMove(
    gameBoard: string[][],
  ): { row: number; column: number } | null {
    for (let row = 0; row < gameBoard.length; row++) {
      for (let col = 0; col < gameBoard[row].length; col++) {
        if (gameBoard[row][col] === '') {
          return { row, column: col };
        }
      }
    }
    return null; // No empty spots found
  }

  private generateMediumMove(
    gameBoard: string[][],
  ): { row: number; column: number } | null {
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

  private generateHardMove(
    gameBoard: string[][],
  ): { row: number; column: number } | null {
    const userPlayer = 'X';
    const aiPlayer = 'O';

    // Minimax algorithm function
    const minimax = (
      gameBoard: string[][],
      depth: number,
      isMaximizing: boolean,
    ): number => {
      const result = this.checkWin(gameBoard, userPlayer)
        ? -10
        : this.checkWin(gameBoard, aiPlayer)
          ? 10
          : 0;
      if (result !== 0) {
        return result;
      }
      if (depth === 0) return 0;

      const player = isMaximizing ? aiPlayer : userPlayer;

      let bestScore = isMaximizing ? -Infinity : Infinity;
      for (let row = 0; row < gameBoard.length; row++) {
        for (let col = 0; col < gameBoard[row].length; col++) {
          if (gameBoard[row][col] === '') {
            gameBoard[row][col] = player;
            const score = minimax(gameBoard, depth - 1, !isMaximizing);
            gameBoard[row][col] = ''; // Undo the move
            bestScore = isMaximizing
              ? Math.max(bestScore, score)
              : Math.min(bestScore, score);
          }
        }
      }
      return bestScore;
    };

    // Find the best move using the Minimax algorithm
    let bestScore = -Infinity;
    let bestMove: { row: number; column: number } | null = null;
    for (let row = 0; row < gameBoard.length; row++) {
      for (let col = 0; col < gameBoard[row].length; col++) {
        if (gameBoard[row][col] === '') {
          gameBoard[row][col] = aiPlayer;
          const score = minimax(gameBoard, 5, false); // Adjust the depth as needed
          gameBoard[row][col] = ''; // Undo the move
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row, column: col };
          }
        }
      }
    }
    return bestMove;
  }
}
