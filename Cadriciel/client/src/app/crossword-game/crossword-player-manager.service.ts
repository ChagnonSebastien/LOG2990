import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';
import { CrosswordPlayerService } from './crossword-player.service';
import { CrosswordSocketService } from './crossword-socket.service';

@Injectable()
export class PlayerManagerService {
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    private player: Player;
    private socket: SocketIOClient.Socket;

    constructor(private playerHandlerService: CrosswordPlayerService, private socketHandlerSerivce: CrosswordSocketService) {
        this.player = this.playerHandlerService.requestPlayer();
        this.socketHandlerSerivce.requestSocket(this.HOST_NAME + this.SERVER_PORT).then(socket => {
            this.socket = socket;

            this.socket.on('connect', data => {
                console.log(socket.id);
                this.player.setSocketID(this.socket.id);
            });

            this.socket.on('opponent found word', data => {
                // call a service that handles the opponent found words
            });

            this.socket.on('selected hint', data => {
                // call a service that handles the opponent selected hints
            });
        });
    }

    public getPlayer(): Player {
        return this.player;
    }

    public emitWordFound(word: string) {
        // another service calls it to emit found word
        this.socket.emit('found of word', word, this.player.getSocketID());
    }

    public emitHintSelected(hint: string) {
        //another service calls it to emit hint selection 
        this.socket.emit('selected a word', hint, this.player.getSocketID());
    }
}
