import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Player } from '../../../../commun/crossword/player';


@Injectable()
export class PlayerHandler {
    constructor() { }
    private activePlayer: Player;

    public requestPlayer(server: string): any {

        if (this.activePlayer === undefined) {
            this.activePlayer = new Player();
        }
        return this.activePlayer;
    }

}
