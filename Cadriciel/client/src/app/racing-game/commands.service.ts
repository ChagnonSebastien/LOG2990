import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// tslint:disable-next-line:no-unused-variable
enum Commands {
    ACCELETATE, TURN_LEFT, TURN_RIGHT, CAMERA_VIEW,
    NIGHT_MODE, COLOR_BLIND_MODE, ZOOM
}

@Injectable()
export class CommandsService {
    private subject = new Subject();

    public sendKeyDownEvent(event: any) {
            this.subject.next(event);
    }

    public getKeyDownEvent(): Observable<any> {
        return this.subject.asObservable();
    }
}
