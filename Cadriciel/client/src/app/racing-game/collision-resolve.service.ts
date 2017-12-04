import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import { CollisionResolvedEventService, CollisionResolvedEvent } from './events/collision-resolved-event.service';
import * as THREE from 'three';

@Injectable()
export class CollisionResolveService {
    constructor(private collisionResolvedEventService: CollisionResolvedEventService) { }

    public resolveCollision(event: CollisionEvent): void {
        const velocityA = event.getFirstVehicle().getController().getSpeed().clone();
        const velocityB = event.getSecondVehicle().getController().getSpeed().clone();
        const angularVelocityA = event.getFirstVehicle().getController().getAngularVelocity().clone();
        const angularVelocityB = event.getSecondVehicle().getController().getAngularVelocity().clone();
        const vehicleA = event.getFirstVehicle();
        const vehicleB = event.getSecondVehicle();
        this.handleVehicleSpeeds(vehicleA, velocityB, angularVelocityB);
       this.handleVehicleSpeeds(vehicleB, velocityA, angularVelocityA);
   //  this.handleVehiclePosition(vehicleA, velocityB, angularVelocityB);
      //  this.handleVehiclePosition(vehicleB, velocityA, angularVelocityA);

       /* const positionA = vehicleA.getVehicle().position.clone();
        const positionB = vehicleB.getVehicle().position.clone();
        const cx1 = positionA.x;
        const cx2 = positionB.x;
        const cy1 = positionA.z;
        const cy2 = positionB.z;
        const d = Math.sqrt(Math.pow(cx1 - cx2, 2) + Math.pow(cy1 - cy2, 2)); 
        const nx = (cx2 - cx1) / d;
        const ny = (cy2 - cy1) / d;
        const p = 2 * (velocityA.x * nx + velocityA.z * ny - velocityB.x * nx - velocityB.z * ny) / (10);
        const vx1 = velocityA.x - p * 5 * nx;
        const vy1 = velocityA.z - p * 5 * ny; 
        const vx2 = velocityB.x + p * 5 * nx; 
        const vy2 = velocityB.z + p * 5  * ny;

        const vaf = new THREE.Vector3(vx1, 0 , vy1);
        const vbf = new THREE.Vector3(vx2, 0 , vy2);

        this.handleVehicleSpeeds(vehicleA, vaf, angularVelocityB);
        this.handleVehicleSpeeds(vehicleB, vbf, angularVelocityA);
    this.handleVehiclePosition(vehicleA, vaf, angularVelocityB);
      this.handleVehiclePosition(vehicleB, vbf, angularVelocityA); */ 


        this.collisionResolvedEventService.sendCollisionResolvedEvent(new CollisionResolvedEvent());
    }

    private handleVehicleSpeeds(vehicle: Vehicle, finalVelocity: THREE.Vector3, finalAngularVelocity: THREE.Vector3): void {
        vehicle.getController().setLinearVelocity(finalVelocity);
      //  vehicle.getController().setAngularVelocity(finalAngularVelocity);
    }

    private handleVehiclePosition(vehicle: Vehicle, velocity: THREE.Vector3, angularVelocity: THREE.Vector3) {
        vehicle.getVehicle().position.x += velocity.x;
        vehicle.getVehicle().position.z += velocity.z;
      //  vehicle.getVehicle().rotation.y += velocity.y;
    }
}
