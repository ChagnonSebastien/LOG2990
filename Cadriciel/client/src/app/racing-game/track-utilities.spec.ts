import { TrackUtilities } from './track-utilities';
import * as THREE from 'three';
import { Track } from './track';

describe('TrackUtilities Module', () => {

    const track = new Track(
        'name',
        'desc',
        'diff',
        [new THREE.Vector2(0, 100), new THREE.Vector2(0, 0), new THREE.Vector2(100, 0)],
        [],
        [],
        [],
        -1,
        0,
        []
    );

    it('should calculate distance between (0,0) and (1,1)', () => {
        const vectorFrom = new THREE.Vector3(0, 0, 0);
        const vectorTo = new THREE.Vector2(0, 1);
        expect(TrackUtilities.calculateDistanceFromIntersection(vectorFrom, vectorTo)).toEqual(1);
    });

    it('should get the center of a track', () => {
        const center = TrackUtilities.getCenterOfTrack(track);
        expect(center.x).toEqual(0);
        expect(center.y).toEqual(50);
    });
});
