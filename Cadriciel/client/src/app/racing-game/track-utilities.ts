import * as SETTINGS from './settings';
import * as THREE from 'three';

export module TrackUtilities {

    export function calculateDistanceFromIntersection(carPosition: THREE.Vector3, intersection: THREE.Vector2): number {
        const distanceY = Math.abs(carPosition.y - intersection.y);
        const distanceX = Math.abs(carPosition.x - intersection.x);
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        return distance;
    }

    export function isAtIntersection(carPosition: THREE.Vector3, intersection: THREE.Vector2): boolean {
        const distanceFromIntersection = this.calculateDistanceFromIntersection(carPosition, intersection);

        return distanceFromIntersection <= SETTINGS.TRACK_RADIUS;
    }

    export function getIntersections(): Array<THREE.Vector2> {
        return this.vehicleService.mainVehicle.getTrack().trackIntersections;
    }

    export function numberOfIntersections(): number {
        return this.getIntersections().length;
    }

    export function getVehiclePosition(): THREE.Vector3 {
        return this.vehicleService.mainVehicle.getVehicle().position;
    }

}
