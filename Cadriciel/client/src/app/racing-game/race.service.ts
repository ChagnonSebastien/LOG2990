import { Injectable } from '@angular/core';
import * as THREE from 'three';

const HUB = 'hub';
@Injectable()
export class RaceService {
    public planeHub: THREE.Mesh;

    constructor() {
        this.initializeHub();
    }

    private initializeHub() {
        const geometry = new THREE.PlaneGeometry(5, 20, 32);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        this.planeHub = new THREE.Mesh(geometry, material);
        this.planeHub.name = HUB;
    }
}
