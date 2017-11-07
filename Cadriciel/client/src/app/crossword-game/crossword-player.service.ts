import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';


@Injectable()
export class CrosswordPlayerService {
    constructor() { }
    private activePlayer: Player;

    public requestPlayer(): Player {

        if (this.activePlayer === undefined) {
            this.activePlayer = new Player();
        }
        return this.activePlayer;
    }

}
