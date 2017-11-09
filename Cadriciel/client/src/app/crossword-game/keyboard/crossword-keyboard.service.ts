import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class CrosswordKeyboardService {
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

    public handleInput(charCode: number, i: number, j: number): boolean {
        const letter = String.fromCharCode(charCode).toLowerCase();
        if (this.isLetter(charCode)) {
            this.letterInputSubject.next(
                { letter: letter, i: i, j: j }
            );
            return true;
        } else if (this.isBackspace(charCode)) {
            this.backspaceSubject.next(
                { i: i, j: j }
            );
            return true;
        } else if (this.isArrowKey(charCode)) {
            this.arrowSubject.next(
                { charCode: charCode, i: i, j: j }
            );
            return true;
        }
        return false;
    }

    public isLeftArrow(keyCode: number): boolean {
        return keyCode === 37;
    }

    public isUpArrow(keyCode: number): boolean {
        return keyCode === 38;
    }

    private isLetter(keyCode: number): boolean {
        return keyCode >= 65 && keyCode <= 90;
    }

    private isBackspace(keyCode: number): boolean {
        return keyCode === 8;
    }

    private isArrowKey(keyCode: number): boolean {
        return keyCode >= 37 && keyCode <= 40;
    }
}
