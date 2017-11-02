import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const scale = 1;

@Injectable()
export class TerrainGenerationService {

    constructor() {

    }

    public generate(scene: THREE.Scene, track: Track): void {
        const tableMaterial = new THREE.MeshPhongMaterial ( {color: 0xFFFFFF} );
        const tableGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.set(0, 0, 100);
        table.rotateX(Math.PI);
        scene.add(table);
        scene.add(new THREE.AmbientLight(0xfff));
        console.log(2);
    }

}
