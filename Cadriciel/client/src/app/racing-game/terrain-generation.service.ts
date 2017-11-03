import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class TerrainGenerationService {

    constructor() {

    }

    public generate(scene: THREE.Scene, track: Track): void {
        const url = '../../assets/images/skybox/';
        const images = [url + 'xpos.png', url + 'xneg.png',
        url + 'ypos.png', url + 'yneg.png',
        url + 'zpos.png', url + 'zneg.png'];
        const textureSky = THREE.ImageUtils.loadTextureCube(images);
        const tableMaterial = new THREE.MeshStandardMaterial ( {color: 0xF0F0F0, roughness: 0, metalness: 0, envMap: textureSky} );
        const tableGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.castShadow = true;
        table.receiveShadow = true;
        table.rotateX(Math.PI / -2);
        scene.add(table);
    }

}
