import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as io from 'socket.io-client';
@Injectable()
export class MultiplayerService {
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    public missingPlayer = false;
    private socket: SocketIOClient.Socket;

    constructor(private http: Http) {
        this.socket = io.connect(this.HOST_NAME + this.SERVER_PORT);

        this.socket.on('gameCreated', function (data) {
            console.log('Game Created! ID is: ' + data.gameId);
            console.log(data.username1 + ' created Game: ' + data.gameId);
            alert('Game Created! ID is: ' + JSON.stringify(data));
          });
    }

    public sendGame(difficulty: string, mode: string, username: string ) {
        this.socket.emit('createGame', difficulty, mode, username );
        }

    }
