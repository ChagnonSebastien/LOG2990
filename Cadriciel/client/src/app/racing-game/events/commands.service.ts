import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Settings } from '../settings';

export enum PlayerCommand {
    MOVE_FORWARD,
    ROTATE_LEFT,
    ROTATE_RIGHT,
    TOGGLE_NIGHT_MODE,
    TOOGLE_CAMERA_VIEW,
    ZOOM_IN,
    ZOOM_OUT,
    START_GAME,
    REAR_VISIBLE
}

export class CommandEvent {
    constructor(
        private command: PlayerCommand
    ) {}

    public getCommand(): PlayerCommand {
        return this.command;
    }
}

@Injectable()
export class CommandsService {
    private commandKeyDownEvent = new Subject<CommandEvent>();
    private commandKeyUpEvent = new Subject<CommandEvent>();

    public keyDown(event: any): void {
        this.commandKeyDownEvent.next(new CommandEvent(this.getCommand(event.keyCode)));
    }

    public keyUp(event: any): void {
        this.commandKeyUpEvent.next(new CommandEvent(this.getCommand(event.keyCode)));
    }

    public getCommandKeyDownObservable(): Observable<CommandEvent> {
        return this.commandKeyDownEvent.asObservable();
    }

    public getCommandKeyUpObservable(): Observable<CommandEvent> {
        return this.commandKeyUpEvent.asObservable();
    }

    private getCommand(keyNumber: number): PlayerCommand {
        switch (keyNumber) {
            case Settings.W:
            return PlayerCommand.MOVE_FORWARD;
            case Settings.A:
            return PlayerCommand.ROTATE_LEFT;
            case Settings.D:
            return PlayerCommand.ROTATE_RIGHT;
            case Settings.N:
            return PlayerCommand.TOGGLE_NIGHT_MODE;
            case Settings.C:
            return PlayerCommand.TOOGLE_CAMERA_VIEW;
            case Settings.ADD:
            return PlayerCommand.ZOOM_IN;
            case Settings.SUBSTRACT:
            return PlayerCommand.ZOOM_OUT;
            case Settings.SPACE:
            return PlayerCommand.START_GAME;
            case Settings.R:
            return PlayerCommand.REAR_VISIBLE;
            default:
            return null;
        }
    }
}
