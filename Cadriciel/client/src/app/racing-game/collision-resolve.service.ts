import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import * as THREE from 'three';
@Injectable()
export class CollisionResolveService {

  private vehicleMass: number;
  private elasticity: number;

  constructor() {
    this.vehicleMass = 5;
    this.elasticity = 1;
  }

  public resolveCollision(vehicleA: Vehicle, vehicleB: Vehicle, xCollisionPoint: number,
    zCollisionPoint: number, xCollisionPlanePoint, zCollisionPlanePoint) {

    const normal = this.calculateNormal(xCollisionPoint, zCollisionPoint, xCollisionPlanePoint, zCollisionPlanePoint);
    this.setCorrectNormalDirection(normal, vehicleA.getVehicle().position.x, vehicleA.getVehicle().position.z,
      vehicleB.getVehicle().position.x, vehicleB.getVehicle().position.z);
  }

  public calculateNormal(xCollisionPoint: number, zCollisionPoint: number, xCollisionPlanePoint, zCollisionPlanePoint): THREE.Vector3 {
    const dx = xCollisionPlanePoint - xCollisionPoint;
    const dz = zCollisionPlanePoint - zCollisionPoint;
    const normal = new THREE.Vector3(-dz, 0, dx);
    return normal;
  }

  public calculateDistanceVector(xPoint1: number, zPoint1: number, xPoint2: number, zPoint2: number): THREE.Vector3 {
    const dx = xPoint2 - xPoint1;
    const dz = zPoint2 - zPoint1;
    const vector = new THREE.Vector3(dx, 0, dz);
    return vector;
  }

  public setCorrectNormalDirection(normal: THREE.Vector3, xVehicleA: number, zvehicleA: number,
    xVehicleB: number, zvehicleB: number): void {
    const distanceVector = this.calculateDistanceVector(xVehicleB, zvehicleB, xVehicleA, zvehicleA);

    if ((distanceVector.x < 0 && normal.x > 0) || (distanceVector.x > 0 && normal.x < 0)) {
      normal.x = normal.x * -1;
    }
    if ((distanceVector.z < 0 && normal.z > 0) || (distanceVector.z > 0 && normal.z < 0)) {
      normal.z = normal.z * -1;
    }
    normal.normalize();
  }

  public calculateMomentOfInertia(vehicle: Vehicle, clockwise: boolean): number {
    // use the parallel axis theorem to get the moment of inertiua around the vehicle center of mass
    const boxLength = 0;
    const boxWidth = 0;
    const xVehicle = vehicle.getVehicle().position.x;
    const zVehicle = vehicle.getVehicle().position.z;
    const xBox = vehicle.getBoundingBox().position.x;
    const zBox = vehicle.getBoundingBox().position.z;
    const distance = Math.sqrt(Math.pow((xVehicle - xBox), 2) + Math.pow((zVehicle - zBox), 2));
    let inertia = ((this.vehicleMass / 12) * (Math.pow(boxLength, 2) +
      Math.pow(boxWidth, 2)) + (this.vehicleMass * (Math.pow(distance, 2))));
    // right hand rule
    if (clockwise) {
      inertia = inertia * -1;
    }
    return inertia;
  }

  public checkIfClockwise(angularVelocity: number) {
    if (angularVelocity < 0) {
      return true;
    }
    return false;
  }
}
