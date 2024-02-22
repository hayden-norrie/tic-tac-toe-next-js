import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

interface GameState {
  email: string;
  gameBoard: string[][];
  status: string;
  currentPlayer: string;
}

@Injectable()
export class GameplayService {
  constructor(
    @InjectModel("GameState") private gameStateModel: Model<GameState>
  ) {}

  async createOrUpdateGame(
    email: string,
    gameBoard: string[][]
  ): Promise<void> {
    console.log("Looking for an existing game in the service");
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
    console.log("Getting game by email" + " -> " + email);

    const game = await this.gameStateModel.findOne({ email }).exec();

    console.log("getGameByEmail() --> Resulting game:\n " + game);

    // if (game == null || game.status != 'ongoing') {
    //   console.log("BLANKKKK")
    //   return [['','',''],['','',''],['','','']];
    // }

    if (game == null) {
      console.log("BLANKKKK")
      return [['','',''],['','',''],['','','']];
    }

    return game.gameBoard;
  }

  isBoardFull(gameBoard: string[][]): boolean {
    return !gameBoard.some((row) => row.includes(""));
  }

   checkWin(gameBoard: string[][], player: "X" | "O"): boolean {
    for (let i = 0; i < 3; i++) {
        if (
            (gameBoard[i][0] === player && gameBoard[i][1] === player && gameBoard[i][2] === player) ||
            (gameBoard[0][i] === player && gameBoard[1][i] === player && gameBoard[2][i] === player)
        ) {
            return true;
        }
    }

    // Check diagonals
    if (
        (gameBoard[0][0] === player && gameBoard[1][1] === player && gameBoard[2][2] === player) ||
        (gameBoard[0][2] === player && gameBoard[1][1] === player && gameBoard[2][0] === player)
    ) {
        return true;
    }

    return false;
}

  generateBotMove(
    gameBoard: string[][],
    difficulty: "easy" | "medium" | "hard"
  ): { row: number; column: number } | null {

    switch (difficulty) {
      case "easy":
        return this.generateEasyMove(gameBoard);
      case "medium":
        return this.generateMediumMove(gameBoard);
      case "hard":
        return this.generateHardMove(gameBoard);
      default:
        return null;
    }
  }

  private generateEasyMove(
    gameBoard: string[][]
  ): { row: number; column: number } | null {
    
    console.log("Easy");

    const emptySpots = [];
    for (let row = 0; row < gameBoard.length; row++) {
      for (let col = 0; col < gameBoard[row].length; col++) {
        if (gameBoard[row][col] === "") {
          emptySpots.push({ row, column: col });
        }
      }
    }

    if (emptySpots.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * emptySpots.length);
    return emptySpots[randomIndex];
  }

  private generateMediumMove(
    gameBoard: string[][]
  ): { row: number; column: number } | null {
    console.log("Medium");

    // Attempt to block the player's win or choose a random move
    // Detailed logic for blocking or winning moves needed
    return this.generateEasyMove(gameBoard); // Fallback to easy move as a placeholder
  }

  private generateHardMove(
    gameBoard: string[][]
  ): { row: number; column: number } | null {
    console.log("Hard");

    // Implement the Minimax algorithm or another advanced strategy
    // This would be a more complex implementation
    return this.generateEasyMove(gameBoard); // Fallback to easy move as a placeholder
  }
}
