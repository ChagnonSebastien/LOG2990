import * as THREE from 'three';
import { Settings } from './settings';
import { Track } from './track';

export module TrackUtilities {

    export function calculateDistanceFromIntersection(carPosition: THREE.Vector3, intersection: THREE.Vector2): number {
        const distanceY = Math.abs((carPosition.z / Settings.SCENE_SCALE) - intersection.y);
        const distanceX = Math.abs((carPosition.x / Settings.SCENE_SCALE) - intersection.x);
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        return distance;
    }

    export function getCenterOfTrack(track: Track): THREE.Vector2 {
        const fromPosition = track.trackIntersections[Settings.FIRST_INTERSECTION];
        const toPosition = track.trackIntersections[Settings.SECOND_INTERSECTION];
        const xCenter = ((toPosition.x - fromPosition.x) / 2) + fromPosition.x;
        const yCenter = ((toPosition.y - fromPosition.y) / 2) + fromPosition.y;
        const center = new THREE.Vector2(xCenter, yCenter);

        return center;
    }

}
