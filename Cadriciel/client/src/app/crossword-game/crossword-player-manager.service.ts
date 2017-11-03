import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';
import { PlayerHandlerService } from './crossword-player-handler.service';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';

@Injectable()
export class PlayerManagerService {
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    private player: Player;
    private socket: SocketIOClient.Socket;

    constructor(private playerHandlerService: PlayerHandlerService, private socketHandlerSerivce: SocketHandlerSerivce) {
        this.player = this.playerHandlerService.requestPlayer();
        this.socket = this.socketHandlerSerivce.requestSocket(this.HOST_NAME + this.SERVER_PORT);
        this.player.setSocketID(this.socket.id);
    }

    public getPlayer(): Player {
        return this.player;
    }
}
