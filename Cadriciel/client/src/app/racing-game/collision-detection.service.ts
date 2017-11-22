import { Injectable } from '@angular/core';
import * as THREE from 'three';

const assetsPath = '/assets';
const boundingBoxPath = 'cart_bounding_box.json';

@Injectable()
export class CollisionDetectionService {
    private boundingBoxes: Map<THREE.Mesh, THREE.Mesh>;

    constructor() {
        this.boundingBoxes = new Map<THREE.Mesh, THREE.Mesh>();
    }

    public initializeBoundingBox(vehicle: THREE.Mesh) {
        const loader = new THREE.ObjectLoader();
        loader.load(`${assetsPath}/${boundingBoxPath}`, (object: THREE.Object3D) => {
            const box = <THREE.Mesh> object;
            vehicle.add(box);
            this.boundingBoxes.set(vehicle, box);
        });
    }

    public getBox(vehicle: THREE.Mesh) {
        return this.boundingBoxes.get(vehicle);
    }

    public checkForCollisionWithCar(vehicle: THREE.Mesh) {
        const box = this.boundingBoxes.get(vehicle);
        for (const key of Array.from(this.boundingBoxes.keys())) {
            if (key !== vehicle) {
                const box2 = this.boundingBoxes.get(key);
                box.updateMatrixWorld(true);
                box2.updateMatrixWorld(true);

                const vertices1 = (<THREE.Geometry> box.geometry).vertices.map(vertice => {
                    const vector = vertice.clone();
                    vector.applyMatrix4(box.matrixWorld);
                    return vector;
                });

                const vertices2 = (<THREE.Geometry> box2.geometry).vertices.map(vertice => {
                    const vector = vertice.clone();
                    vector.applyMatrix4(box2.matrixWorld);
                    return vector;
                });


                if (this.checkForIntersection(vertices1, vertices2)) {
                    return true;
                }
            }
        }
        return false;
    }

    private checkForIntersection(box1: THREE.Vector3[], box2: THREE.Vector3[]): boolean {
        let foundIntersection = false;
        box1.forEach(vertice => {
            if (this.isVerticeInsideRectangle(vertice, box2)) {
                foundIntersection = true;
            }
        });

        return foundIntersection;
    }

    private isVerticeInsideRectangle(vertice: THREE.Vector3, box2: THREE.Vector3[]): boolean {
        const rectangleArea = this.getRectangleArea(box2[0], box2[1], box2[2], box2[3]);
        const triangleSumArea = this.getTriangleArea(box2[0], box2[1], vertice) +
                                this.getTriangleArea(box2[1], box2[2], vertice) +
                                this.getTriangleArea(box2[2], box2[3], vertice) +
                                this.getTriangleArea(box2[3], box2[0], vertice);
        return rectangleArea >= triangleSumArea;
    }

    private getRectangleArea(point1: THREE.Vector3, point2: THREE.Vector3, point3: THREE.Vector3, point4: THREE.Vector3): number {
        return this.getTriangleArea(point1, point2, point3) + this.getTriangleArea(point2, point3, point4);
    }

    private getTriangleArea(point1: THREE.Vector3, point2: THREE.Vector3, point3: THREE.Vector3): number {
        return Math.abs((point1.x * (point2.z - point3.z)) + (point2.x * (point3.z - point1.z)) + (point3.x * (point1.z - point2.z))) / 2;
    }
}
