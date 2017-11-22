import { Injectable } from '@angular/core';
import * as THREE from 'three';
@Injectable()
export class CollisionDetectionService {
  private boundingBoxes: Map<THREE.Mesh, THREE.Box3>;

  constructor() {
    this.boundingBoxes = new Map<THREE.Mesh, THREE.Box3>();
  }

  public initializeBoundingBox(vehicle: THREE.Mesh) {
    const box = new THREE.Box3().setFromObject(vehicle);
    this.boundingBoxes.set(vehicle, box);
  }

  public testPrint(vehicle: THREE.Mesh) {
    console.log(this.boundingBoxes.get(vehicle));
  }

  public updateBox(vehicle: THREE.Mesh) {
    if (this.boundingBoxes.get(vehicle) !== undefined) {
      this.boundingBoxes.get(vehicle).setFromObject(vehicle);
    }
  }

  public getBox(vehicle: THREE.Mesh) {
    return this.boundingBoxes.get(vehicle);
  }

  public checkForCollisionWithCar(vehicle: THREE.Mesh) {
    const box = this.boundingBoxes.get(vehicle);
    for (const key of Array.from(this.boundingBoxes.keys())) {
      if (key !== vehicle) {
        if (box.intersectsBox(this.boundingBoxes.get(key))) {
          return true;
        }
      }
    }
    return false;
  }
}
