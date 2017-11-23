import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { CountdownDecreaseEvent } from './events/countdown-decrease-event';
import { RaceService } from './race.service';
import { CountdownService } from './countdown.service';
import { CommandsService } from './events/commands.service';
import { Controller, MOVE_STATE, TURN_STATE } from './controller';
import { CollisionDetectionService } from './collision-detection.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';

export class HumanController extends Controller {

    constructor(
        private commandsService: CommandsService,
        private countdownService: CountdownService,
        private raceService: RaceService,
        collisionDetectionService: CollisionDetectionService,
        vehicleMoveEventService: VehicleMoveEventService,
        vehicleRotateEventService: VehicleRotateEventService
    ) {
        super(collisionDetectionService, vehicleMoveEventService, vehicleRotateEventService);
        this.commandsService.getKeyDownEvent().subscribe(event => {
            this.moveVehicle(event);
        });

        this.commandsService.getKeyUpEvent().subscribe(event => {
            this.stopVehicle(event);
        });
    }

    private moveVehicle(event) {
        if (event.keyCode === 87) {
            this.moveState = MOVE_STATE.MOVE_FORWARD;
        }
        if (event.keyCode === 65) {
            this.turnState = TURN_STATE.TURN_LEFT;
        }
        if (event.keyCode === 68) {
            this.turnState = TURN_STATE.TURN_RIGHT;
        }
    }

    private stopVehicle(event) {
        if (event.keyCode === 87) {
            this.moveState = MOVE_STATE.BRAKE;
        }

        if (event.keyCode === 65 || event.keyCode === 68) {
            this.turnState = TURN_STATE.DO_NOTHING;
        }
    }
}
