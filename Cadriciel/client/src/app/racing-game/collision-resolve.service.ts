import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import * as THREE from 'three';
@Injectable()
export class CollisionResolveService {

  constructor() { }

  private resolveCollision(vehicleA: Vehicle, vehicleB: Vehicle, xCollisionPoint: number,
    zCollisionPoint: number, xCollisionPlanePoint, zCollisionPlanePoint) {

  }

  private calculateNormal(xCollisionPoint: number, zCollisionPoint: number, xCollisionPlanePoint, zCollisionPlanePoint): THREE.Vector3 {
    const dx = xCollisionPlanePoint - xCollisionPoint;
    const dz = zCollisionPlanePoint - zCollisionPoint;
    const normal = new THREE.Vector3(-dz, 0, dx);
    return normal;
  }

  private calculateDistanceVector(xPoint1: number, zPoint1: number, xPoint2: number, zPoint2: number): THREE.Vector3 {
    const dx = xPoint2 - xPoint1;
    const dz = zPoint2 - zPoint1;
    const vector = new THREE.Vector3(dx, 0, dz);
    return vector;
  }

  private getCorrectNormalDirection(normal: THREE.Vector3, vehicleA: Vehicle, vehicleB: Vehicle): void {
    const distanceVector = this.calculateDistanceVector(vehicleA.getVehicle().position.x,
      vehicleA.getVehicle().position.z, vehicleB.getVehicle().position.x, vehicleB.getVehicle().position.z);

    if ((distanceVector.x < 0 && normal.x > 0) || (distanceVector.x > 0 && normal.x < 0)
      || (distanceVector.z < 0 && normal.z > 0) || (distanceVector.z > 0 && normal.z < 0)) {
      normal.z = normal.z * -1;
    }
  }

}
