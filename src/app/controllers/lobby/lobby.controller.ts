import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { LobbyGateway } from 'src/app/gateways/lobby.gateway';
import { enterRoomDto } from 'src/shared/dto/enter-room.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { GameStateService } from 'src/shared/services/game-state/game-state.service';

@Controller('lobby')
export class LobbyController {

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly LobbyGateway: LobbyGateway
  ) { }

  @Post('enter-room')
  @HttpCode(200)
  async enterRoom(@Body() dto: enterRoomDto) {
    try {
      if(this.gameStateService.playerIsInRoom(dto.player)) {
        throw new Error('O player informado já está na sala');
      }

      const result = await this.gameStateService.enterRoom(dto, this.LobbyGateway.server);
      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('leave-room')
  @HttpCode(200)
  async leaveRoom(@Body() dto: enterRoomDto) {
    try {
      if(!this.gameStateService.playerIsInRoom(dto.player)) {
        throw new Error('O player informado não está na sala');
      }

      const result = await this.gameStateService.leaveRoom(dto, this.LobbyGateway.server);
      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
