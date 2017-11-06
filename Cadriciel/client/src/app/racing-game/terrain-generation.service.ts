import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const trackRadius = 10;

@Injectable()
export class TerrainGenerationService {

    private track: Track;

    private scale: number;

    private textureSky: THREE.Texture;

    private decorElements: {object: THREE.Mesh, radius: number}[];

    constructor() {

    }

    public generate(scene: THREE.Scene, scale: number, track: Track, textureSky: THREE.Texture): void {
        this.track = track;
        this.scale = scale;
        this.textureSky = textureSky;

        this.addObjectsInScene(scene);
    }

    private addObjectsInScene(scene: THREE.Scene) {
        scene.add(this.generateTable());
        scene.add(this.generateRaceStartPlaid());

        this.generateIntersections().forEach(instersection => {
            scene.add(instersection);
        });

        this.generateSegments().forEach(instersection => {
            scene.add(instersection);
        });

        this.generateCones().then(cones => {
            cones.forEach(cone => {
                scene.add(cone);
            });
        });
    }

    private generateTable(): THREE.Mesh {
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y));
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y));

        const tableMaterial = new THREE.MeshStandardMaterial ( {color: 0xF0F0F0, roughness: 0, metalness: 0, envMap: this.textureSky} );
        const tableGeometry = new THREE.PlaneGeometry(
            (this.scale * (maximumX - minimumX)) + (this.scale * trackRadius * 10),
            (this.scale * (maximumY - minimumY)) + (this.scale * trackRadius * 10),
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

    private generateSegments(): THREE.Mesh[] {
        const material = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0, roughness: 0, envMap: this.textureSky});

        return this.track.trackIntersections.map((intersection, index, array) => {
            const fromPosition = intersection;
            const toPosition = array[index + 1 < array.length ? index + 1 : 0];

            const geometry = new THREE.PlaneGeometry(
                this.scale * this.getDistance(fromPosition, toPosition),
                this.scale * trackRadius * 2
            );
            geometry.rotateX(Math.PI / -2);

            const segmentMesh = new THREE.Mesh(geometry, material);

            segmentMesh.rotateY(- Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
            segmentMesh.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * this.scale;
            segmentMesh.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * this.scale;
            segmentMesh.position.y = 1;
            return segmentMesh;
        });
    }

    private getDistance(fromPosition: THREE.Vector2, toPosition: THREE.Vector2) {
        return Math.sqrt(Math.pow(fromPosition.x - toPosition.x, 2) + Math.pow(fromPosition.y - toPosition.y, 2));
    }

    private generateIntersections(): THREE.Mesh[] {
        const geometry = new THREE.CircleGeometry(this.scale * trackRadius, 32);
        geometry.rotateX(Math.PI / -2);
        const material = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0, roughness: 0, envMap: this.textureSky});

        return this.track.trackIntersections.map(intersection => {
            const intersectionMesh = new THREE.Mesh(geometry, material);
            intersectionMesh.position.x = intersection.x * this.scale;
            intersectionMesh.position.z = intersection.y * this.scale;
            intersectionMesh.position.y = 1;
            return intersectionMesh;
        });
    }

    private generateRaceStartPlaid(): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(this.scale * trackRadius * 2 / 20 * 3, this.scale * trackRadius * 2);
        geometry.rotateX(Math.PI / -2);
        const texture = THREE.ImageUtils.loadTexture('assets/plaid_start_v2.jpg');
        const material = new THREE.MeshStandardMaterial({map: texture, metalness: 0, roughness: 0, envMap: this.textureSky});
        const plaidMesh = new THREE.Mesh(geometry, material);

        const fromPosition = this.track.trackIntersections[0];
        const toPosition = this.track.trackIntersections[1];
        plaidMesh.rotateY(- Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
        plaidMesh.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * this.scale;
        plaidMesh.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * this.scale;
        plaidMesh.position.y = 2;

        return plaidMesh;
    }

    private generateCones(): Promise<THREE.Mesh[]> {
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y));
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y));

        const service = this;
        const loaderPromise = new Promise<THREE.Mesh[]>(function(resolve, reject) {
            function loadDone(cone) {
                cone.scale.set(20 * service.scale, 20 * service.scale, 20 * service.scale);
                const cones: THREE.Mesh[] = [];
                for (let i = 0; i < 10; i++) {
                    const newCone = <THREE.Mesh> cone.clone();
                    newCone.rotateY(Math.random() * Math.PI);
                    newCone.position.x = service.scale * ((Math.random() * (Math.abs(maximumX) + Math.abs(minimumX))) + minimumX);
                    newCone.position.z = service.scale * ((Math.random() * (Math.abs(maximumY) + Math.abs(minimumY))) + minimumY);
                    cones.push(newCone);
                }
                resolve(cones);
            }

            new THREE.ObjectLoader().load('/assets/cone.json', loadDone);
        });

        return loaderPromise;
    }
}
