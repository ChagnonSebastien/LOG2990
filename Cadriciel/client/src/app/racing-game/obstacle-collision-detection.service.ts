import { ObstaclePositionService } from './obstacle-position.service';
import { Vector3, Vector2 } from 'three';
import { ObstacleType } from './draw-track/obstacle';
import { Vehicle } from './vehicle';
import { ObstacleCollisionEventService, ObstacleCollisionEvent } from './events/obstacle-collision-event.service';
import { VehicleMoveEventService, VehicleMoveEvent } from './events/vehicle-move-event.service';
import { Injectable } from '@angular/core';
import * as SETTINGS from './settings';


@Injectable()
export class ObstacleCollisionDetectionService {

    constructor(
        vehicleMoveEventService: VehicleMoveEventService,
        private obstacleCollisionEventService: ObstacleCollisionEventService,
        private obstacleService: ObstaclePositionService
    ) {
        vehicleMoveEventService.getVehicleMoveObservable().subscribe((event: VehicleMoveEvent) => {
            this.detectCollision(event.getVehicle(), event.getNewPosition());
        });
    }

    public detectCollision(vehicle: Vehicle, toPosition: Vector3) {
        this.checkTypeObstacleCollision(vehicle, ObstacleType.Pothole);
        this.checkTypeObstacleCollision(vehicle, ObstacleType.Puddle);
        this.checkTypeObstacleCollision(vehicle, ObstacleType.Booster);
    }

    private checkTypeObstacleCollision(vehicle: Vehicle, type: ObstacleType) {
        this.obstacleService.getObstacles(type).forEach((obstacle: Vector2, index: number) => {
            const distance = this.distanceToObstacle(vehicle, obstacle);
            this.isColliding(vehicle, type, distance, index);
        });
    }

    private distanceToObstacle(vehicle: Vehicle, obstaclePosition: THREE.Vector2) {
        const obstaclePositionClone = obstaclePosition.clone().multiplyScalar(SETTINGS.SCENE_SCALE);
        return Math.sqrt(
            Math.pow(obstaclePositionClone.x - vehicle.getVehicle().position.x, 2) +
            Math.pow(obstaclePositionClone.y - vehicle.getVehicle().position.z, 2)
        );
    }

    private isColliding(vehicle: Vehicle, type: ObstacleType, distance: number, index: number) {
        if (distance < type * SETTINGS.SCENE_SCALE) {
            this.obstacleCollisionEventService.sendObstacleCollisionEvent(new ObstacleCollisionEvent(vehicle, type));
        }
    }
}
