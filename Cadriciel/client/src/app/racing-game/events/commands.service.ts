import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CommandsService {
    private subjectEventKeyDown = new Subject();
    private subjectEventKeyUp = new Subject();

    public sendKeyDownEvent(event) {
            this.subjectEventKeyDown.next(event);
    }

    public getKeyDownEvent(): Observable<any> {
        return this.subjectEventKeyDown.asObservable();
    }

    public sentKeyUpEvent(event) {
        this.subjectEventKeyUp.next(event);
    }

    public getKeyUpEvent(): Observable<any> {
        return this.subjectEventKeyUp.asObservable();
    }
}
