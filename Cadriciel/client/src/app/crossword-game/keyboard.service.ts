import { Injectable } from '@angular/core';

@Injectable()
export class KeyboardService {
    constructor() { }

    public isLetter(keyCode: number) {
        return keyCode >= 65 && keyCode <= 90;
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

    public isLeftArrow(keyCode: number) {
        return keyCode === 37;
    }

    public isRightArrow(keyCode: number) {
        return keyCode === 39;
    }

    public isUpArrow(keyCode: number) {
        return keyCode === 38;
    }

    public isDownArrow(keyCode: number) {
        return keyCode === 40;
    }
}
