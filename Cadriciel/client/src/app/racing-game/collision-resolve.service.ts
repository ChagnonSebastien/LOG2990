import { Injectable } from '@angular/core';
import * as THREE from 'three';
@Injectable()
export class CollisionResolveService {

  constructor() { }

  private resolveCollision(vehicleA: THREE.Mesh, vehicleB: THREE.Mesh, xCollisionPoint: number,
    zCollisionPoint: number, xCollisionPlanePoint, zCollisionPlanePoint) {

  }

  private calculateNormal(xCollisionPoint: number, zCollisionPoint: number, xCollisionPlanePoint, zCollisionPlanePoint): THREE.Vector3 {
    const dx = xCollisionPlanePoint - xCollisionPoint;
    const dz = zCollisionPlanePoint - zCollisionPoint;
    const normal = new THREE.Vector3(dx, 0, dz);
    return normal;
  }

  private calculateDistanceVector(xVehiculePoint: number , zVehiculePoint: number, xCollisionPoint, zCollisionPoint) {
    const dx = xCollisionPoint - xVehiculePoint;
    const dz = zCollisionPoint - zVehiculePoint;
    const vector = new THREE.Vector3(dx, 0, dz);
    return vector;
  }

}
