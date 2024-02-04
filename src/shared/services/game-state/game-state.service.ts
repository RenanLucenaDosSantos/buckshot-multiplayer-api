import { Injectable, NotFoundException } from '@nestjs/common';
import { enterRoomDto } from 'src/shared/dto/enter-room.dto';
import { GameState } from 'src/shared/interfaces/game-state.interface';
import { defaultGameState } from 'src/shared/types/default-game-state.type';
import { Server } from "socket.io";

@Injectable()
export class GameStateService {
    public gameState: GameState = new defaultGameState()
    
    // constructor(
    //   private readonly LobbyGateway: LobbyGateway
    // ) {}

    startGame(server: Server) {
      this.gameState.running = true
      this.gameState.shotgunAmmos = this.generateShotgunAmmos()
      this.gameState.player1.hp = 3
      this.gameState.player2.hp = 3

      const dto = this.gameState
      server.emit('gameStarted', dto)
    }

    endGame() {
      this.gameState.running = false
      this.gameState.player1.inRoom = false
      this.gameState.player2.inRoom = false
      this.gameState.shotgunAmmos = []
    }

    generateShotgunAmmos(): boolean[] {
      const length = Math.floor(Math.random() * (6 - 2 + 1)) + 2;
      const shotgunAmmos: boolean[] = [];
    
      shotgunAmmos.push(false);
      shotgunAmmos.push(true);
      
      for (let i = 2; i < length; i++) {
        const randomBoolean = Math.random() < 0.5;
        shotgunAmmos.push(randomBoolean);
      }
    
      for (let i = shotgunAmmos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shotgunAmmos[i], shotgunAmmos[j]] = [shotgunAmmos[j], shotgunAmmos[i]];
      }
    
      return shotgunAmmos;
    }

    reloadAmmo(server: Server) {
      this.gameState.shotgunAmmos = this.generateShotgunAmmos()
      server.emit('reloadShotgun', this.gameState.shotgunAmmos)
    }

    whoIsInTurn(): string {
      return this.gameState.actualTurnPlayer
    }

    connectPlayer(playerNumber: number, id: string) {
      if(playerNumber > 0 && playerNumber < 3) {
        this.gameState[`player${playerNumber}`].id = id
      }
    }

    disconnectPlayer(id: string) {
      const player1id = this.gameState.player1.id;
      const player2id = this.gameState.player2.id;
      if(!player1id || !player2id) {
        this.resetGameData()
        return
      }

      if(id === player1id) {
        this.gameState.player1.id = '';
      } else if(id === player2id) {
        this.gameState.player2.id = '';
      }
    }

    enterRoom(dto: enterRoomDto, server: Server) {
      // Errors
      if (dto.player !== 'player1' && dto.player !== 'player2') {
        throw new NotFoundException('Player não fornecido corretamente!');
      }
      if(!this.gameState.canEnter) {
        throw new NotFoundException('O lobby não está pronto para entrar!');
      }

      // Success
      this.gameState[dto.player].inRoom = true;
      server.emit('someoneEnteredRoom');

      if(this.bothPlayersInRoom) this.startGame(server) 
    }

    leaveRoom(dto: enterRoomDto, server: Server) {
      // Errors
      if (dto.player !== 'player1' && dto.player !== 'player2') {
        throw new NotFoundException('Player não fornecido corretamente!');
      }

      // Success
      server.emit('someoneleavedRoom', dto);
      this.gameState[dto.player].inRoom = false;

      if(this.gameState.running) {
        this.endGame()
      }
    }

    resetGameData() {
      this.gameState = new defaultGameState()
    }

    playerIsInRoom(player: string): boolean {
      return this.gameState[player].inRoom
    }
    
    get hasPlayerInRoom(): boolean {
      const player1status = this.gameState.player1.inRoom;
      const player2status = this.gameState.player2.inRoom;

      if(player1status || player2status) return true
      else return false
    }

    get bothPlayersInRoom(): boolean {
      const player1status = this.gameState.player1.inRoom;
      const player2status = this.gameState.player2.inRoom;

      if(player1status && player2status) return true
      else return false
    }
}
