import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import {Settings} from './settings';
import * as THREE from 'three';

@Injectable()
export class CollisionResolveService {
    constructor() {}
    public resolveCollision(event: CollisionEvent): void {
        // get data from event
        const velocityA = event.getFirstVehicle().getController().getSpeed().clone();
        const velocityB = event.getSecondVehicle().getController().getSpeed().clone();
        const vehicleA = event.getFirstVehicle();
        const vehicleB = event.getSecondVehicle();
        const positionA = vehicleA.getVehicle().position.clone();
        const positionB = vehicleB.getVehicle().position.clone();
        const distance = positionA.distanceTo(positionB);

        const normX = this.computeNorm(positionA.x, positionB.x, distance);
        const normZ = this.computeNorm(positionA.z, positionB.z, distance);
        const relationFactor = this.calculateRelationFactor(velocityA, velocityB, normX, normZ);

        const vx1 = velocityA.x - relationFactor * Settings.VEHICLE_MASS * normX;
        const vy1 = velocityA.z - relationFactor * Settings.VEHICLE_MASS * normZ;
        const vx2 = velocityB.x + relationFactor * Settings.VEHICLE_MASS * normX;
        const vy2 = velocityB.z + relationFactor * Settings.VEHICLE_MASS * normZ;

        const finalVelocityA = new THREE.Vector3(vx1, 0, vy1);
        const finalVelocityB = new THREE.Vector3(vx2, 0, vy2);
        this.setVehicleSpeeds(vehicleA, finalVelocityA);
        this.setVehicleSpeeds(vehicleB, finalVelocityB);
    }

    private setVehicleSpeeds(vehicle: Vehicle, finalVelocity: THREE.Vector3): void {
        vehicle.getController().setLinearVelocity(finalVelocity);
    }

    private computeDistance(positionA: THREE.Vector3, positionB: THREE.Vector3): number {
        return positionA.distanceTo(positionB);
    }

    private computeNorm(aPosition: number, bPosition: number, distance: number): number {
        return ((bPosition - aPosition) / distance);
    }

    // derived from conservation of momentum and conversation of energy in a elastic collision
    private calculateRelationFactor(velocityA: THREE.Vector3, velocityB: THREE.Vector3, normX: number, normZ: number): number {
        return 2 * (velocityA.x * normX + velocityA.z * normZ - velocityB.x * normX - velocityB.z * normZ) / (2 * Settings.VEHICLE_MASS);
    }

}
