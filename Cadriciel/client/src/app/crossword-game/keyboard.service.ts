import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class KeyboardService {
    private letterInputSubject: Subject<any>;
    private backspaceSubject: Subject<any>;
    private arrowSubject: Subject<any>;

    constructor() {
        this.letterInputSubject = new Subject();
        this.backspaceSubject = new Subject();
        this.arrowSubject = new Subject();
    }

    public letterInputAlerts(): Observable<any> {
        return this.letterInputSubject.asObservable();
    }

    public backspaceAlerts(): Observable<any> {
        return this.backspaceSubject.asObservable();
    }

    public arrowAlerts(): Observable<any> {
        return this.arrowSubject.asObservable();
    }

    public handleInput(event: KeyboardEvent, i: number, j: number) {
        const charCode = event.which || event.keyCode;
        const letter = String.fromCharCode(charCode).toLowerCase();

        if (this.isLetter(charCode)) {
            this.letterInputSubject.next(
                { letter: letter, i: i, j: j }
            );
        } else if (this.isBackspace(charCode)) {
            this.backspaceSubject.next(
                { i: i, j: j }
            );
        } else if (this.isArrowKey(charCode)) {
            this.arrowSubject.next(
                { charCode: charCode, i: i, j: j }
            );
        }
        this.disableEvent(event);
    }

    private disableEvent(event: any): void {
        event.preventDefault();
        event.returnValue = false;
    }

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

    private whichArrow(arrowCode: number) {
        switch (arrowCode) {
            case 37:
                return 'left';
            case 38:
                return 'up';
            case 39:
                return 'right';
            case 40:
                return 'down';
        }
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
