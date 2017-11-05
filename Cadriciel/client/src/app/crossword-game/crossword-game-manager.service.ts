import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Game } from '../../../../commun/crossword/game';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';

@Injectable()
export class GameManagerService {
    public socket: SocketIOClient.Socket;
    protected game: Game;
    protected readonly HOST_NAME = 'http://' + window.location.hostname;
    protected readonly SERVER_PORT = ':3000';
    protected playerTwoSubject: Subject<any>;

    constructor(protected socketHandlerSerivce: SocketHandlerSerivce) {
        this.playerTwoSubject = new Subject();
        this.game = new Game();
        this.socketHandlerSerivce.requestSocket(this.HOST_NAME + this.SERVER_PORT).then(socket => {
            this.socket = socket;

            this.socket.on('player 2 joined', data => {
                this.game = data;
                console.log(data);
                this.playerTwoSubject.next('player 2 joined');
            });

            this.socket.on('game created', data => {
                console.log(data);
                this.game.id = data;
            });
        });
    }

    public playerTwoAlerts(): Observable<any> {
        return this.playerTwoSubject.asObservable();
    }

    public getGame(): Game {
        return this.game;
    }

    public leaveGame(gameId: string, username: string) {
        this.socket.emit('leaveGame', gameId, username);
    }

    public connectionStatus() {
        return this.socket !== undefined;
    }
}
