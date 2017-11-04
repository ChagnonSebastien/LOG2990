import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

const numberOfOpponents = 3;
@Injectable()
export class RacingGameService {
    public mainVehicle: Vehicle;
    public opponentsVehicles: Array<Vehicle>;
    public mainVehicleTest: Vehicle;
    public opponentsVehiclesTest: Array<Vehicle>;
    private vehicleSubject: Subject<any>;
    private opponentsSubject: Subject<any>;
    public numberOfVehiclesInitialized: number;

    constructor() {
        this.vehicleSubject = new Subject();
        this.opponentsSubject = new Subject();
        this.mainVehicle = new Vehicle();
        this.opponentsVehicles = [];
        this.mainVehicleTest = new Vehicle();
        this.opponentsVehiclesTest = [];
        this.numberOfVehiclesInitialized = 0;
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle();
        }

        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehiclesTest[i] = new Vehicle();
        }
        this.alertWhenVehicleIsInitialized();
        this.initializeVehicle();
        this.initializeOpponentsVehicles();
    }

    public async initializeVehicle() {
        this.mainVehicle.create3DVehicle(-150, 30, 0);
    }

    public initializeVehicleTest(): Promise<Vehicle> {
        return new Promise<Vehicle>(resolve => {
            this.mainVehicleTest.create3DVehicle(-150, 30, 0).then((vehicle) => {
                resolve(vehicle);
            });
        });
    }

    private initializeOpponentsVehicles() {
        this.opponentsVehicles[0].create3DVehicle(-150, 30, 200);
        this.opponentsVehicles[1].create3DVehicle(150, 30, 0);
        this.opponentsVehicles[2].create3DVehicle(150, 30, 200);
    }

    private async initializeOpponentsVehiclesTest(): Promise<Array<Vehicle>> {
        await this.opponentsVehiclesTest[0].create3DVehicle(-150, 30, 200);
        await this.opponentsVehiclesTest[1].create3DVehicle(150, 30, 0);
        await this.opponentsVehiclesTest[2].create3DVehicle(150, 30, 200);

        return new Promise<Array<Vehicle>>(resolve => {
            resolve(this.opponentsVehiclesTest);
        });
    }

    public vehicleAlerts(): Observable<any> {
        return this.vehicleSubject.asObservable();
    }

    public opponentsAlerts(): Observable<any> {
        return this.opponentsSubject.asObservable();
    }

    private alertVehicle() {
        this.vehicleSubject.next(this.mainVehicle.vehicle);
    }

    private alertOpponentsVehicles() {
        this.opponentsSubject.next(this.opponentsVehicles);
    }

    private alertWhenVehicleIsInitialized() {
        this.mainVehicle.vehicleAlert().subscribe((result) => {
            this.numberOfVehiclesInitialized++;
            if (this.numberOfVehiclesInitialized === 1) {
                this.alertVehicle();
            }
        });

        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i].vehicleAlert().subscribe((result) => {
                this.numberOfVehiclesInitialized++;
                if (this.numberOfVehiclesInitialized === 4) {
                    this.alertOpponentsVehicles();
                }
            });
        }
    }
}
