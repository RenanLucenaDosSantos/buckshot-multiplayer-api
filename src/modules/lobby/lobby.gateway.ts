import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "dgram";

@WebSocketGateway()
export class LobbyGateway {
    constructor() {}

    // @SubscribeMessage('events')
    // handleEvent(@MessageBody() data: string): string {
    //     return data;
    // }

    @SubscribeMessage('events')
    handleEvent(client: Socket, data: string): string {
        return data;
    }
}