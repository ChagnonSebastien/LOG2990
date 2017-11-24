import { LoadingProgressEvent, LoadingProgressEventService } from './events/loading-progress-event.service';
import { VehicleService } from './vehicle.service';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import { VehicleMoveEventService, VehicleMoveEvent } from './events/vehicle-move-event.service';
import { Injectable } from '@angular/core';
import { Mesh, Geometry, Vector3, Object3D, ObjectLoader } from 'three';
import { Vehicle } from './vehicle';

const assetsPath = '/assets';
const boundingBoxPath = 'cart_bounding_box.json';

@Injectable()
export class CollisionDetectionService {
    constructor(
        vehicleMoveEventService: VehicleMoveEventService,
        private collisionEventService: CollisionEventService,
        private vehicleService: VehicleService,
        loadingProgressEventService: LoadingProgressEventService
    ) {
        loadingProgressEventService.getLoadingObservable().subscribe((event: LoadingProgressEvent) => {
            if (event.getProgress() === 'Vehicle created') {
                this.generateBoundingBox(<Vehicle> event.getObject());
            }
        });

        vehicleMoveEventService.getVehicleMoveObservable().subscribe((event: VehicleMoveEvent) => {
            this.checkForCollisionWithCar(event.getVehicle());
        });
    }

    private generateBoundingBox(vehicle: Vehicle): void {
        new ObjectLoader().load(`${assetsPath}/${boundingBoxPath}`, (box: Object3D) => {
            vehicle.setBoundingBox(<Mesh> box);
        });
    }

    private checkForCollisionWithCar(vehicle: Vehicle) {
        const box = vehicle.getBoundingBox();
        this.vehicleService.getVehicles().forEach((toCheck: Vehicle) => {
            if (toCheck !== vehicle) {
                const box2 = toCheck.getBoundingBox();

                box.updateMatrixWorld(true);
                const vertices1 = this.extractWorldVertices(box);
                box2.updateMatrixWorld(true);
                const vertices2 = this.extractWorldVertices(box2);

                const intersectingPoint = this.checkForIntersection(vertices1, vertices2);
                if (intersectingPoint !== null) {
                    this.collisionEventService.sendCollisionEvent(new CollisionEvent(vehicle, toCheck, intersectingPoint));
                }
            }
        });
    }

    private extractWorldVertices(object: Mesh): Vector3[] {
        return (<Geometry> object.geometry).vertices.map(vertice => {
            const vector = vertice.clone();
            vector.applyMatrix4(object.matrixWorld);
            return vector;
        });
    }

    private checkForIntersection(box1: Vector3[], box2: Vector3[]): Vector3 {
        let intersectingPoint = null;
        box1.forEach((vertice: Vector3) => {
            if (this.isVerticeInsideRectangle(vertice, box2)) {
                intersectingPoint = vertice;
            }
        });

        return intersectingPoint;
    }

    private isVerticeInsideRectangle(vertice: Vector3, box2: Vector3[]): boolean {
        const rectangleArea = this.getRectangleArea(box2[0], box2[1], box2[2], box2[3]);
        const triangleSumArea = this.getTriangleArea(box2[0], box2[1], vertice) +
                                this.getTriangleArea(box2[1], box2[2], vertice) +
                                this.getTriangleArea(box2[2], box2[3], vertice) +
                                this.getTriangleArea(box2[3], box2[0], vertice);
        return rectangleArea >= triangleSumArea;
    }

    private getRectangleArea(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): number {
        return this.getTriangleArea(point1, point2, point3) + this.getTriangleArea(point2, point3, point4);
    }

    private getTriangleArea(point1: Vector3, point2: Vector3, point3: Vector3): number {
        return Math.abs((point1.x * (point2.z - point3.z)) + (point2.x * (point3.z - point1.z)) + (point3.x * (point1.z - point2.z))) / 2;
    }
}
