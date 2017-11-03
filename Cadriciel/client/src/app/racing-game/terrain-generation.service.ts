import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class TerrainGenerationService {

    private track: Track;

    private textureSky: any;

    private scale: number;

    constructor() {

    }

    public generate(scene: THREE.Scene, track: Track, scale: number): void {
        this.scale = scale;
        const url = '../../assets/images/skybox/';
        const images = [url + 'xpos.png', url + 'xneg.png',
        url + 'ypos.png', url + 'yneg.png',
        url + 'zpos.png', url + 'zneg.png'];
        this.textureSky = THREE.ImageUtils.loadTextureCube(images);
        scene.add(this.generateTable(track));
    private generateTable(track: Track): THREE.Mesh {
        const maximumX = Math.max.apply(null, track.trackIntersections.map(intersection => intersection.x));
        const minimumX = Math.min.apply(null, track.trackIntersections.map(intersection => intersection.x));
        const maximumY = Math.max.apply(null, track.trackIntersections.map(intersection => intersection.y));
        const minimumY = Math.min.apply(null, track.trackIntersections.map(intersection => intersection.y));

        const tableMaterial = new THREE.MeshStandardMaterial ( {color: 0xF0F0F0, roughness: 0, metalness: 0, envMap: this.textureSky} );
        const tableGeometry = new THREE.PlaneGeometry(
            (this.scale * (maximumX - minimumX)) + (this.scale * 40 * 3),
            (this.scale * (maximumY - minimumY)) + (this.scale * 40 * 3),
            1,
            1
        );
        tableGeometry.rotateX(Math.PI / -2);
        const table = new THREE.Mesh(tableGeometry, tableMaterial);

        table.position.x = minimumX + ((maximumX - minimumX) / 2);
        table.position.z = minimumY + ((maximumY - minimumY) / 2);
        table.receiveShadow = true;
        return table;
    }

    private generateSegments(track: Track): THREE.Mesh[] {
        const material = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0, roughness: 0, envMap: this.textureSky});

        return track.trackIntersections.map((intersection, index, array) => {
            const fromPosition = intersection;
            const toPosition = array[index + 1 < array.length ? index + 1 : 0];

            const geometry = new THREE.PlaneGeometry(this.scale * this.getDistance(fromPosition, toPosition), this.scale * 20);
            geometry.rotateX(Math.PI / -2);

            const segmentMesh = new THREE.Mesh(geometry, material);

            segmentMesh.rotateY(- Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
            segmentMesh.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * this.scale;
            segmentMesh.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * this.scale;
            segmentMesh.position.y = 1;
            return segmentMesh;
        });
    }
}
