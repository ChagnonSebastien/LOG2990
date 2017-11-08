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

    constructor() {
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
            return this.distanceFromPointToLine(point, line) - trackRadius;
        }));
    }

    private distanceFromPointToLine(point: THREE.Vector2, line: {point1: THREE.Vector2, point2: THREE.Vector2}): number {
        const optimalPoint = this.getNearestPointOnLine(point, line);

        if (
            Math.min(line.point1.x, line.point2.x) <= optimalPoint.x &&
            Math.max(line.point1.x, line.point2.x) >= optimalPoint.x
        ) {
            return this.distance(point, optimalPoint);
        } else {
            return Math.min(this.distance(point, line.point1), this.distance(point, line.point2));
        }
    }

    public distance(point1: THREE.Vector2, point2: THREE.Vector2): number {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    private getNearestPointOnLine(point: THREE.Vector2, line: {point1: THREE.Vector2, point2: THREE.Vector2}) {
        const lineParameters = this.getLineParameters(line);
        const permenticularParameters = {
            a: lineParameters.b,
            b: -lineParameters.a,
            c: -((lineParameters.b * point.x) + (-lineParameters.a * point.y))
        };

        return this.twoLineIntersection(lineParameters, permenticularParameters);
    }

    private getLineParameters(line): { a: number, b: number, c: number } {
        const a = line.point1.y - line.point2.y;
        const b = line.point2.x - line.point1.x;
        const c = (line.point1.x * line.point2.y) - (line.point2.x * line.point1.y);
        return { a, b, c };
    }

    private twoLineIntersection(line1, line2): THREE.Vector2 {
        if (line1.a === 0) {
            const x = ((line1.c * line2.b) - (line1.b * line2.c)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return new THREE.Vector2(x, this.solveLineEquationWithX(x, line1));
        } else {
            const y = ((line1.a * line2.c) - (line1.c * line2.a)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return new THREE.Vector2(this.solveLineEquationWithY(y, line1), y);
        }
    }

    private solveLineEquationWithX(x, lineParameters): number {
        return ((lineParameters.a * x) + lineParameters.c) / -lineParameters.b;
    }

    private solveLineEquationWithY(y, lineParameters): number {
        return ((lineParameters.b * y) + lineParameters.c) / -lineParameters.a;
    }

}
