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
    const currentGame = await this.gameplayService.getGameByEmail(userEmail);

    // Assume you have methods to:
        // validate the move
        // update the board
    currentGame[action.row][action.column] = 'X'; // Assuming 'X' is the user
        // check the game status
    const playerWins = this.gameplayService.checkWin(currentGame, 'X');

    // Here, you'd call those methods. For simplicity, let's focus on the bot's move:

    console.log("Retrieving bot move using difficulty " + difficulty)

    const botMove = this.gameplayService.generateBotMove(currentGame, difficulty);

    
    // After determining the bot's move, update the game state accordingly
    if (botMove) {
      currentGame[botMove.row][botMove.column] = 'O'; // Assuming 'O' is the bot
    }

    // Check for win or draw conditions
    const botWins = this.gameplayService.checkWin(currentGame, 'O');
    const isDraw = this.gameplayService.isBoardFull(currentGame) && !playerWins && !botWins;

    let gameStatus = 'ongoing';
    if (playerWins) {
      gameStatus = 'X wins';
    } else if (botWins) {
      gameStatus = 'O wins';
    } else if (isDraw) {
      gameStatus = 'draw';
    }

    // Save the updated game state
    await this.gameplayService.createOrUpdateGame(userEmail, currentGame);

    return {
      gameStatus: gameStatus,
      botResponse: botMove,
    };

  } catch (error) {
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}



  @Get("")
  async retrieveSavedGame(@Headers('Authorization') userEmail: string) {

    console.log("retrieveSavedGame()");
    console.log("Using email: " + userEmail);
    const gameBoard = await this.gameplayService.getGameByEmail(userEmail);

    console.log("GAME BOARD: " + gameBoard);

    if(gameBoard == null){
      await this.gameplayService.createOrUpdateGame(userEmail, [['','',''],['','',''],['','','']]);
    }

    return { gameBoard };
  }

  private isEmptyObject(obj) {
    console.log("STRING --> " + JSON.stringify(obj));
    return JSON.stringify(obj) === '{}';
  }

}
