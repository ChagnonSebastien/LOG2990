import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
@Injectable()
export class RacingGameService {
    public vehicle: Vehicle;

    constructor() {
    }

    public initializeVehicle(): Vehicle {
        this.vehicle = new Vehicle();
        console.log("finished creating vehicle");
        return this.vehicle;
    }

}
