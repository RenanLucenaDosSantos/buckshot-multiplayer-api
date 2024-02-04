import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LobbyGateway } from 'src/app/gateways/lobby.gateway';
import { fireDto } from 'src/shared/dto/fire.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { EmmiterService } from 'src/shared/services/emmiter/emmiter.service';
import { GameStateService } from 'src/shared/services/game-state/game-state.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameStateService: GameStateService,
    private readonly EmmiterService: EmmiterService,
    private readonly LobbyGateway: LobbyGateway
  ) { }

  @Post('fire')
  @HttpCode(200)
  async enterRoom(@Body() dto: fireDto) {
    try {
      if(this.gameStateService.whoIsInTurn() !== dto.player) {
        throw new Error('Não é o seu turno');
      }
      if(!this.gameStateService.gameState.running) {
        throw new Error('O jogo não está iniciado ainda');
      }

      const result = await this.EmmiterService.fire(dto, this.LobbyGateway.server);
      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('win')
  @HttpCode(200)
  async winGame(@Body() dto: { player: string }) {
    try {
      const oponnent = dto.player === 'player1' ? 'player2' : 'player1'
      if(this.gameStateService.gameState[oponnent].hp !== 0) {
        throw new Error('Não trapaceie, seu safado');
      }
 
      const result = await this.gameStateService.endGame();
      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
