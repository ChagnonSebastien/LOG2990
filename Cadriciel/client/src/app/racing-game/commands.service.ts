import { Injectable } from '@angular/core';
import * as THREE from 'three';

enum Commands {
    ACCELETATE, TURN_LEFT, TURN_RIGHT, CAMERA_VIEW,
    NIGHT_MODE, COLOR_BLIND_MODE, ZOOM
}

@Injectable()
export class CommandsService {

    private keyDownEvent(event) {

    }

    private keyUpEvent(event) {

    }
}
