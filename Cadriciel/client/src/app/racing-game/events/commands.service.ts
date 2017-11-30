import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export enum PlayerCommand {
    MOVE_FORWARD,
    ROTATE_LEFT,
    ROTATE_RIGHT,
    TOGGLE_NIGHT_MODE,
    TOOGLE_CAMERA_VIEW,
    ZOOM_IN,
    ZOOM_OUT,
    START_GAME
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
            case 87:
            return PlayerCommand.MOVE_FORWARD;
            case 65:
            return PlayerCommand.ROTATE_LEFT;
            case 68:
            return PlayerCommand.ROTATE_RIGHT;
            case 78:
            return PlayerCommand.TOGGLE_NIGHT_MODE;
            case 67:
            return PlayerCommand.TOOGLE_CAMERA_VIEW;
            case 107:
            return PlayerCommand.ZOOM_IN;
            case 109:
            return PlayerCommand.ZOOM_OUT;
            case 32:
            return PlayerCommand.START_GAME;
            default:
            return null;
        }
    }
}
