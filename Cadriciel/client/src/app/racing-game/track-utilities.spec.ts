import { TrackUtilities } from './track-utilities';
import * as THREE from 'three';

fdescribe('TrackUtilities Module', () => {
    it('should calculate distance between (0,0) and (1,1)', () => {
        const vectorFrom = new THREE.Vector3(0 , 0, 0);
        const vectorTo = new THREE.Vector2(0, 1);
        expect(TrackUtilities.calculateDistanceFromIntersection(vectorFrom, vectorTo)).toEqual(1);
    });

    it('When car is at (0,0,0) and intersection at (0,3), should detect car is at intersection', () => {
        const intersection = new THREE.Vector2(0, 3);
        const carPosition = new THREE.Vector3(0, 0 , 0);

        expect(TrackUtilities.isAtIntersection(carPosition, intersection)).toBeTruthy();
    });
});
