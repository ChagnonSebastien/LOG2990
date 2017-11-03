import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';
import { PlayerHandlerService } from './crossword-player-handler.service';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';

@Injectable()
export class PlayerManagerService {
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    private player: Player;

    constructor(private playerHandlerService: PlayerHandlerService, private socketHandlerSerivce: SocketHandlerSerivce ) {
        this.player = playerHandlerService.requestPlayer();
        this.player.setsocketId(socketHandlerSerivce.requestSocket(this.HOST_NAME + this.SERVER_PORT));
    }

    public getPlayer(): Player {
        return this.player;
    }
}
