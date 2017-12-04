import { VehicleRotateEvent } from './events/vehicle-rotate-event.service';
import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { VehicleMoveEvent } from './events/vehicle-move-event.service';

@Injectable()
export class VehicleMovementController {
    constructor(
        private countdownService: CountdownService
    ) { }

    public validateMovement(event: VehicleMoveEvent): void {
        if (!this.countdownService.countdownEnded) {
            event.cancel();
        }
    }

    public validateRotation(event: VehicleRotateEvent): void {
        if (!this.countdownService.countdownEnded) {
            event.cancel();
        }
    }

}
