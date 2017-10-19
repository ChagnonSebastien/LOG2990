import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import {CrosswordGameInfoService} from './crossword-game-info.service';
import { Game } from '../../../../../commun/crossword/game';
import * as io from 'socket.io-client';

@Injectable()
export class MultiplayerService {
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    public missingPlayer = false;
    private socket: SocketIOClient.Socket;
    public currentGame: Game;
    public opponentActiveIndexes: Index[] = [];
    public opponentCorrectIndexes: Index[] = [];
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
              console.log(this.socket.id);
            this.currentGame = data;
            this.crosswordGameInfoService.game = this.currentGame;
            this.router.navigate([`/crossword-test`], { relativeTo: this.route });
          });
          this.socket.on('opponent selected a grid sqaure', data => {
            this.opponentActiveIndexes = data;
          });
          this.socket.on('opponent found a word', data => {
             /* data.forEach(index => {
                 if (this.opponentCorrectIndexes.indexOf(index) === -1) {
                 this.opponentCorrectIndexes.push(index);
                 }
              });*/
              this.opponentCorrectIndexes = data;
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
    public selectHint(indexes: Index[]) {
        this.socket.emit('i selected a word hint', indexes, this.getOpponentSocketId());
    }
    public opponentFoundWord(indexes: Index[]) {
        this.socket.emit('i found a word', indexes, this.getOpponentSocketId());
    }
    public checkIfOpponentSelected(i: number, j: number) {
        for (let k = 0; k < this.opponentActiveIndexes.length; k++) {
            if (this.opponentActiveIndexes[k].i === i && this.opponentActiveIndexes[k].j === j) {
                return true;
            }
        }
        return false;
    }
    public checkIfOpponentFoundWord(indexes: Index[]) {
        for (let p = 0 ; p < indexes.length ; p++) {
                if (this.myIndexOf(indexes[p]) === -1) {
                    return false;
             }
        }
        return true;
    }
    public myIndexOf(index: Index) {
        for (let i = 0; i < this.opponentCorrectIndexes.length; i++) {
            if (this.opponentCorrectIndexes[i].i === index.i && this.opponentCorrectIndexes[i].i === index.i) {
                return i;
            }
        }
        return -1;
    }
    public getOpponentSocketId() {
        if (this.currentGame.socketId1 === this.socket.id) {
            return this.currentGame.socketId2;
        } else {
            return this.currentGame.socketId1;
        }
    }
 }

/***********************************************************
* Interface used for the positon of a crossword grid
***************************************************************/
interface Index {
    i: number;
    j: number;
}
