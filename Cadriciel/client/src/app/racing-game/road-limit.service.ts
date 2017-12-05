import { VehicleMoveEvent } from './events/vehicle-move-event.service';
import { RacingGameService } from './racing-game.service';
import { LineCalculationService } from './line-calculation.service';
import { Injectable } from '@angular/core';
import { Track } from './track';
import { Vector2, Vector3 } from 'three';
import { Vehicle } from './vehicle';
import { HitWallEventService, HitWallEvent } from './events/hit-wall-event.service';
import { Settings } from './settings';

@Injectable()
export class RoadLimitService {

    constructor(
        private lineCalculationService: LineCalculationService,
        private racingGameService: RacingGameService,
        private hitWallEventService: HitWallEventService
    ) { }

    public validateMovement(vehicleMoveEvent: VehicleMoveEvent): void {
        if (!this.isMovementValid(this.racingGameService.getTrack(), vehicleMoveEvent.getNewPosition())) {
            this.snapToTrack(vehicleMoveEvent.getVehicle(), vehicleMoveEvent.getNewPosition());
            this.hitWallEventService.sendHitWallEvent(new HitWallEvent());
        }
    }

    private isMovementValid(track: Track, newPosition: Vector3): boolean {
        return track.distanceToPoint(
            new Vector2(newPosition.x / Settings.SCENE_SCALE, newPosition.z / Settings.SCENE_SCALE),
            this.lineCalculationService
        ) < Settings.TRACK_RADIUS * 2;
    }

    private snapToTrack(vehicle: Vehicle, newPosition: Vector3): void {
        const track = this.racingGameService.getTrack();
        const newPositionRaw = new Vector2(newPosition.x / Settings.SCENE_SCALE, newPosition.z / Settings.SCENE_SCALE);
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
