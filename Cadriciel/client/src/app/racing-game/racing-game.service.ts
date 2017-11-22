import { CameraService } from './camera.service';
import { Track } from './track';
import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { RenderService } from './render.service';
import { VehicleService } from './vehicle.service';
import { Light } from './light';
import { SpotLight } from 'three';
import * as THREE from 'three';

const numberOfOpponents = 3;
const scale = 25;

@Injectable()
export class RacingGameService {
    private track: Track;

    private light: Light;

    constructor(private renderService: RenderService, private vehicleService: VehicleService,
                private countdownService: CountdownService, private cameraService: CameraService) {
        this.listenForEndOfCountdown();
    }

    public async initializeRender(container: HTMLElement, track: Track): Promise<void> {
        this.track = track;
        this.renderService.initialize(container, track, scale);
        await this.addVehicles();
        this.cameraService.initializeCameras(this.renderService.container, this.vehicleService.mainVehicle.getVehicle(), scale * 4);
        await this.createCoundown();
        this.renderService.startRenderingLoop();
    }

    private async addVehicles(): Promise<void> {
        await this.vehicleService.initializeMainVehicle(this.track, scale);
        await this.vehicleService.initializeOpponentsVehicles(this.track, scale);
        this.light = new Light();
        // this.light.sphere.position.setX(0);
        // this.light.sphere.position.setY(1.1);
        // this.light.sphere.position.setZ(-3.2);
        const target = new THREE.Object3D();
        this.vehicleService.mainVehicle.getVehicle().add(target);
        target.position.set(0, 0, -4);
        this.vehicleService.mainVehicle.getVehicle().add(this.light.spot);
        this.light.spot.position.setX(0);
        this.light.spot.position.setY(1.1);
        this.light.spot.position.setZ(-3.2);
        this.light.spot.target = target;
        this.renderService.scene.add(this.vehicleService.mainVehicle.getVehicle());
        console.log(this.light.spot);
        console.log(this.vehicleService.mainVehicle);

        for (let i = 0; i < numberOfOpponents; i++) {
            this.renderService.scene.add(this.vehicleService.opponentsVehicles[i].getVehicle());
        }

        return new Promise<void>(resolve => {
            resolve();
        });
    }

    private async createCoundown() {
        await this.countdownService.createCountdown(this.track, scale);
        this.renderService.scene.add(this.countdownService.countdownMesh);
    }

    private listenForEndOfCountdown() {
        this.countdownService.countdownEndedAlerts().subscribe(() => {
            this.removeCountdown();
        });
    }

    private removeCountdown() {
        const selectedObject = this.renderService.scene.getObjectByName(this.countdownService.countdownMesh.name);
        this.renderService.scene.remove( selectedObject );
    }

}
