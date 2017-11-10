import { Injectable } from '@angular/core';

@Injectable()
export class CrosswordPlayerService {
    public username: string;
    public isHost: boolean;

    constructor() {
        this.username = '';
        this.isHost = false;
    }
}
