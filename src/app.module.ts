import { Module } from '@nestjs/common';
import { GameStateService } from './shared/services/game-state/game-state.service';
import { LobbyController } from './app/controllers/lobby/lobby.controller';
import { GameController } from './app/controllers/game/game.controller';
import { LobbyGateway } from './app/gateways/lobby.gateway';
import { EmmiterService } from './shared/services/emmiter/emmiter.service';

@Module({
  imports: [],
  controllers: [LobbyController, GameController],
  providers: [LobbyGateway, GameStateService, EmmiterService],
})
export class AppModule {}
