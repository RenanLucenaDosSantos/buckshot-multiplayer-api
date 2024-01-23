import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LobbyModule } from './modules/lobby/lobby.module';

@Module({
  imports: [LobbyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
