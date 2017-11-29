import { LoadingProgressEvent, LoadingProgressEventService } from './events/loading-progress-event.service';
import { Track } from './track';
import { VehicleColor } from './vehicle-color';
import * as THREE from 'three';
import { Controller } from './controller';
import { Mesh, Vector2 } from 'three';
import { Settings } from './settings';

const distanceBetweenCars = 5;

const assetsPath = '/assets';
const redCarPath = 'red_cart.json';
const greenCarPath = 'green_cart.json';
const blueCarPath = 'blue_cart.json';
const yellowCarPath = 'yellow_cart.json';

export class Vehicle {
    private vehicle: THREE.Mesh;

    private boundingBox: THREE.Mesh;

    constructor(
        private color: VehicleColor,
        track: Track,
        private controller: Controller,
        private loadingProgressEventService: LoadingProgressEventService
    ) {
        this.create3DVehicle(track, color);
    }

    public getController(): Controller {
        return this.controller;
    }

    public getColor(): VehicleColor {
        return this.color;
    }

    public getVehicle(): THREE.Mesh {
        return this.vehicle;
    }

    public setBoundingBox(boundingBox: Mesh) {
        this.vehicle.add(boundingBox);
        this.boundingBox = boundingBox;
    }

    public getBoundingBox(): THREE.Mesh {
        return this.boundingBox;
    }

    public hitWall(speedModifier: number) {
        this.controller.hitWall(speedModifier);
    }

    public create3DVehicle(track: Track, carPosition: VehicleColor) {
        const service = this;
        const trackCenter = this.getCenterOfTrack(track);
        const trackAngle = this.getTrackAngle(track);
        const beta = this.calculateBeta(carPosition, trackAngle);
        new THREE.ObjectLoader().load(`${assetsPath}/${this.getCartPath(carPosition)}`, (object: THREE.Object3D) => {
            this.vehicle = <THREE.Mesh>object;
            this.vehicle.rotation.y = trackAngle;
            this.vehicle.position.x = (trackCenter.x + Math.cos(beta) * distanceBetweenCars) * Settings.SCENE_SCALE;
            this.vehicle.position.z = (trackCenter.y + Math.sin(beta) * distanceBetweenCars) * Settings.SCENE_SCALE;
            this.vehicle.position.y = 3;
            this.vehicle.scale.set(Settings.SCENE_SCALE, Settings.SCENE_SCALE, Settings.SCENE_SCALE);
            this.vehicle.castShadow = true;
            service.loadingProgressEventService.sentLoadingEvent(new LoadingProgressEvent('Vehicle created', service));
        });
    }

    private getCartPath(carPosition: VehicleColor) {
        switch (carPosition) {
            case VehicleColor.red:
                return redCarPath;
            case VehicleColor.blue:
                return blueCarPath;
            case VehicleColor.green:
                return greenCarPath;
            case VehicleColor.yellow:
                return yellowCarPath;
        }
    }

    private getCenterOfTrack(track: Track): THREE.Vector2 {
        const fromPosition = track.trackIntersections[0];
        const toPosition = track.trackIntersections[1];
        const segment = new THREE.Vector2().subVectors(toPosition, fromPosition);
        const segmentCenter = new THREE.Vector2().addVectors(fromPosition, segment.multiplyScalar(0.5));
        const startCarsOffset = segment.clone().normalize().multiplyScalar(-10);
        const startPosition = new THREE.Vector2().addVectors(segmentCenter, startCarsOffset);

        return startPosition;
    }

    private getTrackAngle(track: Track): number {
        const fromPosition = track.trackIntersections[0];
        const toPosition = track.trackIntersections[1];
        const rawAngle = -Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x));
        return ((toPosition.x - fromPosition.x >= 0) ? rawAngle : rawAngle + Math.PI) - Math.PI / 2;
    }

    private calculateBeta(vehicleColor: VehicleColor, trackCenterAngle: number): number {
        return Math.PI / 4 - trackCenterAngle + ((vehicleColor - 1) * (Math.PI / 2));
    }
}
