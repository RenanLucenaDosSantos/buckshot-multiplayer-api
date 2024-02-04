import { Injectable } from '@nestjs/common';
import { GameStateService } from '../game-state/game-state.service';
import { Server } from 'socket.io';
import { fireDto } from 'src/shared/dto/fire.dto';

@Injectable()
export class EmmiterService {
  constructor(
    private readonly GameStateService: GameStateService,
  ) { }

  fire(dto: fireDto, server: Server) {
    const actualHp = this.GameStateService.gameState[dto.target].hp
    
    if(dto.bullet) {
      this.GameStateService.gameState[dto.target].hp = actualHp - 1;
      this.GameStateService.gameState.actualTurnPlayer = dto.player === 'player1' ? 'player2' : 'player1'
    }

    if(!dto.bullet && dto.target !== dto.player) {
      this.GameStateService.gameState.actualTurnPlayer = dto.player === 'player1' ? 'player2' : 'player1'
    }

    this.GameStateService.gameState.shotgunAmmos.shift()
    
    const nextDto: any = [this.GameStateService.gameState, dto.target, dto.bullet]
    server.emit('fire', nextDto)

    if(this.GameStateService.gameState.shotgunAmmos.length < 1) this.GameStateService.reloadAmmo(server)
  }
}
