import { Injectable, OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { GameStateService } from "src/shared/services/game-state/game-state.service";

@Injectable()
@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
export class LobbyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server
    connectedUsers = 0

    constructor(
        private readonly GameStateService: GameStateService
    ) {}

    onModuleInit() {
        this.server.on('connection', socket => {
            this.connectedUsers = this.connectedUsers + 1
            this.GameStateService.connectPlayer(this.connectedUsers, socket.id)
            socket.emit('youArePlayer', { playerNumber: this.connectedUsers, id: socket.id })
            
            if(this.connectedUsers === 2) {
                this.GameStateService.gameState.canEnter = true
                this.server.emit('canEnter', { canEnter: true })
            }
            
            socket.on('disconnect', () => {
                if(this.connectedUsers === 0) {
                    this.GameStateService.resetGameData();
                }
                else {
                    this.connectedUsers = this.connectedUsers - 1
                    this.server.emit('oponentLeavedServer')
                    this.GameStateService.gameState.canEnter = false
                    this.server.emit('canEnter', { canEnter: false })
                }
                
                if(this.connectedUsers === 0) {
                    this.GameStateService.resetGameData();
                }
            });
        })
    }
}
