import { Module } from '@nestjs/common';
import { LobbyService } from './services/lobby/lobby.service';
import { LobbyController } from './controllers/lobby/lobby.controller';
import { LobbyGateway } from './lobby.gateway';

@Module({
  providers: [LobbyService, LobbyGateway],
  controllers: [LobbyController]
})
export class LobbyModule {}
