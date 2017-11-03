import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class RacingGameService {
    public vehicle: Vehicle;
    private vehicleSubject: Subject<any>;

    constructor() {
        this.vehicleSubject = new Subject();
        this.vehicle = new Vehicle();        
        this.alertWhenVehicleIsInitialized();
        console.log('constructo racinggame');
        this.initializeVehicle();
    }

    public async initializeVehicle() {
        this.vehicle.createVehicle();
        // this.alertVehicle();
        console.log("racing-game.initvehicle");
    }

    public vehicleAlerts(): Observable<any> {
        return this.vehicleSubject.asObservable();
    }

    private alertVehicle() {
        this.vehicleSubject.next(this.vehicle.vehicle);
    }

    private alertWhenVehicleIsInitialized() {
        this.vehicle.vehicleAlert().subscribe((result) => {
            this.alertVehicle();
        });
    }

}
