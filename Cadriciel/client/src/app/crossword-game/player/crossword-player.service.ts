import { Injectable } from '@angular/core';

@Injectable()
export class CrosswordPlayerService {
    public username: string;

    constructor() {
        this.username = '';
    }
}
