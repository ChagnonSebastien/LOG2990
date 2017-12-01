import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { HumanController } from './human-controller';
import { Injectable } from '@angular/core';

@Injectable()
export class ControllerFactory {
    constructor(private vehicleMoveEventService: VehicleMoveEventService, private vehicleRotateEventService: VehicleRotateEventService) {
    }

    public newHumanController() {
        return new HumanController(this.vehicleMoveEventService, this.vehicleRotateEventService);
    }
}
