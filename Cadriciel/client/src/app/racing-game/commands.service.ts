import { Injectable } from '@angular/core';

// tslint:disable-next-line:no-unused-variable
enum Commands {
    ACCELETATE, TURN_LEFT, TURN_RIGHT, CAMERA_VIEW,
    NIGHT_MODE, COLOR_BLIND_MODE, ZOOM
}

@Injectable()
export class CommandsService {

    public keyDownEvent(event) {

    }

    public keyUpEvent(event) {

    }
}
