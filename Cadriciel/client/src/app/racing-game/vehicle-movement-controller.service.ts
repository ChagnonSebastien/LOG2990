import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { VehicleMoveEvent } from './events/vehicle-move-event.service';

@Injectable()
export class VehicleMovementController {
    constructor(
        private vehicleRotateEventService: VehicleRotateEventService,
        private countdownService: CountdownService
    ) {
        this.vehicleRotateEventService.getVehicleRotateObservable().subscribe(rotateEvent => {
            if (!this.countdownService.countdownEnded) {
                rotateEvent.cancel();
            }
        });
    }

    public validateMovement(event: VehicleMoveEvent): void {
        if (!this.countdownService.countdownEnded) {
            event.cancel();
        }
    }

}
