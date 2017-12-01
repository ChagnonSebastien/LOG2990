import * as THREE from 'three';
import { Settings } from './settings';

export module TrackUtilities {

    export function calculateDistanceFromIntersection(carPosition: THREE.Vector3, intersection: THREE.Vector2): number {
        const distanceY = Math.abs((carPosition.z / Settings.SCENE_SCALE) - intersection.y);
        const distanceX = Math.abs((carPosition.x / Settings.SCENE_SCALE) - intersection.x);
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        return distance;
    }

    export function isAtIntersection(carPosition: THREE.Vector3, intersection: THREE.Vector2): boolean {
        const distanceFromIntersection = this.calculateDistanceFromIntersection(carPosition, intersection);
        return distanceFromIntersection <= Settings.MAX_CORNER_LENGTH_FROM_INTERSECTION;
    }

}
