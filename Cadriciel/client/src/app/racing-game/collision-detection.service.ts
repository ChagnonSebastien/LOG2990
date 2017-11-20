import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
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

}
