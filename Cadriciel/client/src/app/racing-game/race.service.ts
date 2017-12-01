import { Injectable } from '@angular/core';
import { Settings } from './settings';
import * as THREE from 'three';

const HUB = 'hub';
@Injectable()
export class RaceService {
    public planeHud: THREE.Mesh;

    constructor() {
        this.initializeHub();
    }

    private initializeHub() {
        const geometry = new THREE.PlaneGeometry(10 * Settings.SCENE_SCALE, 5 * Settings.SCENE_SCALE, 32 * Settings.SCENE_SCALE);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        this.planeHud = new THREE.Mesh(geometry, material);
        this.planeHud.name = HUB;
    }
}
