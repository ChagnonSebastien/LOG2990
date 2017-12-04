import { VehicleMoveEvent } from './events/vehicle-move-event.service';
import { RacingGameService } from './racing-game.service';
import { LineCalculationService } from './line-calculation.service';
import { Injectable } from '@angular/core';
import { Track } from './track';
import { Vector2, Vector3 } from 'three';
import { Vehicle } from './vehicle';

@Injectable()
export class RoadLimitService {

    constructor(
        private lineCalculationService: LineCalculationService,
        private racingGameService: RacingGameService
    ) { }

    public validateMovement(vehicleMoveEvent: VehicleMoveEvent) {
        if (!this.isMovementValid(this.racingGameService.getTrack(), vehicleMoveEvent.getNewPosition())) {
            this.snapToTrack(vehicleMoveEvent.getVehicle(), vehicleMoveEvent.getNewPosition());
        }
    }

    private isMovementValid(track: Track, newPosition: Vector3): boolean {
        return track.distanceToPoint(new Vector2(newPosition.x / 25, newPosition.z / 25), this.lineCalculationService) < 10;
    }

    private snapToTrack(vehicle: Vehicle, newPosition: Vector3) {
        const track = this.racingGameService.getTrack();
        const newPositionRaw = new Vector2(newPosition.x / 25, newPosition.z / 25);
        const nearestPoint = track.getNearestPointOnTrack(newPositionRaw, this.lineCalculationService);
        const nearestPointOffset = new Vector2().subVectors(newPositionRaw, nearestPoint);
        const newPositionAjusted = new Vector2().addVectors(nearestPoint, nearestPointOffset.clampLength(0, 10)).multiplyScalar(25);
        newPosition.x = newPositionAjusted.x;
        newPosition.z = newPositionAjusted.y;
        vehicle.hitWall(Math.abs(Math.cos(
            (Math.atan(nearestPointOffset.y / nearestPointOffset.x)) + ((vehicle.getMesh().rotation.y % (Math.PI)))
        )));
    }
}
