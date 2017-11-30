import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { PlayerCommand } from './events/commands.service';
import { Controller, MOVE_STATE, TURN_STATE } from './controller';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';

export class HumanController extends Controller {

    constructor(
        vehicleMoveEventService: VehicleMoveEventService,
        vehicleRotateEventService: VehicleRotateEventService
    ) {
        super(vehicleMoveEventService, vehicleRotateEventService);
    }

    public startDirective(command: PlayerCommand) {
        switch (command) {
            case PlayerCommand.MOVE_FORWARD:
            this.moveState = MOVE_STATE.MOVE_FORWARD;
            break;
            case PlayerCommand.ROTATE_LEFT:
            this.turnState = TURN_STATE.TURN_LEFT;
            break;
            case PlayerCommand.ROTATE_RIGHT:
            this.turnState = TURN_STATE.TURN_RIGHT;
            break;
        }
    }

    public endDirective(command: PlayerCommand) {
        switch (command) {
            case PlayerCommand.MOVE_FORWARD:
            this.moveState = MOVE_STATE.BRAKE;
            break;
            case PlayerCommand.ROTATE_LEFT:
            case PlayerCommand.ROTATE_RIGHT:
            this.turnState = TURN_STATE.DO_NOTHING;
            break;
        }
    }
}
