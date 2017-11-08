import { LineCalculationService } from './line-calculation.service';
import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const trackRadius = 10;

const assetsPath = '/assets';

const coneAmount = 100;
const coneRadius = 1;
const conePath = 'cone.json';

const panelAmount = 10;
const panelRadius = 3;
const dylanPanelAmount = 'votonsdylan.json';
const michelPanelAmount = 'votonsmichel.json';

@Injectable()
export class DecorElementsService {

    private scene: THREE.Scene;

    private track: Track;

    private scale: number;

    constructor(private lineCalculationService: LineCalculationService) {
    }

    public placeDecor(scene: THREE.Scene, scale: number, track: Track): void {
        this.scene = scene;
        this.track = track;
        this.scale = scale;

        this.placeDecorElement(coneAmount, coneRadius, conePath);
        this.placeDecorElement(panelAmount, panelRadius, dylanPanelAmount);
        this.placeDecorElement(panelAmount, panelRadius, michelPanelAmount);
    }

    private loadMesh(path: string): Promise<THREE.Mesh> {
        return new Promise<THREE.Mesh>((resolve, reject) => {
            new THREE.ObjectLoader().load(`${assetsPath}/${path}`, mesh => {
                resolve(<THREE.Mesh> mesh);
            });
        });
    }

    private placeDecorElement(amount: number, distanceFromTrack: number, path: string): void {
        this.loadMesh(path).then(mesh => {
            mesh.scale.set(this.scale, this.scale, this.scale);

            for (let i = 0; i < amount; i++) {
                let availablePlacement: { position: THREE.Vector2, rotation: number };
                do {
                    availablePlacement = this.getFreePropPlacement(distanceFromTrack);
                } while (this.availableRadius(availablePlacement.position) < 1);

                const meshClone = <THREE.Mesh> mesh.clone();
                meshClone.position.set(availablePlacement.position.x * this.scale, 0, availablePlacement.position.y * this.scale);
                meshClone.rotateY(availablePlacement.rotation);
                this.scene.add(meshClone);
            }
        });
    }

    private getFreePropPlacement(requiredRadius: number): { position: THREE.Vector2, rotation: number } {
        const segment = Math.floor(Math.random() * this.track.trackIntersections.length);
        const line = new THREE.Vector2().subVectors(this.track.trackIntersections[
            segment + 1 === this.track.trackIntersections.length ? 0 : segment + 1
        ], this.track.trackIntersections[segment]);
        const lineAngle = Math.atan(line.x / line.y) + Math.PI / 2;

        const randomPosition = line.multiplyScalar(Math.random()).add(this.track.trackIntersections[segment]);
        const randomOffset = new THREE.Vector2(Math.sin(lineAngle), Math.cos(lineAngle)).multiplyScalar(trackRadius + requiredRadius);
        return { position: randomPosition.add(randomOffset.multiplyScalar(Math.random() < 0.5 ? 1 : -1)), rotation: lineAngle};
    }

    private availableRadius(point: THREE.Vector2): number {
        return Math.min.apply(null, this.track.trackIntersections.map( (intersection, index, array) => {
            const line = {point1: intersection, point2: array[index + 1 === array.length ? 0 : index + 1]};
            return this.lineCalculationService.getNearestPointOnLineWithClamping(point, line) - trackRadius;
        }));
    }
}
