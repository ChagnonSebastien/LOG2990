import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { RenderService } from './render.service';
@Injectable()
export class RacingGameService {
    private vehicle: Vehicle;

    constructor(private render: RenderService) {}

    public initializeVehicle() {
        this.vehicle = new Vehicle();
        this.render.scene.add(this.vehicle.vehicle);
    }




}
