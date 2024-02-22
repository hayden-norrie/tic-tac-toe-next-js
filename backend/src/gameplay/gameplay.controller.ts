import { Body, Controller, Post, Query, Headers, Get, HttpException, HttpStatus } from '@nestjs/common';
import { GameplayService } from './gameplay.service'; // Ensure the path is correct

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

interface ResponseBodyRetrieveGame {
  gameBoard: string[][];
}

@Controller('gameplay')
export class GameplayController {

  constructor(private gameplayService: GameplayService) {}

@Post()
async takeTurn(
  @Headers('Authorization') userEmail: string,
  @Query('difficulty') difficulty: 'easy' | 'medium' | 'hard',
  @Body() action: ActionBody,
): Promise<ResponseBody> {

//   if (!userEmail) {
//     throw new HttpException('Missing or invalid Authorization header', HttpStatus.UNAUTHORIZED);
//   }

  try {

    // User gameplay logic
    // ==================================================
    // ==================================================

    const currentGame = await this.gameplayService.getGameByEmail(userEmail);

    if(currentGame[action.row][action.column] != '') {
      console.log("Spot taken");
      return null;
    }

    currentGame[action.row][action.column] = 'X'; // Assuming 'X' is the user
    const playerWins = this.gameplayService.checkWin(currentGame, 'X');

    if(playerWins) {

      console.log("USER WINS!!!!!")

      await this.gameplayService.createOrUpdateGame(userEmail, currentGame);
  
      return {
        gameStatus: "X wins",
        botResponse: {
          row: null,
          column: null
        },
      };
    }

    // ====================================================




    // If user has not won, execute the bot move.
    // ==================================================

    console.log("Retrieving bot move using difficulty " + difficulty)

    const botMove = this.gameplayService.generateBotMove(currentGame, difficulty);
  
    if (botMove) {
      currentGame[botMove.row][botMove.column] = 'O'; 
    }

    const botWins = this.gameplayService.checkWin(currentGame, 'O');

    if(botWins) {

      console.log("BOT WINS!!!!!")

      await this.gameplayService.createOrUpdateGame(userEmail, currentGame);
  
      return {
        gameStatus: "O wins",
        botResponse: {
          row: botMove.row,
          column: botMove.column
        },
      };
    }

    // ==================================================



    // If user and AI have not won, check for a DRAW
    // ==================================================

    const isDraw = this.gameplayService.isBoardFull(currentGame);

    if(isDraw) {

      console.log("ITS A DRAW")

      await this.gameplayService.createOrUpdateGame(userEmail, currentGame);
  
      return {
        gameStatus: "draw",
        botResponse: {
          row: null,
          column: null
        },
      };
    }

    // ==================================================

 
    // Regular move if no wins or draw
    // ==================================================

    await this.gameplayService.createOrUpdateGame(userEmail, currentGame);

    console.log("Regular move done.")

    return {
      gameStatus: 'ongoing',
      botResponse: botMove,
    };

  } catch (error) {
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}



  // @Get("")
  // async retrieveSavedGame(@Headers('Authorization') userEmail: string) {

  //   console.log("retrieveSavedGame()");
  //   console.log("Using email: " + userEmail);
  //   const gameBoard = await this.gameplayService.getGameByEmail(userEmail);

  //   console.log("GAME BOARD: " + gameBoard);

  //   if(gameBoard == null){
  //     console.log("THE GAME BOARD IS NULL")
  //     // await this.gameplayService.createOrUpdateGame(userEmail, [['','',''],['','',''],['','','']]);
  //     return [['','',''],['','',''],['','','']];
  //   }

  //   return { gameBoard };
  // }

  @Get("")
async retrieveSavedGame(@Headers('Authorization') userEmail: string): Promise<ResponseBodyRetrieveGame> {
 
  try {
    // Retrieve the saved game based on the user's email
    const savedGame = await this.gameplayService.getGameByEmail(userEmail);

    console.log(JSON.stringify(savedGame) + " --- RETURNED FROM getGameByEmail")

      return { 
        gameBoard: savedGame
      };

  } catch (error) {
    // If an error occurs, return an error response
  }
}

}
