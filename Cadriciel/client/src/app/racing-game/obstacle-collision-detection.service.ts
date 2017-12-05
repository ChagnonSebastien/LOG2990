import { ObstaclePositionService } from './obstacle-position.service';
import { Vector2 } from 'three';
import { ObstacleType } from './draw-track/obstacle';
import { Vehicle } from './vehicle';
import { ObstacleCollisionEventService, ObstacleCollisionEvent } from './events/obstacle-collision-event.service';
import { VehicleMoveEvent } from './events/vehicle-move-event.service';
import { Injectable } from '@angular/core';
import { Settings } from './settings';


@Injectable()
export class ObstacleCollisionDetectionService {

    constructor(
        private obstacleCollisionEventService: ObstacleCollisionEventService,
        private obstacleService: ObstaclePositionService
    ) { }

    public detectCollision(event: VehicleMoveEvent): void {
        this.checkTypeObstacleCollision(event.getVehicle(), ObstacleType.Pothole);
        this.checkTypeObstacleCollision(event.getVehicle(), ObstacleType.Puddle);
        this.checkTypeObstacleCollision(event.getVehicle(), ObstacleType.Booster);
    }

    private checkTypeObstacleCollision(vehicle: Vehicle, type: ObstacleType): void {
        this.obstacleService.getObstacles(type).forEach((obstacle: Vector2, index: number) => {
            const distance = this.distanceToObstacle(vehicle, obstacle);
            this.isColliding(vehicle, type, distance, index);
        });
    }

    private distanceToObstacle(vehicle: Vehicle, obstaclePosition: THREE.Vector2): number {
        const obstaclePositionClone = obstaclePosition.clone().multiplyScalar(Settings.SCENE_SCALE);
        return Math.sqrt(
            Math.pow(obstaclePositionClone.x - vehicle.getMesh().position.x, 2) +
            Math.pow(obstaclePositionClone.y - vehicle.getMesh().position.z, 2)
        );
    }

    private isColliding(vehicle: Vehicle, type: ObstacleType, distance: number, index: number): void {
        if (distance < type * Settings.SCENE_SCALE) {
            this.obstacleCollisionEventService.sendObstacleCollisionEvent(new ObstacleCollisionEvent(vehicle, type));
        }
    }
}
