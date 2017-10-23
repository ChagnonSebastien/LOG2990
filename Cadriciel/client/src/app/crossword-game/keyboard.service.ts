import { Injectable } from '@angular/core';

@Injectable()
export class KeyboardService {
    constructor() { }

    public isLetter(keyCode: number) {
        return keyCode >= 65 && keyCode <= 90
            || keyCode >= 97 && keyCode <= 122;
    }

    public isBackspace(keyCode: number) {
        return keyCode === 8;
    }

    public isTab(keyCode: number) {
        return keyCode === 9;
    }

    public isArrowKey(keyCode: number) {
        return keyCode >= 37 && keyCode <= 40;
    }
}
