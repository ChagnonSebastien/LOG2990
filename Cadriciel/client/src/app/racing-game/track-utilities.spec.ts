import { TrackUtilities } from './track-utilities';
import * as THREE from 'three';

describe('TrackUtilities Module', () => {
    it('should calculate distance between (0,0) and (1,1)', () => {
        const vectorFrom = new THREE.Vector3(0, 0, 0);
        const vectorTo = new THREE.Vector2(0, 1);
        expect(TrackUtilities.calculateDistanceFromIntersection(vectorFrom, vectorTo)).toEqual(1);
    });

    // --- TODO AFTER REFACTORING: test getIntersections(), numberOfIntersecionts and getVehiclePosition --- //

});
