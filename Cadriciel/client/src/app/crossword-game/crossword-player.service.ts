import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';


@Injectable()
export class CrosswordPlayerService {
    public username: string;

    constructor() {
        this.username = '';
    }
}
