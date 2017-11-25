import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';

@Injectable()
export class VehicleMovementController {
    constructor(
        private vehicleMoveEventService: VehicleMoveEventService,
        private vehicleRotateEventService: VehicleRotateEventService,
        private countdownService: CountdownService
    ) {
        this.vehicleMoveEventService.getVehicleMoveObservable().subscribe(moveEvent => {
            if (!this.countdownService.countdownEnded) {
                moveEvent.cancel();
            }
        });

        this.vehicleRotateEventService.getVehicleRotateObservable().subscribe(rotateEvent => {
            if (!this.countdownService.countdownEnded) {
                rotateEvent.cancel();
            }
        });
    }

}
