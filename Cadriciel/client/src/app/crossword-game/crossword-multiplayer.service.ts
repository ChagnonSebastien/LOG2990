import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import {CrosswordGameInfoService} from './crossword-game-info.service';
import { Game } from '../../../../commun/crossword/game';
import * as io from 'socket.io-client';
@Injectable()
export class MultiplayerService {
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    public missingPlayer = false;
    private socket: SocketIOClient.Socket;
    public currentGame: Game;

    constructor(private http: Http, private router: Router, private route: ActivatedRoute,
        private crosswordGameInfoService: CrosswordGameInfoService) {
        this.socket = io.connect(this.HOST_NAME + this.SERVER_PORT);

        this.socket.on('gameCreated', data => {
            console.log('Game Created! ID is: ' + data.id);
            console.log(data.username1 + ' created Game: ' + data.id);
            alert('Game Created! ID is: ' + JSON.stringify(data));
          });
          this.socket.on('allGames', data => {
            this.getGames();
          });
          this.socket.on('player 2 joined a game', data => {
            this.currentGame = data;
            this.crosswordGameInfoService.game = this.currentGame;
            this.router.navigate([`/crossword-test`], { relativeTo: this.route });
          });
          this.socket.on('player 2 joined your game', data => {
            this.currentGame = data;
            this.crosswordGameInfoService.game = this.currentGame;
            this.router.navigate([`/crossword-test`], { relativeTo: this.route });
          });
    }
    public sendGame(difficulty: string, mode: string, username: string ) {
        this.socket.emit('createGame', difficulty, mode, username );
    }
    public getGames() {
        this.socket.emit('getGames');
        const gamesPromise = new Promise<Game[]>(
            (res, rej) => this.socket.on('allGames', data => res(data)));

            return gamesPromise;
    }
    public joinGame(gameId: string, username: string) {
        this.socket.emit('joinGame', gameId, username);
    }
 }

