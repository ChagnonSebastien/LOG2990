import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// tslint:disable-next-line:no-unused-variable

@Injectable()
export class CommandsService {
    private subjectEventKeyDown = new Subject();
    private subjectEventKeyUp = new Subject();

    public sendKeyDownEvent(event: any) {
            this.subjectEventKeyDown.next(event);
    }

    public getKeyDownEvent(): Observable<any> {
        return this.subjectEventKeyDown.asObservable();
    }

    public sentKeyUpEvent(event: any) {
        this.subjectEventKeyUp.next(event);
    }

    public getKeyUpEvent(): Observable<any> {
        return this.subjectEventKeyUp.asObservable();
    }
}
